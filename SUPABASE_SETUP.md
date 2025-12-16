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

```
SUPABASE_URL=https://zhiwbkmtzohfzwigwisy.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaXdia210em9oZnp3aWd3aXN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg1MjU1NCwiZXhwIjoyMDgxNDI4NTU0fQ.3rm-TEgG3Lfe_kWm-TaE5QNtqGPUNB8ADsMnGXvxHU0
```

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

### "Failed to fetch portfolio"
- Check that SUPABASE_URL and SUPABASE_SERVICE_KEY are set in Netlify
- Check the function logs in Netlify dashboard

### Items not showing
- Verify data exists in Supabase: Go to Table Editor > portfolio_items
- Check browser console for errors
- Check Netlify function logs

