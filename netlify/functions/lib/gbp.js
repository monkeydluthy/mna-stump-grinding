const axios = require('axios')

const SCOPE = 'https://www.googleapis.com/auth/business.manage'
const STARS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }

function oauthCredentials() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || ''
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || ''
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN || ''
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret, refreshToken }
}

function redirectUri() {
  return 'https://mnastumpgrinding.com/api/google-business/callback'
}

function authUrl(state) {
  const creds = oauthCredentials()
  const params = new URLSearchParams({
    client_id: creds.clientId,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

function relativeTime(iso) {
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000))
  const steps = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [unit, label] of steps) {
    const count = Math.floor(seconds / unit)
    if (count >= 1) return `${count} ${label}${count === 1 ? '' : 's'} ago`
  }
  return 'just now'
}

function mapReview(review) {
  const when = relativeTime(review.createTime || review.updateTime)
  return {
    name: review.reviewer?.displayName || 'Google user',
    date: when,
    text: typeof review.comment === 'string' ? review.comment : '',
    rating: STARS[review.starRating] ?? null,
    profilePhoto: review.reviewer?.profilePhotoUrl || null,
    relativeTime: when,
  }
}

async function postToken(params) {
  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    new URLSearchParams(params).toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000,
    }
  )
  return response.data
}

async function accessTokenFromRefresh(creds) {
  const data = await postToken({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken,
    grant_type: 'refresh_token',
  })
  if (!data.access_token) {
    throw new Error('Google did not return an access token')
  }
  return data.access_token
}

async function exchangeAuthCode(creds, code) {
  return postToken({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    code,
    redirect_uri: redirectUri(),
    grant_type: 'authorization_code',
  })
}

function parentFor(accountName, locationName) {
  const location = String(locationName || '')
  if (location.startsWith('accounts/')) return location
  return `${accountName}/${location}`
}

async function listLocations(token) {
  const accountsRes = await axios.get(
    'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
    { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
  )
  const accounts = accountsRes.data.accounts || []
  const found = []
  for (const account of accounts) {
    const locRes = await axios.get(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { readMask: 'name,title', pageSize: 100 },
        timeout: 10000,
      }
    )
    for (const location of locRes.data.locations || []) {
      found.push({
        title: location.title || '',
        parent: parentFor(account.name, location.name),
      })
    }
  }
  return found
}

function isMnaLocation(title) {
  return /m\s*&\s*a/i.test(title || '') && /stump/i.test(title || '')
}

function pickLocation(locations) {
  const pinned = process.env.GOOGLE_BUSINESS_PARENT
  if (pinned) {
    const match = locations.find((location) => location.parent === pinned)
    return match && isMnaLocation(match.title) ? match : null
  }
  return locations.find((location) => isMnaLocation(location.title)) || null
}

const V4 = 'https://mybusiness.googleapis.com/v4'

async function listReviewPages(token, parent, params) {
  let pageToken
  let rating = null
  let totalReviews = null
  const raw = []
  const keys = new Set()
  for (let page = 0; page < 5; page += 1) {
    const response = await axios.get(`${V4}/${parent}/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { ...params, ...(pageToken ? { pageToken } : {}) },
      timeout: 10000,
    })
    const data = response.data || {}
    Object.keys(data).forEach((key) => keys.add(key))
    if (typeof data.averageRating === 'number') rating = data.averageRating
    if (typeof data.totalReviewCount === 'number') totalReviews = data.totalReviewCount
    if (Array.isArray(data.reviews)) raw.push(...data.reviews)
    pageToken = data.nextPageToken
    if (!pageToken || raw.length >= 50) break
  }
  return { rating, totalReviews, raw, keys: [...keys].join(',') }
}

/** Second endpoint for the same data; some listings return only totals from reviews.list. */
async function batchGetReviews(token, parent) {
  const account = parent.split('/locations/')[0]
  const response = await axios.post(
    `${V4}/${account}/locations:batchGetReviews`,
    {
      locationNames: [parent],
      pageSize: 50,
      orderBy: 'updateTime desc',
      ignoreRatingOnlyReviews: false,
    },
    { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
  )
  const entries = response.data?.locationReviews || []
  const raw = []
  for (const entry of entries) {
    // Only accept rows for the exact location we asked for.
    if (entry.name !== parent) continue
    if (entry.review) raw.push(entry.review)
  }
  return { raw, keys: Object.keys(response.data || {}).join(',') }
}

async function reviewsForParent(token, parent) {
  const attempts = []
  let result = await listReviewPages(token, parent, { pageSize: 50, orderBy: 'updateTime desc' })
  attempts.push(`list:${result.raw.length}:${result.keys}`)
  let raw = result.raw

  if (raw.length === 0 && result.totalReviews > 0) {
    // Retry without ordering/page size in case those parameters suppress the array.
    const plain = await listReviewPages(token, parent, {})
    attempts.push(`list-plain:${plain.raw.length}:${plain.keys}`)
    raw = plain.raw
  }
  if (raw.length === 0 && result.totalReviews > 0) {
    try {
      const batch = await batchGetReviews(token, parent)
      attempts.push(`batch:${batch.raw.length}:${batch.keys}`)
      raw = batch.raw
    } catch (error) {
      attempts.push(`batch-error:${error.response?.status || error.message}`)
    }
  }

  return {
    rating: result.rating,
    totalReviews: result.totalReviews,
    reviews: raw.map(mapReview).slice(0, 12),
    rawCount: raw.length,
    responseKeys: attempts.join(' | '),
  }
}

/** Null when the owner sign-in has not been saved yet. */
async function fetchBusinessProfileReviews() {
  const creds = oauthCredentials()
  if (!creds?.refreshToken) return null
  const token = await accessTokenFromRefresh(creds)
  const locations = await listLocations(token)
  const location = pickLocation(locations)
  const titles = locations.map((item) => item.title || 'untitled').join(' | ')
  if (!location) {
    const err = new Error(`No M&A Stump Grinding location on this account: ${titles}`)
    err.profileNotes = titles
    throw err
  }
  const payload = await reviewsForParent(token, location.parent)
  payload.profileNotes = `${location.title}:${payload.rawCount}/${payload.totalReviews}:${payload.responseKeys}`
  return payload
}

module.exports = {
  oauthCredentials,
  redirectUri,
  authUrl,
  exchangeAuthCode,
  accessTokenFromRefresh,
  listLocations,
  pickLocation,
  reviewsForParent,
  fetchBusinessProfileReviews,
}
