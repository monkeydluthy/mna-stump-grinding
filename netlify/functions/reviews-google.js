const axios = require('axios')

// Helper function to format review date
function formatReviewDate(timestamp) {
  if (!timestamp) return 'Recently'
  
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
  }
}

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.GOOGLE_PLACE_ID
    
    console.log('Function called - API Key present:', !!apiKey, 'Place ID:', placeId)

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Google Places API key not configured',
          message: 'Please set GOOGLE_PLACES_API_KEY environment variable'
        })
      }
    }

    if (!placeId || placeId === 'YOUR_PLACE_ID_HERE') {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Google Place ID not configured',
          message: 'Please set GOOGLE_PLACE_ID environment variable'
        })
      }
    }

    // Get place details to get the rating and reviews
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`
    
    const response = await axios.get(placeDetailsUrl)
    
    if (response.data.status !== 'OK') {
      console.error('Google Places API Error:', response.data.status, response.data.error_message)
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          error: 'Failed to fetch reviews',
          message: response.data.error_message || 'Invalid place ID or API key'
        })
      }
    }

    const placeData = response.data.result
    
    // Format the reviews data
    const reviews = (placeData.reviews || []).map(review => ({
      name: review.author_name,
      date: formatReviewDate(review.time),
      text: review.text,
      rating: review.rating,
      profilePhoto: review.profile_photo_url || null,
      relativeTime: review.relative_time_description || ''
    }))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        rating: placeData.rating || 0,
        totalReviews: placeData.user_ratings_total || 0,
        reviews: reviews
      })
    }
  } catch (error) {
    console.error('Error fetching Google Reviews:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch reviews',
        message: error.message 
      })
    }
  }
}

