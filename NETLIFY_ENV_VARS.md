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
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Where to get these:** Supabase Dashboard → Project Settings → API. Use the **Project URL** for `SUPABASE_URL` and the **service_role** key (not anon) for `SUPABASE_SERVICE_KEY`. Keep the service key secret.

**Note:** Portfolio data is stored in Supabase. Do **not** set `PORTFOLIO_DATA`; it is deprecated.

## After Setting Variables

1. **Redeploy your site** - Environment variables require a new deploy
2. **Test the functions:**
   - Reviews: `https://your-site.netlify.app/api/reviews/google`
   - Portfolio: `https://your-site.netlify.app/api/portfolio`

## Important Notes

- Portfolio data is stored in Supabase; the `/api/portfolio` function reads from Supabase
- Images and videos are stored in Cloudinary
- Do not set `PORTFOLIO_DATA`; it is deprecated
