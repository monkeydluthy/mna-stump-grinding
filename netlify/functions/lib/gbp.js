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
    return locations.find((location) => location.parent === pinned) || null
  }
  return locations.find((location) => isMnaLocation(location.title)) || null
}

async function reviewsForParent(token, parent) {
  const response = await axios.get(
    `https://mybusiness.googleapis.com/v4/${parent}/reviews`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageSize: 50 },
      timeout: 10000,
    }
  )
  const data = response.data || {}
  const raw = Array.isArray(data.reviews) ? data.reviews : []
  return {
    rating: typeof data.averageRating === 'number' ? data.averageRating : null,
    totalReviews: typeof data.totalReviewCount === 'number' ? data.totalReviewCount : null,
    reviews: raw.map(mapReview),
    rawCount: raw.length,
    responseKeys: Object.keys(data).join(','),
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
