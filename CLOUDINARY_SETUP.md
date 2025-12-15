# Cloudinary Setup & Migration Guide

## What I Need From You

To connect to your Cloudinary account, I need these credentials from your Cloudinary dashboard:

1. **Cloud Name** - Found in your dashboard URL: `https://cloudinary.com/console` (it's in the URL)
2. **API Key** - Found in Dashboard > Settings > Security
3. **API Secret** - Found in Dashboard > Settings > Security

**How to get them:**
1. Sign up at https://cloudinary.com (free account)
2. Go to Dashboard
3. Your **Cloud Name** is shown at the top
4. Go to **Settings** > **Security** tab
5. Copy your **API Key** and **API Secret**

## What Will Happen

Once you provide the credentials, I will:

1. **Set up Cloudinary integration** in Netlify Functions
2. **Create a migration script** that will:
   - Upload all existing portfolio images (portfolio-1.jpg through portfolio-9.jpg)
   - Upload the video (portfolio-5.mp4)
   - Create portfolio.json with Cloudinary URLs instead of local paths
3. **Update the admin panel** to upload directly to Cloudinary
4. **Update the portfolio page** to load images from Cloudinary

## Files That Will Be Migrated

From `frontend/public/`:
- portfolio-1.jpg
- portfolio-2.jpg
- portfolio-3.jpg
- portfolio-4.jpg
- portfolio-5.mp4 (video)
- portfolio-6.jpg
- portfolio-7.jpg
- portfolio-8.jpg
- portfolio-9.jpg

These will be uploaded to Cloudinary and the portfolio.json will be updated with Cloudinary URLs.

## After Migration

- All images/videos will be served from Cloudinary (faster, CDN)
- New uploads will go directly to Cloudinary
- No need for local file storage
- Works with Netlify Functions (serverless)

## Next Steps

1. Get your Cloudinary credentials (see above)
2. Provide them to me
3. I'll set everything up and run the migration

