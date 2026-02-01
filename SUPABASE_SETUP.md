# Supabase Setup Instructions

## Step 1: Create the Database Table

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the entire contents of `supabase-setup.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

## Step 2: Migrate Existing Portfolio Data

1. Make sure you have `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `backend/.env`
2. Run the migration script:
   ```bash
   cd backend
   node scripts/migrate-to-supabase.js
   ```
3. This will migrate all existing portfolio items from `portfolio.json` to Supabase

## Step 3: Add Supabase Credentials to Netlify

Go to Netlify dashboard > Site settings > Environment variables and add:

- **SUPABASE_URL** – From Supabase: Project Settings → API → Project URL
- **SUPABASE_SERVICE_KEY** – From Supabase: Project Settings → API → `service_role` key (not anon)

Use your project’s values; never commit these to the repo.

## Step 4: Redeploy

1. Go to Netlify dashboard > Deploys
2. Click **Trigger deploy** > **Clear cache and deploy site**
3. Wait for deployment to complete

## Step 5: Test

1. Visit your portfolio page - it should load items from Supabase
2. Try uploading a new item through the admin panel
3. It should automatically save to Supabase and appear on the portfolio page

## What Changed

- ✅ Portfolio data is now stored in Supabase (persistent database)
- ✅ New uploads automatically save to Supabase
- ✅ No more manual environment variable updates needed!
- ✅ Portfolio items persist across deployments

## Troubleshooting

### "relation 'portfolio_items' does not exist"

- Make sure you ran the SQL setup script in Step 1

### "Failed to fetch portfolio" or portfolio not loading

- **Env vars:** In Netlify → Site settings → Environment variables, confirm `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set and have no typos. Redeploy after changing env vars.
- **Project paused:** On the free tier, Supabase can pause after inactivity. Hit `/api/health-check` or wait a minute and reload; ensure the keep-alive cron is set up (see SUPABASE_KEEPALIVE_SETUP.md).
- **Logs:** Netlify → Functions → portfolio → View logs. A 503 with "Portfolio not configured" means env vars are missing; a 500 with a message is usually a Supabase error (e.g. table missing, wrong key).
- **Browser:** Open DevTools → Network, call `/api/portfolio`, and check the response body for `details` to see the exact error.

### Items not showing

- Verify data exists in Supabase: Go to Table Editor > portfolio_items
- Check browser console for errors
- Check Netlify function logs
