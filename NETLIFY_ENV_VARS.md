# Netlify Environment Variables Setup

## Required Environment Variables

Add these to your Netlify site dashboard under **Site settings** > **Environment variables**:

### Google Reviews

```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=ChIJBZ4H2Z04WQsRdUg8VFxO6Jo
VITE_GOOGLE_PLACE_ID=ChIJBZ4H2Z04WQsRdUg8VFxO6Jo
```

### Cloudinary

```
CLOUDINARY_CLOUD_NAME=dsxjzbf2c
CLOUDINARY_API_KEY=777983288976867
CLOUDINARY_API_SECRET=exLJiQc_87pEMGaZY6rQu0NQg4U
```

### Authentication (JWT Secret)

```
JWT_SECRET=your_strong_random_secret_key_here
```

**Important:** Generate a strong random secret for JWT_SECRET. You can use:

- A random string generator
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Supabase (REQUIRED - for portfolio storage)

```
SUPABASE_URL=https://zhiwbkmtzohfzwigwisy.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaXdia210em9oZnp3aWd3aXN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg1MjU1NCwiZXhwIjoyMDgxNDI4NTU0fQ.3rm-TEgG3Lfe_kWm-TaE5QNtqGPUNB8ADsMnGXvxHU0
```

**Note:** Portfolio data is now stored in Supabase automatically. No need for PORTFOLIO_DATA environment variable anymore!

### Portfolio Data (DEPRECATED - no longer needed with Supabase)

```
PORTFOLIO_DATA=[{"id":"standalone-1765773341022","type":"standalone","mediaType":"video","cloudinaryUrl":"https://res.cloudinary.com/dsxjzbf2c/video/upload/v1765773339/mna-stump-portfolio/portfolio-portfolio-5.mp4","cloudinaryPublicId":"mna-stump-portfolio/portfolio-portfolio-5","description":"Portfolio video","uploadedAt":"2025-12-15T04:35:41.022Z"},{"id":"gallery-1-1765773344927","type":"gallery","images":["https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773336/mna-stump-portfolio/portfolio-portfolio-1.jpg","https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773336/mna-stump-portfolio/portfolio-portfolio-2.jpg","https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773337/mna-stump-portfolio/portfolio-portfolio-3.jpg","https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773338/mna-stump-portfolio/portfolio-portfolio-4.jpg"],"cloudinaryPublicIds":["mna-stump-portfolio/portfolio-portfolio-1","mna-stump-portfolio/portfolio-portfolio-2","mna-stump-portfolio/portfolio-portfolio-3","mna-stump-portfolio/portfolio-portfolio-4"],"description":"Portfolio gallery 1","uploadedAt":"2025-12-15T04:35:44.927Z"},{"id":"gallery-2-1765773344928","type":"gallery","images":["https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773341/mna-stump-portfolio/portfolio-portfolio-6.jpg","https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773342/mna-stump-portfolio/portfolio-portfolio-7.jpg","https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773343/mna-stump-portfolio/portfolio-portfolio-8.jpg","https://res.cloudinary.com/dsxjzbf2c/image/upload/v1765773344/mna-stump-portfolio/portfolio-portfolio-9.jpg"],"cloudinaryPublicIds":["mna-stump-portfolio/portfolio-portfolio-6","mna-stump-portfolio/portfolio-portfolio-7","mna-stump-portfolio/portfolio-portfolio-8","mna-stump-portfolio/portfolio-portfolio-9"],"description":"Portfolio gallery 2","uploadedAt":"2025-12-15T04:35:44.928Z"}]
```

**IMPORTANT:**

- This is REQUIRED for the portfolio to display on your site
- The function prioritizes this environment variable over the file
- When you upload new items, they go to Cloudinary but need to be manually added here (see UPDATE_PORTFOLIO_DATA.md for instructions)

## After Setting Variables

1. **Redeploy your site** - Environment variables require a new deploy
2. **Test the functions:**
   - Reviews: `https://your-site.netlify.app/api/reviews/google`
   - Portfolio: `https://your-site.netlify.app/api/portfolio`

## Important Notes

- The portfolio function reads from `portfolio-data.json` which is included in the deployment
- For production, consider using a database (Upstash Redis, FaunaDB) for portfolio storage
- The current setup uses file-based storage which works but has limitations
