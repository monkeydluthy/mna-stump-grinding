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

async function fetchPlaceById(apiKey, placeId) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
  const response = await axios.get(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews',
    },
    timeout: 10000,
  })
  return response.data
}

/**
 * Resolve a fresh place when GOOGLE_PLACE_ID is stale/invalid.
 * Places API (New) SearchText can return rating/count/reviews in one call.
 */
async function fetchPlaceBySearch(apiKey) {
  const response = await axios.post(
    'https://places.googleapis.com/v1/places:searchText',
    { textQuery: SEARCH_QUERY },
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
  return places[0]
}

function isInvalidPlaceIdError(error) {
  const msg =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    ''
  return /place id is no longer valid|not found|invalid.*place/i.test(msg)
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
        'GOOGLE_PLACE_ID rejected by Places API (New); falling back to SearchText:',
        err.response?.data?.error?.message || err.message
      )
      placeData = await fetchPlaceBySearch(apiKey)
      resolvedVia = 'search_text'
      console.log(
        'Resolved place via SearchText:',
        placeData.id || placeData.name,
        placeData.displayName
      )
    }

    const payload = payloadFromPlace(placeData)

    cache = {
      body: payload,
      expiresAt: now + CACHE_TTL_MS,
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
