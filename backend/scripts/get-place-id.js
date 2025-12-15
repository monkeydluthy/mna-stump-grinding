/**
 * Helper script to get the Place ID from coordinates or business name
 * 
 * Usage:
 * 1. Set your GOOGLE_PLACES_API_KEY in .env
 * 2. Run: node scripts/get-place-id.js
 * 
 * Or provide coordinates/business name as arguments:
 * node scripts/get-place-id.js "M&A Stump Grinding" "28.0047936" "-82.538186"
 */

require('dotenv').config()
const axios = require('axios')

const businessName = process.argv[2] || 'M&A Stump Grinding'
const lat = process.argv[3] || '28.0047936'
const lng = process.argv[4] || '-82.538186'
const apiKey = process.env.GOOGLE_PLACES_API_KEY

if (!apiKey) {
  console.error('❌ Error: GOOGLE_PLACES_API_KEY not found in .env file')
  console.log('\nPlease add your API key to backend/.env:')
  console.log('GOOGLE_PLACES_API_KEY=your_api_key_here')
  process.exit(1)
}

async function getPlaceId() {
  try {
    console.log(`\n🔍 Searching for: ${businessName}`)
    console.log(`📍 Location: ${lat}, ${lng}\n`)

    // First, try to find the place using text search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(businessName)}&location=${lat},${lng}&radius=1000&key=${apiKey}`
    
    const searchResponse = await axios.get(searchUrl)
    
    if (searchResponse.data.status === 'OK' && searchResponse.data.results.length > 0) {
      const place = searchResponse.data.results[0]
      console.log('✅ Found your business!')
      console.log(`\n📍 Place ID: ${place.place_id}`)
      console.log(`📝 Name: ${place.name}`)
      console.log(`⭐ Rating: ${place.rating || 'N/A'}`)
      console.log(`📊 Total Reviews: ${place.user_ratings_total || 0}`)
      console.log(`\n📋 Add this to your backend/.env file:`)
      console.log(`GOOGLE_PLACE_ID=${place.place_id}\n`)
      return place.place_id
    } else {
      // Try nearby search as fallback
      console.log('⚠️  Text search didn\'t find exact match, trying nearby search...\n')
      const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&keyword=${encodeURIComponent(businessName)}&key=${apiKey}`
      
      const nearbyResponse = await axios.get(nearbyUrl)
      
      if (nearbyResponse.data.status === 'OK' && nearbyResponse.data.results.length > 0) {
        const place = nearbyResponse.data.results[0]
        console.log('✅ Found your business!')
        console.log(`\n📍 Place ID: ${place.place_id}`)
        console.log(`📝 Name: ${place.name}`)
        console.log(`⭐ Rating: ${place.rating || 'N/A'}`)
        console.log(`📊 Total Reviews: ${place.user_ratings_total || 0}`)
        console.log(`\n📋 Add this to your backend/.env file:`)
        console.log(`GOOGLE_PLACE_ID=${place.place_id}\n`)
        return place.place_id
      } else {
        console.error('❌ Could not find your business. Please check:')
        console.error('   - Business name is correct')
        console.error('   - Coordinates are correct')
        console.error('   - Your business is listed on Google Maps')
        console.error(`\nResponse: ${nearbyResponse.data.status}`)
        if (nearbyResponse.data.error_message) {
          console.error(`Error: ${nearbyResponse.data.error_message}`)
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('Response:', error.response.data)
    }
  }
}

getPlaceId()

