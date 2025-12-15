# Netlify Setup Instructions

## Environment Variables

**CRITICAL:** You must set these environment variables in Netlify for the reviews to work:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Click **Add variable** and add:

### Required Variables:

```
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GOOGLE_PLACE_ID=ChIJBZ4H2Z04WQsRdUg8VFxO6Jo
VITE_GOOGLE_PLACE_ID=ChIJBZ4H2Z04WQsRdUg8VFxO6Jo
```

### How to Get Your Google Places API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** > **Credentials**
4. Find your API key or create a new one
5. Make sure **Places API** is enabled in **APIs & Services** > **Library**

## Deploying

1. Push your code to GitHub (or your Git provider)
2. In Netlify, connect your repository
3. Set the environment variables (see above)
4. Deploy!

## Testing

After deployment, check:
1. Open browser console (F12)
2. Look for logs starting with "Fetching reviews from:"
3. Check for any error messages
4. The function should be accessible at: `https://your-site.netlify.app/api/reviews/google`

## Troubleshooting

### Reviews still showing mocks?

1. **Check environment variables are set:**
   - Go to Netlify dashboard > Site settings > Environment variables
   - Verify `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` are set

2. **Check function logs:**
   - Go to Netlify dashboard > Functions tab
   - Click on `reviews-google`
   - Check the logs for errors

3. **Check browser console:**
   - Open your site
   - Press F12 to open developer tools
   - Look for error messages in the Console tab

4. **Verify the function is deployed:**
   - Go to Netlify dashboard > Functions
   - You should see `reviews-google` listed

5. **Test the function directly:**
   - Visit: `https://your-site.netlify.app/.netlify/functions/reviews-google`
   - You should see JSON response with reviews or an error message

## Common Issues

### "Google Places API key not configured"
- **Solution:** Make sure `GOOGLE_PLACES_API_KEY` is set in Netlify environment variables

### "Google Place ID not configured"
- **Solution:** Make sure `GOOGLE_PLACE_ID` is set in Netlify environment variables

### Function returns 404
- **Solution:** Make sure the function file is at `netlify/functions/reviews-google.js`
- **Solution:** Redeploy after adding the function

### CORS errors
- **Solution:** The function already includes CORS headers, but if you see CORS errors, check the function logs

