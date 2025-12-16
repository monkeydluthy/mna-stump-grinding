/**
 * Migration script to move existing portfolio data to Supabase
 * 
 * Usage:
 * 1. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env
 * 2. Run: node scripts/migrate-to-supabase.js
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in backend/.env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const portfolioFile = path.join(__dirname, '../portfolio.json')

async function migrate() {
  try {
    console.log('🚀 Starting migration to Supabase...\n')

    // Read existing portfolio data
    let portfolioData = []
    if (fs.existsSync(portfolioFile)) {
      portfolioData = JSON.parse(fs.readFileSync(portfolioFile, 'utf8'))
      console.log(`📦 Found ${portfolioData.length} items in portfolio.json\n`)
    } else {
      console.log('⚠️  No portfolio.json found, checking portfolio-data.json...\n')
      const portfolioDataFile = path.join(__dirname, '../../netlify/functions/portfolio-data.json')
      if (fs.existsSync(portfolioDataFile)) {
        portfolioData = JSON.parse(fs.readFileSync(portfolioDataFile, 'utf8'))
        console.log(`📦 Found ${portfolioData.length} items in portfolio-data.json\n`)
      }
    }

    if (portfolioData.length === 0) {
      console.log('⚠️  No portfolio data found to migrate.')
      return
    }

    // Transform data for Supabase
    const transformedItems = portfolioData.map(item => ({
      id: item.id,
      type: item.type,
      media_type: item.mediaType || null,
      cloudinary_url: item.cloudinaryUrl || null,
      cloudinary_public_id: item.cloudinaryPublicId || null,
      filename: item.filename || item.cloudinaryUrl || null,
      images: item.images ? JSON.stringify(item.images) : null,
      cloudinary_public_ids: item.cloudinaryPublicIds ? JSON.stringify(item.cloudinaryPublicIds) : null,
      before_image: item.beforeImage || null,
      after_image: item.afterImage || null,
      before_image_cloudinary_url: item.beforeImageCloudinaryUrl || null,
      after_image_cloudinary_url: item.afterImageCloudinaryUrl || null,
      description: item.description || '',
      uploaded_at: item.uploadedAt || new Date().toISOString()
    }))

    // Insert into Supabase
    console.log('📤 Uploading to Supabase...\n')
    const { data, error } = await supabase
      .from('portfolio_items')
      .upsert(transformedItems, { onConflict: 'id' })

    if (error) {
      console.error('❌ Error uploading to Supabase:', error)
      process.exit(1)
    }

    console.log(`✅ Successfully migrated ${transformedItems.length} items to Supabase!\n`)
    console.log('🎉 Migration complete!')
    console.log('\nNext steps:')
    console.log('1. Verify the data in your Supabase dashboard')
    console.log('2. Update Netlify environment variables with Supabase credentials')
    console.log('3. Redeploy your site')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrate()

