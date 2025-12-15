# Deployment Guide

## Netlify Deployment (All-in-One)

The entire application (frontend + backend functions) is deployed to Netlify using Netlify Functions.

### Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variables:

```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_PLACE_ID=ChIJBZ4H2Z04WQsRdUg8VFxO6Jo
VITE_GOOGLE_PLACE_ID=ChIJBZ4H2Z04WQsRdUg8VFxO6Jo
```

### How It Works

- **Frontend**: Built with Vite and deployed as static files
- **Backend API**: Converted to Netlify Functions (serverless functions)
- **No separate backend server needed!** Everything runs on Netlify

### Netlify Functions

The backend has been converted to Netlify Functions located in `netlify/functions/`:
- `reviews.js` - Handles Google Reviews API calls

### Build Process

Netlify will automatically:
1. Install frontend dependencies
2. Build the frontend
3. Install function dependencies
4. Deploy everything together

### Testing

After deployment:
1. Check browser console for API errors
2. Test the reviews endpoint: `https://your-site.netlify.app/api/reviews/google`
3. The function should return real Google Reviews

### Portfolio Management

**Note:** The portfolio upload functionality (admin panel) currently requires a separate backend for file storage. For a fully integrated solution, consider:
- Using Netlify's built-in form handling for file uploads
- Integrating with Cloudinary or similar service for image storage
- Using Netlify's file storage capabilities

The reviews functionality works completely standalone with Netlify Functions!

