# How to Update Portfolio Data After Uploading

Since Netlify Functions are stateless, new portfolio items need to be added to the `PORTFOLIO_DATA` environment variable.

## Quick Method (After Each Upload)

1. **Upload your item** through the admin panel
2. **Check the browser console** - the upload response will show the new item data
3. **Copy the item data** from the console or admin panel
4. **Go to Netlify Dashboard** > Site settings > Environment variables
5. **Edit PORTFOLIO_DATA**:
   - Click on the PORTFOLIO_DATA variable
   - Click "Edit"
   - Add the new item to the JSON array
   - Click "Save"
6. **Redeploy** your site

## Example: Adding a New Standalone Image

If you uploaded a standalone image, the response will look like:
```json
{
  "success": true,
  "cloudinaryUrl": "https://res.cloudinary.com/...",
  "cloudinaryPublicId": "mna-stump-portfolio/portfolio-1234567890",
  "mediaType": "image"
}
```

Then in your admin panel, after adding to portfolio, you'll get:
```json
{
  "id": "item-1234567890-abc123",
  "type": "standalone",
  "cloudinaryUrl": "https://res.cloudinary.com/...",
  "cloudinaryPublicId": "mna-stump-portfolio/portfolio-1234567890",
  "mediaType": "image",
  "description": "Your description",
  "uploadedAt": "2025-12-15T..."
}
```

Add this to the PORTFOLIO_DATA array in Netlify.

## Better Solution (Future)

For automatic persistence, we can integrate:
- **Upstash Redis** (free tier available)
- **FaunaDB** (free tier available)
- **Netlify KV Storage** (if available)

This would allow automatic saving without manual updates.

