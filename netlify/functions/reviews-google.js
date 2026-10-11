const axios = require('axios')

/** In-memory cache — persists across warm Netlify function invocations */
let cache = {
  body: null,
  expiresAt: 0,
}

const CACHE_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours
const CACHE_CONTROL = 'public, s-maxage=43200, max-age=300' // CDN 12h, browsers 5m

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

    // Places API (New) — place resource name must be URL-encoded
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`

    const response = await axios.get(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
      },
      timeout: 10000,
    })

    const placeData = response.data || {}
    const reviews = (placeData.reviews || []).map(mapReview)

    const payload = {
      rating: typeof placeData.rating === 'number' ? placeData.rating : null,
      totalReviews:
        typeof placeData.userRatingCount === 'number'
          ? placeData.userRatingCount
          : null,
      reviews,
    }

    cache = {
      body: payload,
      expiresAt: now + CACHE_TTL_MS,
    }

    return jsonResponse(200, payload, {
      'Cache-Control': CACHE_CONTROL,
      'X-Reviews-Cache': 'MISS',
    })
  } catch (error) {
    console.error(
      'Error fetching Google Reviews:',
      error.response?.data || error.message
    )

    // Serve stale cache if Google fails mid-TTL window expired but we still have data
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
