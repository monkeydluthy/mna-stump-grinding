const { createClient } = require('@supabase/supabase-js')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not configured')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Set CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

// Verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  try {
    const token = authHeader.substring(7)
    const JWT_SECRET = process.env.JWT_SECRET || 'mna-stump-grinding-secret-key-change-in-production'
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Transform Supabase data to frontend format
function transformPortfolioItem(item) {
  const transformed = {
    id: item.id,
    type: item.type,
    uploadedAt: item.uploaded_at,
    description: item.description || ''
  }

  if (item.type === 'gallery') {
    transformed.images = item.images ? (typeof item.images === 'string' ? JSON.parse(item.images) : item.images) : []
    transformed.cloudinaryPublicIds = item.cloudinary_public_ids ? (typeof item.cloudinary_public_ids === 'string' ? JSON.parse(item.cloudinary_public_ids) : item.cloudinary_public_ids) : []
  } else if (item.type === 'before-after') {
    transformed.beforeImage = item.before_image_cloudinary_url || item.before_image
    transformed.afterImage = item.after_image_cloudinary_url || item.after_image
    transformed.beforeImageCloudinaryUrl = item.before_image_cloudinary_url
    transformed.afterImageCloudinaryUrl = item.after_image_cloudinary_url
  } else {
    transformed.cloudinaryUrl = item.cloudinary_url
    transformed.cloudinaryPublicId = item.cloudinary_public_id
    transformed.mediaType = item.media_type || 'image'
    transformed.filename = item.filename || item.cloudinary_url
  }

  return transformed
}

exports.handler = async (event, context) => {
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
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to fetch portfolio', details: error.message })
        }
      }

      const transformed = (data || []).map(transformPortfolioItem)
      console.log('GET /api/portfolio - Returning', transformed.length, 'items')
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(transformed)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch portfolio', details: error.message })
      }
    }
  }

  // POST - Upload new item (requires authentication)
  if (event.httpMethod === 'POST') {
    try {
      // Check authentication
      const authHeader = event.headers.authorization || event.headers.Authorization
      const user = verifyToken(authHeader)
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const body = JSON.parse(event.body || '{}')
      const { type, cloudinaryUrl, cloudinaryPublicId, description, images, beforeImage, afterImage, beforeImageCloudinaryUrl, afterImageCloudinaryUrl, mediaType } = body

      if (!cloudinaryUrl && !images && !beforeImageCloudinaryUrl) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        }
      }

      const newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: type || 'standalone',
        description: description || ''
      }

      if (type === 'gallery' && images) {
        newItem.images = JSON.stringify(images)
        newItem.cloudinary_public_ids = body.cloudinaryPublicIds ? JSON.stringify(body.cloudinaryPublicIds) : null
      } else if (type === 'before-after') {
        newItem.before_image = beforeImage
        newItem.after_image = afterImage
        newItem.before_image_cloudinary_url = beforeImageCloudinaryUrl
        newItem.after_image_cloudinary_url = afterImageCloudinaryUrl
      } else {
        newItem.cloudinary_url = cloudinaryUrl
        newItem.cloudinary_public_id = cloudinaryPublicId
        newItem.media_type = mediaType || 'image'
        newItem.filename = cloudinaryUrl
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([newItem])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to add portfolio item', details: error.message })
        }
      }

      const transformed = transformPortfolioItem(data)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Item added successfully', item: transformed })
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to add portfolio item', details: error.message })
      }
    }
  }

  // PUT - Update item (requires authentication)
  if (event.httpMethod === 'PUT') {
    try {
      // Check authentication
      const authHeader = event.headers.authorization || event.headers.Authorization
      const user = verifyToken(authHeader)
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        }
      }

      const body = JSON.parse(event.body || '{}')
      const { id, description } = body

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Item ID required' })
        }
      }

      // Update only the description field
      const updateData = {}
      if (description !== undefined) {
        updateData.description = description
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to update portfolio item', details: error.message })
        }
      }

      const transformed = transformPortfolioItem(data)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Item updated successfully', item: transformed })
      }
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update portfolio item', details: error.message })
      }
    }
  }

  // DELETE - Remove item (requires authentication)
  if (event.httpMethod === 'DELETE') {
    try {
      // Check authentication
      const authHeader = event.headers.authorization || event.headers.Authorization
      const user = verifyToken(authHeader)
      
      if (!user) {
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

      // Get item first to get Cloudinary public IDs
      const { data: item, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Item not found' })
        }
      }

      // Delete from Cloudinary if public ID exists
      if (item.cloudinary_public_id) {
        try {
          await cloudinary.uploader.destroy(item.cloudinary_public_id)
        } catch (cloudinaryError) {
          console.error('Error deleting from Cloudinary:', cloudinaryError)
        }
      }

      // Delete multiple images if gallery
      if (item.cloudinary_public_ids) {
        const publicIds = typeof item.cloudinary_public_ids === 'string' 
          ? JSON.parse(item.cloudinary_public_ids) 
          : item.cloudinary_public_ids
        
        for (const publicId of publicIds) {
          try {
            await cloudinary.uploader.destroy(publicId)
          } catch (cloudinaryError) {
            console.error('Error deleting from Cloudinary:', cloudinaryError)
          }
        }
      }

      // Delete from Supabase
      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)

      if (deleteError) {
        console.error('Supabase delete error:', deleteError)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to delete portfolio item', details: deleteError.message })
        }
      }

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
        body: JSON.stringify({ error: 'Failed to delete portfolio item', details: error.message })
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}
