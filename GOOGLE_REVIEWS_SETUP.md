# Google Reviews Integration Setup

This guide will help you integrate real Google Reviews into your website.

## Step 1: Get Your Google Place ID

### Option A: Use the Helper Script (Recommended)

We've included a helper script that will automatically find your Place ID:

1. Make sure you have your `GOOGLE_PLACES_API_KEY` set in `backend/.env` (see Step 2)
2. Run the helper script:
   ```bash
   cd backend
   node scripts/get-place-id.js "M&A Stump Grinding" "28.0047936" "-82.538186"
   ```
3. The script will output your Place ID - copy it to your `.env` file

### Option B: Manual Method

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your business name
3. Click on your business listing
4. Use the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id) tool:
   - Enter your business name or address
   - Click "Find Place ID"
   - Copy the Place ID

### Option C: From Google Maps URL

If you have a Google Maps URL like:
`https://www.google.com/maps/place/M%26A+Stump+Grinding/@28.0047935,-82.5381859...`

The Place ID is usually embedded in the URL data, but it's easier to use Option A or B above.

## Step 2: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
   - (Optional) Restrict the API key to only allow requests from your domain

## Step 3: Set Environment Variables

### Backend (.env file)

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_PLACES_API_KEY=your_api_key_here
GOOGLE_PLACE_ID=your_place_id_here
PORT=5000
```

### Frontend (.env file)

Create a `.env` file in the `frontend/` directory (optional, only if you want to customize the review link):

```env
VITE_GOOGLE_PLACE_ID=your_place_id_here
```

**Note:** Vite uses the `VITE_` prefix for environment variables exposed to the frontend.

## Step 4: Install Dependencies

In the `backend/` directory, run:

```bash
npm install
```

This will install `axios` which is needed for making API requests.

## Step 5: Update the "Leave a Review" Link

The review link in the component uses the Place ID. Make sure your Place ID is set correctly in the environment variables.

## Step 6: Test the Integration

1. Start your backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start your frontend:

   ```bash
   cd frontend
   npm run dev
   ```

3. Visit `http://localhost:3000` and check the reviews section

## Troubleshooting

### No Reviews Showing

- Check that your Google Business Profile has reviews
- Verify your Place ID is correct
- Check the browser console and server logs for errors
- Ensure the Places API is enabled in Google Cloud Console

### API Key Errors

- Make sure your API key is valid
- Check that billing is enabled (Google requires billing for Places API)
- Verify the API key restrictions allow requests from your server

### Rate Limiting

Google Places API has rate limits. If you exceed them:

- Consider caching reviews on your backend
- Implement rate limiting on your backend route

## Cost Information

Google Places API has a free tier:

- **$200 free credit per month** (enough for most small businesses)
- After free credit: $0.017 per request
- Reviews are typically fetched once per page load

## Fallback Behavior

If the API fails or returns no reviews, the component will automatically fall back to showing mock reviews so your site always displays something.

## Security Notes

- **Never commit your `.env` file to git** (it's already in `.gitignore`)
- Keep your API key secure
- Consider restricting your API key to only your domain
- Use environment variables, never hardcode API keys
