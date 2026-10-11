const express = require('express')
const axios = require('axios')
const router = express.Router()

const SEARCH_QUERY = 'M&A Stump Grinding Thonotosassa FL'

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

function isInvalidPlaceIdError(error) {
  const msg =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    error.message ||
    ''
  return /place id is no longer valid|not found|invalid.*place/i.test(msg)
}

/**
 * Local Express mirror of netlify/functions/reviews-google.js
 */
router.get('/google', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID

    if (!apiKey) {
      return res.status(500).json({
        error: 'Google Places API key not configured',
        message: 'Please set GOOGLE_PLACES_API_KEY environment variable',
      })
    }

    if (!placeId || placeId === 'YOUR_PLACE_ID_HERE') {
      return res.status(500).json({
        error: 'Google Place ID not configured',
        message: 'Please set GOOGLE_PLACE_ID environment variable',
      })
    }

    let placeData
    try {
      const response = await axios.get(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
        {
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'id,displayName,rating,userRatingCount,reviews',
          },
          timeout: 10000,
        }
      )
      placeData = response.data
    } catch (err) {
      if (!isInvalidPlaceIdError(err)) throw err
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
        return res.status(404).json({
          error: 'Failed to fetch reviews',
          message: 'No matching Google place found',
        })
      }
      placeData = places[0]
    }

    res.json(payloadFromPlace(placeData))
  } catch (error) {
    console.error(
      'Error fetching Google Reviews:',
      error.response?.data || error.message
    )
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message:
        error.response?.data?.error?.message ||
        error.message ||
        'Unknown error',
    })
  }
})

module.exports = router
