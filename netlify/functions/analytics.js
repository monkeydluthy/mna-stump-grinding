const jwt = require('jsonwebtoken')
const { BetaAnalyticsDataClient } = require('@google-analytics/data')

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
}

function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  try {
    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET
    if (!secret) return null
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function metricValue(row, index = 0) {
  return Number(row?.metricValues?.[index]?.value || 0)
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const user = verifyToken(event.headers.authorization || event.headers.Authorization)
  if (!user) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
  }

  const propertyId = process.env.GA4_PROPERTY_ID
  const clientEmail = process.env.GA4_CLIENT_EMAIL
  const privateKey = (process.env.GA4_PRIVATE_KEY || '').replace(/\\n/g, '\n')

  if (!propertyId || !clientEmail || !privateKey) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        configured: false,
        message: 'GA4 reporting is not configured. Add GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, and GA4_PRIVATE_KEY in Netlify.'
      })
    }
  }

  try {
    const client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey
      }
    })
    const property = `properties/${propertyId}`
    const dateRanges = [{ startDate: '30daysAgo', endDate: 'today' }]

    const [totalsRes, eventsRes, pagesRes] = await Promise.all([
      client.runReport({
        property,
        dateRanges,
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'averageSessionDuration' }
        ]
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['click_call', 'click_text', 'click_email']
            }
          }
        }
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10
      })
    ])

    const totalsRow = totalsRes[0]?.rows?.[0]
    const eventCounts = { click_call: 0, click_text: 0, click_email: 0 }
    for (const row of eventsRes[0]?.rows || []) {
      const name = row.dimensionValues?.[0]?.value
      if (name && Object.prototype.hasOwnProperty.call(eventCounts, name)) {
        eventCounts[name] = metricValue(row)
      }
    }

    const topPages = (pagesRes[0]?.rows || []).map((row) => ({
      path: row.dimensionValues?.[0]?.value || '/',
      views: metricValue(row)
    }))

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        configured: true,
        range: 'Last 30 days',
        pageviews: metricValue(totalsRow, 0),
        sessions: metricValue(totalsRow, 1),
        users: metricValue(totalsRow, 2),
        avgSession: formatDuration(metricValue(totalsRow, 3)),
        phoneCalls: eventCounts.click_call,
        textClicks: eventCounts.click_text,
        emailClicks: eventCounts.click_email,
        topPages
      })
    }
  } catch (error) {
    console.error('GA4 analytics error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        configured: true,
        error: 'Failed to load analytics',
        details: error.message
      })
    }
  }
}
