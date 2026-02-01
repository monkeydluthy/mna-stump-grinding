# Finalize M&A Stump Grinding Deployment

Follow these three steps to go live and keep the site running.

---

## 1. Set Netlify environment variables

In **Netlify** → your site → **Site settings** → **Environment variables**, add (or confirm) every variable listed in **NETLIFY_ENV_VARS.md**. Required:

- `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`, `VITE_GOOGLE_PLACE_ID`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

After changing any variable, **trigger a new deploy** (Deploys → Trigger deploy → Deploy site).

---

## 2. Deploy and test on the live site

- Deploy from Git (push to your connected repo) or run `netlify deploy --prod`.
- On the live URL, verify:
  - Home page, Portfolio (items load from Supabase), Google Reviews.
  - Admin: log in, add/edit/delete a portfolio item, confirm images use Cloudinary.
- Quick API checks:
  - `https://YOUR-SITE.netlify.app/api/health-check` → `{"status":"healthy",...}`
  - `https://YOUR-SITE.netlify.app/api/portfolio` → portfolio JSON
  - `https://YOUR-SITE.netlify.app/api/reviews/google` → reviews (if configured)

Use **PRE_DEPLOYMENT_CHECKLIST.md** for the full test list.

---

## 3. Set up Supabase keep-alive

So the Supabase project doesn’t pause on the free tier:

1. Pick a free cron/uptime service (e.g. [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com)).
2. Create a job that sends a **GET** request to:
   `https://YOUR-SITE.netlify.app/api/health-check`
   every **5–10 minutes**.
3. Confirm the endpoint returns `{"status":"healthy"}` when you open that URL in a browser.

Full instructions: **SUPABASE_KEEPALIVE_SETUP.md**.

---

## You’re done

- Portfolio: Supabase + Cloudinary  
- Auth: JWT (admin)  
- Reviews: Google Places API  
- Keep-alive: external cron → `/api/health-check`

If something fails, check Netlify function logs and **PRE_DEPLOYMENT_CHECKLIST.md** → Troubleshooting.
