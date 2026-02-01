# Pre-Deployment Checklist

Use this checklist before deploying to ensure everything is ready.

## ✅ Environment Variables (Netlify Dashboard)

Make sure ALL of these are set in Netlify under **Site settings** > **Environment variables**:

### Required Variables

- [ ] `GOOGLE_PLACES_API_KEY` - Your Google Places API key
- [ ] `GOOGLE_PLACE_ID` - Your Google Place ID (currently: `ChIJBZ4H2Z04WQsRdUg8VFxO6Jo`)
- [ ] `VITE_GOOGLE_PLACE_ID` - Same as above (for frontend)
- [ ] `CLOUDINARY_CLOUD_NAME` - `dsxjzbf2c`
- [ ] `CLOUDINARY_API_KEY` - `777983288976867`
- [ ] `CLOUDINARY_API_SECRET` - `exLJiQc_87pEMGaZY6rQu0NQg4U`
- [ ] `SUPABASE_URL` - `https://zhiwbkmtzohfzwigwisy.supabase.co`
- [ ] `SUPABASE_SERVICE_KEY` - Your service role key
- [ ] `JWT_SECRET` - A strong random secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

**Note:** After adding/updating environment variables, you MUST redeploy for them to take effect.

## ✅ Supabase Setup

- [ ] Supabase table `portfolio_items` is created (run `supabase-setup.sql` if not done)
- [ ] Migration script has been run (if you had existing portfolio data)
- [ ] RLS policies are active (should be set by the SQL script)

## ✅ Features Checklist

### Home Page
- [ ] Logo displays correctly
- [ ] Facebook link works
- [ ] Google Reviews section displays (mock reviews for now)
- [ ] Services section displays correctly
- [ ] Contact section has correct phone/email
- [ ] All buttons (Call, Text, Email) work

### Portfolio Page
- [ ] Portfolio items load from Supabase
- [ ] Images display correctly (using Cloudinary URLs)
- [ ] Gallery modals work (click to view multiple images)
- [ ] Before/After images display correctly
- [ ] Videos play in modals
- [ ] No horizontal overflow on mobile

### Admin Panel
- [ ] Can log in with: `luthdigitalconsult@gmail.com` or `nickperna@mnastumpgrinding.com`
- [ ] Password: `bigpern555!`
- [ ] Can upload standalone images/videos
- [ ] Can upload before/after images
- [ ] Can upload gallery (multiple images)
- [ ] Can edit descriptions of existing items
- [ ] Can delete items
- [ ] Images upload to Cloudinary successfully
- [ ] Items save to Supabase successfully

### Mobile Responsiveness
- [ ] Hamburger menu works on mobile
- [ ] Mobile menu overlay displays correctly
- [ ] Reviews are swipeable on mobile
- [ ] No horizontal scrolling issues
- [ ] All sections are properly sized for mobile
- [ ] Hero buttons stack vertically on mobile

## ✅ Testing Checklist

### Before Deployment
- [ ] Test locally: `cd frontend && npm run dev`
- [ ] Test admin login locally
- [ ] Test uploading a portfolio item locally
- [ ] Test editing a portfolio item locally
- [ ] Test deleting a portfolio item locally

### After Deployment
- [ ] Home page loads correctly
- [ ] Portfolio page loads and displays items
- [ ] Admin login works
- [ ] Can upload new portfolio items
- [ ] Can edit portfolio items
- [ ] Can delete portfolio items
- [ ] Health check endpoint works: `https://your-site.netlify.app/api/health-check`
- [ ] Google Reviews endpoint works: `https://your-site.netlify.app/api/reviews/google`
- [ ] Portfolio endpoint works: `https://your-site.netlify.app/api/portfolio`

## ✅ Keep-Alive Setup

- [ ] Health check function is deployed
- [ ] Cron job is set up to ping `/api/health-check` every 5-10 minutes
- [ ] Test the health check endpoint manually
- [ ] Verify cron service is executing successfully

## ✅ Security Checklist

- [ ] JWT_SECRET is set and is a strong random value
- [ ] Supabase service key is kept secret (not in code)
- [ ] Cloudinary API secret is kept secret (not in code)
- [ ] Google Places API key has restrictions set (if possible)
- [ ] Admin routes require authentication

## ✅ Content Checklist

- [ ] All contact information is correct (phone: 8133255306, email: nickperna@mnastumpgrinding.com)
- [ ] Facebook link is correct: `https://www.facebook.com/mnastumpgrinding/`
- [ ] Logo is the correct file (`logo-clear.png`)
- [ ] Favicon is set correctly

## ✅ Optional Enhancements (Future)

These are nice-to-haves but not required:

- [ ] Add Google Analytics
- [ ] Add meta tags for SEO
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Set up custom domain
- [ ] Add error tracking (Sentry, etc.)
- [ ] Add loading skeletons for better UX
- [ ] Add image optimization/lazy loading
- [ ] Switch to real Google Reviews (when business address is updated)

## 🚀 Deployment Steps

1. **Push to Git** (if using Git deployment)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Or Deploy via Netlify CLI**
   ```bash
   netlify deploy --prod
   ```

3. **After Deployment:**
   - Wait for build to complete
   - Test all functionality
   - Set up cron job for health check
   - Monitor Netlify function logs for any errors

## 📝 Notes

- The site uses Netlify Functions (serverless) - no separate backend needed
- Portfolio data is stored in Supabase (not files)
- Images/videos are stored in Cloudinary
- All authentication uses JWT tokens
- The site is fully responsive and mobile-optimized

## 🆘 Troubleshooting

If something doesn't work after deployment:

1. **Check Netlify Function Logs:**
   - Go to Netlify Dashboard > Functions > View logs

2. **Check Environment Variables:**
   - Verify all variables are set correctly
   - Remember: Changes require a redeploy

3. **Check Browser Console:**
   - Look for JavaScript errors
   - Check Network tab for failed API calls

4. **Test Endpoints Directly:**
   - Visit the API endpoints in your browser
   - Check for error messages

5. **Verify Supabase:**
   - Check Supabase dashboard for data
   - Verify RLS policies are correct

---

**You're ready to deploy when all checkboxes above are checked!** ✅

