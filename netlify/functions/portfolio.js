const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Portfolio data file path
const portfolioDataFile = path.join(__dirname, 'portfolio-data.json')

// Initialize portfolio data from file or environment variable
function getPortfolioData() {
  // Try to read from file first
  try {
    if (fs.existsSync(portfolioDataFile)) {
      const data = fs.readFileSync(portfolioDataFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('Error reading portfolio file:', e)
  }

  // Fallback to environment variable
  if (process.env.PORTFOLIO_DATA) {
    try {
      return JSON.parse(process.env.PORTFOLIO_DATA)
    } catch (e) {
      console.error('Error parsing PORTFOLIO_DATA:', e)
    }
  }

  // Default empty array
  return []
}

function savePortfolioData(data) {
  try {
    // Try to write to file (may not work in Netlify Functions, but worth trying)
    fs.writeFileSync(portfolioDataFile, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('Error writing portfolio file:', e)
    // In production, you'd save to a database or external storage
    // For Netlify, consider using Netlify KV storage or Upstash Redis
  }
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // GET - Fetch all portfolio items
  if (event.httpMethod === 'GET') {
    try {
      const portfolio = getPortfolioData()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(portfolio)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch portfolio' })
      }
    }
  }

  // POST - Upload new item (requires authentication)
  if (event.httpMethod === 'POST') {
    try {
      // Check authentication
      const authHeader = event.headers.authorization || event.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const jwt = require('jsonwebtoken')
      const JWT_SECRET = process.env.JWT_SECRET || 'mna-stump-grinding-secret-key-change-in-production'
      
      try {
        const token = authHeader.substring(7)
        jwt.verify(token, JWT_SECRET)
      } catch (jwtError) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const body = JSON.parse(event.body || '{}')
      const { type, cloudinaryUrl, cloudinaryPublicId, description, images, beforeImage, afterImage, mediaType } = body

      if (!cloudinaryUrl && !images) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        }
      }

      const portfolio = getPortfolioData()
      const newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: type || 'standalone',
        uploadedAt: new Date().toISOString(),
        description: description || ''
      }

      if (type === 'gallery' && images) {
        newItem.images = images
        newItem.cloudinaryPublicIds = body.cloudinaryPublicIds || []
      } else if (type === 'before-after') {
        newItem.beforeImage = beforeImage
        newItem.afterImage = afterImage
        newItem.beforeImageCloudinaryUrl = body.beforeImageCloudinaryUrl
        newItem.afterImageCloudinaryUrl = body.afterImageCloudinaryUrl
      } else {
        newItem.cloudinaryUrl = cloudinaryUrl
        newItem.cloudinaryPublicId = cloudinaryPublicId
        newItem.mediaType = mediaType || 'image'
        newItem.filename = cloudinaryUrl // For compatibility
      }

      portfolio.push(newItem)
      savePortfolioData(portfolio)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Item added successfully', item: newItem })
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to add portfolio item' })
      }
    }
  }

  // DELETE - Remove item (requires authentication)
  if (event.httpMethod === 'DELETE') {
    try {
      // Check authentication
      const authHeader = event.headers.authorization || event.headers.Authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const jwt = require('jsonwebtoken')
      const JWT_SECRET = process.env.JWT_SECRET || 'mna-stump-grinding-secret-key-change-in-production'
      
      try {
        const token = authHeader.substring(7)
        jwt.verify(token, JWT_SECRET)
      } catch (jwtError) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const { id } = event.queryStringParameters || {}

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Item ID required' })
        }
      }

      const portfolio = getPortfolioData()
      const itemIndex = portfolio.findIndex(item => item.id === id)

      if (itemIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Item not found' })
        }
      }

      const item = portfolio[itemIndex]

      // Delete from Cloudinary if public ID exists
      if (item.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(item.cloudinaryPublicId)
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError)
        }
      }

      // Delete multiple images if gallery
      if (item.cloudinaryPublicIds && item.cloudinaryPublicIds.length > 0) {
        for (const publicId of item.cloudinaryPublicIds) {
          try {
            await cloudinary.uploader.destroy(publicId)
          } catch (cloudinaryError) {
            console.error('Error deleting from Cloudinary:', cloudinaryError)
          }
        }
      }

      portfolio.splice(itemIndex, 1)
      savePortfolioData(portfolio)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Item deleted successfully' })
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to delete portfolio item' })
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}

