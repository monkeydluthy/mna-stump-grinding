# Supabase Keep-Alive Setup

This guide explains how to set up automatic pings to keep your Supabase project from pausing due to inactivity.

## Why This Is Needed

Supabase free tier projects automatically pause after a period of inactivity. To prevent this, we need to periodically ping the database to keep it active.

## Solution

We've created a health check endpoint that performs a lightweight query to Supabase. You'll set up an external cron service to ping this endpoint every few minutes.

## Step 1: Deploy the Health Check Function

The health check function is already created at `netlify/functions/health-check.js`. After you deploy to Netlify, it will be available at:

```
https://your-site.netlify.app/api/health-check
```

## Step 2: Set Up a Cron Job

You'll need to use a free cron service to ping the endpoint periodically. Here are some options:

### Option A: cron-job.org (Recommended - Free)

1. Go to [https://cron-job.org](https://cron-job.org)
2. Sign up for a free account
3. Click "Create cronjob"
4. Configure:
   - **Title**: Supabase Keep-Alive
   - **Address**: `https://your-site.netlify.app/api/health-check`
   - **Schedule**: Every 5 minutes (or every 10 minutes - both work)
   - **Request method**: GET
   - Click "Create cronjob"

### Option B: EasyCron (Free Tier Available)

1. Go to [https://www.easycron.com](https://www.easycron.com)
2. Sign up for a free account
3. Create a new cron job:
   - **URL**: `https://your-site.netlify.app/api/health-check`
   - **Schedule**: `*/5 * * * *` (every 5 minutes)
   - **HTTP Method**: GET
   - Save the cron job

### Option C: UptimeRobot (Free - 50 monitors)

1. Go to [https://uptimerobot.com](https://uptimerobot.com)
2. Sign up for a free account
3. Add a new monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Supabase Keep-Alive
   - **URL**: `https://your-site.netlify.app/api/health-check`
   - **Monitoring Interval**: 5 minutes
   - Click "Create Monitor"

## Step 3: Verify It's Working

After setting up the cron job, you can:

1. **Test the endpoint manually**: Visit `https://your-site.netlify.app/api/health-check` in your browser. You should see:

   ```json
   {
     "status": "healthy",
     "timestamp": "2025-01-15T12:00:00.000Z",
     "message": "Supabase connection active"
   }
   ```

2. **Check your cron service logs**: Most cron services show execution logs. Verify that the requests are being sent successfully.

3. **Monitor Supabase Dashboard**: Your Supabase project should remain active and not pause.

## Recommended Schedule

- **Every 5 minutes**: Very safe, ensures constant activity
- **Every 10 minutes**: Still safe, reduces request count
- **Every 15 minutes**: Minimum recommended to prevent pausing

## Important Notes

- Replace `your-site.netlify.app` with your actual Netlify site URL
- The health check performs a lightweight query (just selects one ID), so it won't impact performance
- This is a free solution that works with any cron service
- The endpoint doesn't require authentication, so it's safe for external cron services to call

## Troubleshooting

If the health check fails:

1. Verify your Netlify site is deployed and accessible
2. Check that `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in Netlify environment variables
3. Check Netlify function logs for any errors
4. Ensure the cron service is actually executing (check their logs)

## Alternative: Netlify Scheduled Functions (Paid)

If you're on a paid Netlify plan, you can use Netlify's built-in scheduled functions instead of an external cron service. However, the free cron service approach works perfectly fine and is recommended for free tier users.
