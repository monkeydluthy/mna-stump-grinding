const express = require('express')
const axios = require('axios')
const router = express.Router()

/**
 * Local Express mirror of netlify/functions/reviews-google.js
 * Uses Places API (New) + same env var names (server-side only).
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

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
    const response = await axios.get(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews',
      },
      timeout: 10000,
    })

    const placeData = response.data || {}
    const reviews = (placeData.reviews || []).map((review) => {
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
    })

    res.json({
      rating: typeof placeData.rating === 'number' ? placeData.rating : null,
      totalReviews:
        typeof placeData.userRatingCount === 'number'
          ? placeData.userRatingCount
          : null,
      reviews,
    })
  } catch (error) {
    console.error('Error fetching Google Reviews:', error.response?.data || error.message)
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message:
        error.response?.data?.error?.message || error.message || 'Unknown error',
    })
  }
})

module.exports = router
