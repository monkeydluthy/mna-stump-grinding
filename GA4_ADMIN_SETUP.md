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
GA4_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
....
-----END PRIVATE KEY-----
```

How to paste `GA4_PRIVATE_KEY` (this is the usual failure):

1. Open the downloaded JSON file.
2. Copy **only** the `private_key` string — the block that starts with `-----BEGIN PRIVATE KEY-----`.
3. **Do not** include the wrapping double quotes.
4. In Netlify, paste it in the value box. Either:
   - Keep the `\n` characters from the JSON, or
   - Use real line breaks (Netlify’s multiline editor is best).

Wrong: `"-----BEGIN PRIVATE KEY-----\nMIIE..."` (quotes included)  
Right: `-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n`

`GA4_CLIENT_EMAIL` must match `client_email` in the same JSON file.

Then **redeploy**.

## 5. Check the admin page

Log in to `/admin` → **Analytics**. You should see last-30-day totals and top pages.

If you see **UNAUTHENTICATED**, the private key or client email is wrong/malformed — re-paste from the JSON as above.  
If you see **PERMISSION_DENIED**, the service account is missing Viewer on the GA4 property, or the Property ID is wrong.
