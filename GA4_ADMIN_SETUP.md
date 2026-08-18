# GA4 admin dashboard setup

The public site already sends pageviews and call/text/email clicks to **G-47EDHHMP3S**.
To show those numbers inside `/admin`, the server needs read-only access to the GA4 property.

## 1. Find the Property ID

In Google Analytics: **Admin** → **Property settings**.

Copy **Property ID** (a number like `123456789`). This is **not** the stream ID and **not** `G-47EDHHMP3S`.

## 2. Create a service account

1. Open [Google Cloud Console](https://console.cloud.google.com/) (same Google account is fine).
2. Create or select a project.
3. Enable **Google Analytics Data API**.
4. **IAM & Admin** → **Service accounts** → **Create**.
   - Name: `mna-stump-analytics`
5. Open the service account → **Keys** → **Add key** → **JSON**. Download the file.
6. From that JSON, you need:
   - `client_email`
   - `private_key`

## 3. Give the service account access to GA4

1. GA4 → **Admin** → **Property access management**.
2. **Add users**.
3. Paste the service account **email** (`...@....iam.gserviceaccount.com`).
4. Role: **Viewer**.
5. Save.

## 4. Add Netlify environment variables

**Site settings** → **Environment variables**:

```
GA4_PROPERTY_ID=123456789
GA4_CLIENT_EMAIL=mna-stump-analytics@YOUR_PROJECT.iam.gserviceaccount.com
GA4_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n
```

Keep the `\n` characters in `GA4_PRIVATE_KEY` (or paste the key with real line breaks). Then **redeploy**.

## 5. Check the admin page

Log in to `/admin` → **Analytics**. You should see last-30-day totals and top pages.

If the page says reporting is not configured, one of the three variables is missing. If it errors, the service account likely does not have Viewer access, or the Property ID is wrong.
