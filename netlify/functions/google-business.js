const crypto = require('crypto')
const {
  oauthCredentials,
  redirectUri,
  authUrl,
  exchangeAuthCode,
  accessTokenFromRefresh,
  listLocations,
  pickLocation,
  reviewsForParent,
} = require('./lib/gbp')

function html(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...extraHeaders,
    },
    body,
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function cookies(event) {
  const out = {}
  String(event.headers.cookie || event.headers.Cookie || '')
    .split(';')
    .forEach((part) => {
      const index = part.indexOf('=')
      if (index === -1) return
      out[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim())
    })
  return out
}

function isCallback(event) {
  const raw = `${event.rawUrl || ''} ${event.path || ''}`
  return raw.includes('/callback') || Boolean(event.queryStringParameters?.code)
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return html(405, '<p>Method not allowed</p>')
  }

  const creds = oauthCredentials()
  if (!creds) {
    return html(
      500,
      `<p>Add <code>GOOGLE_OAUTH_CLIENT_ID</code> and <code>GOOGLE_OAUTH_CLIENT_SECRET</code> in Netlify, then redeploy.</p>
       <p>Authorized redirect URI:</p>
       <p><code>${escapeHtml(redirectUri())}</code></p>`
    )
  }

  const query = event.queryStringParameters || {}
  if (query.error) {
    return html(400, `<p>Google did not connect the profile: ${escapeHtml(query.error)}</p>`)
  }

  if (!isCallback(event)) {
    const state = crypto.randomBytes(24).toString('hex')
    return {
      statusCode: 302,
      headers: {
        Location: authUrl(state),
        'Cache-Control': 'no-store',
        'Set-Cookie': `gb_oauth_state=${state}; HttpOnly; Secure; Path=/api/google-business; Max-Age=600; SameSite=Lax`,
      },
      body: '',
    }
  }

  const expected = cookies(event).gb_oauth_state
  if (!query.state || !expected || query.state !== expected) {
    return html(400, '<p>Sign-in expired. Open the connect link again.</p>')
  }
  if (!query.code) {
    return html(400, '<p>Google did not return a sign-in code.</p>')
  }

  try {
    const tokens = await exchangeAuthCode(creds, query.code)
    const refreshToken = tokens.refresh_token
    if (!refreshToken) {
      return html(
        400,
        '<p>Google did not return a refresh token. Open the connect link again and approve access.</p>'
      )
    }
    const token = tokens.access_token || (await accessTokenFromRefresh({ ...creds, refreshToken }))
    const locations = await listLocations(token)
    const location = pickLocation(locations)
    const preview = location ? await reviewsForParent(token, location.parent) : null
    const locationLines = locations
      .map((item) => `${escapeHtml(item.title)} — ${escapeHtml(item.parent)}`)
      .join('<br>')
    const count = preview?.reviews?.length ?? 0
    return html(
      200,
      `<h1>Google Business Profile connected</h1>
       <p>Matched <strong>${escapeHtml(location?.title || 'no listing')}</strong> and read ${count} recent reviews.</p>
       <p>In Netlify, set this environment variable, then trigger a new deploy:</p>
       <p><code>GOOGLE_OAUTH_REFRESH_TOKEN</code></p>
       <textarea readonly rows="4" style="width:100%;max-width:640px;">${escapeHtml(refreshToken)}</textarea>
       <p>Listings on this account:</p>
       <p>${locationLines || 'None'}</p>
       <p>If the matched listing is wrong, also set <code>GOOGLE_BUSINESS_PARENT</code> to the accounts/…/locations/… value above.</p>
       <p>Close this page after the value is saved. If the OAuth app is still in Testing, this token expires in 7 days.</p>`,
      { 'Set-Cookie': 'gb_oauth_state=; HttpOnly; Secure; Path=/api/google-business; Max-Age=0; SameSite=Lax' }
    )
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.error_description ||
      error.message ||
      'Unknown error'
    return html(500, `<p>Could not read the profile: ${escapeHtml(message)}</p>`)
  }
}
