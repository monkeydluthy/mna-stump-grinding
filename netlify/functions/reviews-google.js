const axios = require('axios')

/** In-memory cache — persists across warm Netlify function invocations */
let cache = {
  body: null,
  expiresAt: 0,
}

const CACHE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours
const CACHE_CONTROL = 'public, s-maxage=43200, max-age=300' // CDN 12h, browsers 5m
const SEARCH_QUERY = 'M&A Stump Grinding Thonotosassa FL'

function jsonResponse(statusCode, payload, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  }
}

function mapReview(review) {
  const text =
    (review.text && typeof review.text === 'object' && review.text.text) ||
    (typeof review.text === 'string' ? review.text : '') ||
    ''

  return {
    name: review.authorAttribution?.displayName || 'Google user',
    date: review.relativePublishTimeDescription || '',
    text,
    rating: typeof review.rating === 'number' ? review.rating : null,
    profilePhoto: review.authorAttribution?.photoUri || null,
    relativeTime: review.relativePublishTimeDescription || '',
  }
}

function payloadFromPlace(placeData) {
  return {
    rating: typeof placeData.rating === 'number' ? placeData.rating : null,
    totalReviews:
      typeof placeData.userRatingCount === 'number'
        ? placeData.userRatingCount
        : null,
    reviews: (placeData.reviews || []).map(mapReview),
  }
}

function placeResourcePath(placeId) {
  return String(placeId)
    .replace(/^places\//, '')
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}

async function fetchPlaceById(apiKey, placeId) {
  const url = `https://places.googleapis.com/v1/places/${placeResourcePath(placeId)}`
  const response = await axios.get(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'id,displayName,rating,userRatingCount,reviews.rating,reviews.text,reviews.authorAttribution,reviews.relativePublishTimeDescription,reviews.publishTime',
      'Accept-Language': 'en',
    },
    timeout: 10000,
  })
  return response.data
}

/** Written reviews when Places API (New) returns a count but an empty reviews list. */
async function fetchLegacyReviews(apiKey, placeId) {
  const id = String(placeId).replace(/^places\//, '')
  const url =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    `?place_id=${encodeURIComponent(id)}` +
    '&fields=reviews&reviews_sort=newest' +
    `&key=${encodeURIComponent(apiKey)}`
  const response = await axios.get(url, { timeout: 10000 })
  if (response.data?.status !== 'OK') return []
  return (response.data.result?.reviews || []).map((review) => ({
    name: review.author_name || 'Google user',
    date: review.relative_time_description || '',
    text: review.text || '',
    rating: typeof review.rating === 'number' ? review.rating : null,
    profilePhoto: review.profile_photo_url || null,
    relativeTime: review.relative_time_description || '',
  }))
}

/**
 * Resolve a fresh place when GOOGLE_PLACE_ID is stale/invalid.
 * Places API (New) SearchText can return rating/count/reviews in one call.
 */
async function fetchPlaceBySearch(apiKey) {
  const response = await axios.post(
    'https://places.googleapis.com/v1/places:searchText',
    {
      textQuery: SEARCH_QUERY,
      includePureServiceAreaBusinesses: true,
      locationBias: {
        circle: {
          center: { latitude: 28.0047936, longitude: -82.538186 },
          radius: 50000,
        },
      },
    },
    {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.rating,places.userRatingCount,places.reviews',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  )
  const places = response.data?.places || []
  if (!places.length) {
    const err = new Error('No places found for search query')
    err.code = 'NOT_FOUND'
    throw err
  }
  const found = places[0]
  if (found.id) {
    return fetchPlaceById(apiKey, found.id)
  }
  return found
}

function isInvalidPlaceIdError(error) {
  const status = error.response?.status
  if (status === 400 || status === 404) return true
  const msg =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    ''
  return /place id is no longer valid|not found|invalid.*place|status code 404/i.test(
    msg
  )
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { error: 'Method not allowed' })
  }

  const now = Date.now()
  if (cache.body && cache.expiresAt > now) {
    return jsonResponse(200, cache.body, {
      'Cache-Control': CACHE_CONTROL,
      'X-Reviews-Cache': 'HIT',
    })
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    if (!apiKey) {
      return jsonResponse(500, {
        error: 'Google Places API key not configured',
        message: 'Please set GOOGLE_PLACES_API_KEY environment variable',
      })
    }

    if (!placeId || placeId === 'YOUR_PLACE_ID_HERE') {
      return jsonResponse(500, {
        error: 'Google Place ID not configured',
        message: 'Please set GOOGLE_PLACE_ID environment variable',
      })
    }

    let placeData
    let resolvedVia = 'place_id'

    try {
      placeData = await fetchPlaceById(apiKey, placeId)
    } catch (err) {
      if (!isInvalidPlaceIdError(err)) throw err
      console.warn(
        'GOOGLE_PLACE_ID rejected; falling back to SearchText:',
        err.response?.data?.error?.message || err.message
      )
      placeData = await fetchPlaceBySearch(apiKey)
      resolvedVia = 'search_text'
    }

    const payload = payloadFromPlace(placeData)
    if (!payload.reviews.length && placeData.id) {
      payload.reviews = await fetchLegacyReviews(apiKey, placeData.id)
    }

    const cacheFor = payload.reviews.length ? CACHE_TTL_MS : 60 * 1000
    cache = {
      body: payload,
      expiresAt: now + cacheFor,
    }

    return jsonResponse(200, payload, {
      'Cache-Control': CACHE_CONTROL,
      'X-Reviews-Cache': 'MISS',
      'X-Reviews-Resolved-Via': resolvedVia,
    })
  } catch (error) {
    console.error(
      'Error fetching Google Reviews:',
      error.response?.data || error.message
    )

    if (cache.body) {
      return jsonResponse(200, cache.body, {
        'Cache-Control': CACHE_CONTROL,
        'X-Reviews-Cache': 'STALE',
      })
    }

    const status = error.response?.status || 500
    return jsonResponse(status >= 400 && status < 600 ? status : 500, {
      error: 'Failed to fetch reviews',
      message:
        error.response?.data?.error?.message ||
        error.message ||
        'Unknown error',
    })
  }
}
