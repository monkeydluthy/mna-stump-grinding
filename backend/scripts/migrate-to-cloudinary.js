/**
 * Migration script to upload existing portfolio images/videos to Cloudinary
 * 
 * Usage:
 * 1. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env
 * 2. Run: node scripts/migrate-to-cloudinary.js
 */

require('dotenv').config()
const cloudinary = require('cloudinary').v2
const path = require('path')
const fs = require('fs')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const publicDir = path.join(__dirname, '../../frontend/public')
const portfolioFile = path.join(__dirname, '../portfolio.json')

// Portfolio images/videos to migrate
const portfolioFiles = [
  { file: 'portfolio-1.jpg', type: 'image', group: 'gallery-1' },
  { file: 'portfolio-2.jpg', type: 'image', group: 'gallery-1' },
  { file: 'portfolio-3.jpg', type: 'image', group: 'gallery-1' },
  { file: 'portfolio-4.jpg', type: 'image', group: 'gallery-1' },
  { file: 'portfolio-5.mp4', type: 'video', group: 'standalone' },
  { file: 'portfolio-6.jpg', type: 'image', group: 'gallery-2' },
  { file: 'portfolio-7.jpg', type: 'image', group: 'gallery-2' },
  { file: 'portfolio-8.jpg', type: 'image', group: 'gallery-2' },
  { file: 'portfolio-9.jpg', type: 'image', group: 'gallery-2' }
]

async function uploadToCloudinary(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'mna-stump-portfolio',
      resource_type: options.resourceType || 'auto',
      ...options
    }

    cloudinary.uploader.upload(filePath, uploadOptions, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

async function migrate() {
  try {
    console.log('🚀 Starting migration to Cloudinary...\n')

    // Verify Cloudinary credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Error: Cloudinary credentials not found in .env file')
      console.log('\nPlease add to backend/.env:')
      console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name')
      console.log('CLOUDINARY_API_KEY=your_api_key')
      console.log('CLOUDINARY_API_SECRET=your_api_secret')
      process.exit(1)
    }

    const portfolio = []
    const gallery1Images = []
    const gallery2Images = []

    // Upload each file
    for (const item of portfolioFiles) {
      const filePath = path.join(publicDir, item.file)
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${item.file} - file not found`)
        continue
      }

      console.log(`📤 Uploading ${item.file}...`)
      
      try {
        const resourceType = item.type === 'video' ? 'video' : 'image'
        const result = await uploadToCloudinary(filePath, {
          resource_type: resourceType,
          public_id: `portfolio-${item.file.replace(/\.[^/.]+$/, '')}` // Remove extension
        })

        console.log(`✅ Uploaded: ${result.secure_url}`)

        // Group into galleries or standalone
        if (item.group === 'gallery-1') {
          gallery1Images.push({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
          })
        } else if (item.group === 'gallery-2') {
          gallery2Images.push({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
          })
        } else if (item.group === 'standalone') {
          portfolio.push({
            id: `standalone-${Date.now()}`,
            type: 'standalone',
            mediaType: 'video',
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            description: 'Portfolio video',
            uploadedAt: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error(`❌ Error uploading ${item.file}:`, error.message)
      }
    }

    // Create gallery items
    if (gallery1Images.length > 0) {
      portfolio.push({
        id: `gallery-1-${Date.now()}`,
        type: 'gallery',
        images: gallery1Images.map(img => img.url),
        cloudinaryPublicIds: gallery1Images.map(img => img.publicId),
        description: 'Portfolio gallery 1',
        uploadedAt: new Date().toISOString()
      })
    }

    if (gallery2Images.length > 0) {
      portfolio.push({
        id: `gallery-2-${Date.now()}`,
        type: 'gallery',
        images: gallery2Images.map(img => img.url),
        cloudinaryPublicIds: gallery2Images.map(img => img.publicId),
        description: 'Portfolio gallery 2',
        uploadedAt: new Date().toISOString()
      })
    }

    // Save portfolio.json
    fs.writeFileSync(portfolioFile, JSON.stringify(portfolio, null, 2))
    console.log(`\n✅ Portfolio data saved to ${portfolioFile}`)
    console.log(`\n📊 Total items migrated: ${portfolio.length}`)
    console.log('\n🎉 Migration complete!')
    console.log('\nNext steps:')
    console.log('1. Review portfolio.json to verify the data')
    console.log('2. Update your frontend to use Cloudinary URLs')
    console.log('3. Deploy to Netlify with Cloudinary environment variables')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

