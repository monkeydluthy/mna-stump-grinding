const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const JWT_SECRET = process.env.JWT_SECRET || 'mna-stump-grinding-secret-key-change-in-production'

// Set CORS headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
})

// Verify JWT token
function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  try {
    const token = authHeader.substring(7)
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Upload file to Cloudinary from base64
async function uploadToCloudinary(base64Data, options = {}) {
  return new Promise((resolve, reject) => {
    // Cloudinary expects data URI format: data:image/jpeg;base64,{base64}
    // But we're receiving just the base64 string, so we need to add the prefix
    const dataUri = base64Data.includes('data:') 
      ? base64Data 
      : `data:${options.mimeType || 'image/jpeg'};base64,${base64Data}`
    
    const uploadOptions = {
      folder: 'mna-stump-portfolio',
      resource_type: options.resource_type || 'auto',
      ...options
    }

    cloudinary.uploader.upload(dataUri, uploadOptions, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

exports.handler = async (event, context) => {
  const headers = getHeaders()

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

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

  try {
    const body = JSON.parse(event.body || '{}')
    const { file, fileName, fileType, uploadType, description, beforeImage, afterImage, galleryFiles } = body

    // Upload standalone file
    if (uploadType === 'standalone') {
      if (!file) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No file provided' })
        }
      }

      // Determine resource type
      const isVideo = fileType && fileType.startsWith('video/')
      const resourceType = isVideo ? 'video' : 'image'
      const result = await uploadToCloudinary(file, {
        resource_type: resourceType,
        mimeType: fileType,
        public_id: `portfolio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          cloudinaryUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          mediaType: resourceType,
          width: result.width,
          height: result.height,
          format: result.format
        })
      }
    }

    // Upload before/after images
    if (uploadType === 'before-after') {
      if (!beforeImage || !afterImage) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Both before and after images are required' })
        }
      }

      const beforeResult = await uploadToCloudinary(beforeImage, {
        resource_type: 'image',
        mimeType: 'image/jpeg',
        public_id: `portfolio-before-${Date.now()}`
      })

      const afterResult = await uploadToCloudinary(afterImage, {
        resource_type: 'image',
        mimeType: 'image/jpeg',
        public_id: `portfolio-after-${Date.now()}`
      })

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          beforeImage: {
            cloudinaryUrl: beforeResult.secure_url,
            cloudinaryPublicId: beforeResult.public_id
          },
          afterImage: {
            cloudinaryUrl: afterResult.secure_url,
            cloudinaryPublicId: afterResult.public_id
          }
        })
      }
    }

    // Upload gallery (multiple files)
    if (uploadType === 'gallery') {
      if (!galleryFiles || !Array.isArray(galleryFiles) || galleryFiles.length === 0) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Gallery files are required' })
        }
      }

      const uploadPromises = galleryFiles.map((fileData, index) => 
        uploadToCloudinary(fileData, {
          resource_type: 'image',
          mimeType: 'image/jpeg',
          public_id: `portfolio-gallery-${Date.now()}-${index}`
        })
      )

      const results = await Promise.all(uploadPromises)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          images: results.map(result => ({
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
          }))
        })
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid upload type' })
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Upload failed',
        message: error.message 
      })
    }
  }
}

