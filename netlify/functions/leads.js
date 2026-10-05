const { createClient } = require('@supabase/supabase-js')
const jwt = require('jsonwebtoken')
const { Resend } = require('resend')

function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      client: null,
      error:
        'Supabase credentials not configured (SUPABASE_URL, SUPABASE_SERVICE_KEY)',
    }
  }
  return { client: createClient(supabaseUrl, supabaseServiceKey), error: null }
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
}

function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const JWT_SECRET =
      process.env.JWT_SECRET ||
      'mna-stump-grinding-secret-key-change-in-production'
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

function transformLead(item) {
  if (!item || typeof item !== 'object') return null
  return {
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email || '',
    cityZip: item.city_zip || '',
    serviceNeeded: item.service_needed || '',
    message: item.message || '',
    utmSource: item.utm_source || '',
    utmMedium: item.utm_medium || '',
    utmCampaign: item.utm_campaign || '',
    status: item.status || 'new',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

function leadIdFromPath(path = '') {
  // Supports /api/leads/:id and /.netlify/functions/leads/:id
  const match = path.match(/\/leads\/([^/?#]+)/i)
  if (!match) return null
  const id = decodeURIComponent(match[1])
  return id && id !== 'leads' ? id : null
}

async function sendLeadEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured — skipping lead email')
    return { sent: false, error: 'Email not configured' }
  }

  const resend = new Resend(apiKey)
  const service = lead.service_needed || 'General inquiry'
  const subject = `New lead: ${service} — ${lead.name}`

  const lines = [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || '—'}`,
    `City / ZIP: ${lead.city_zip || '—'}`,
    `Service needed: ${service}`,
    `Message: ${lead.message || '—'}`,
    '',
    `UTM source: ${lead.utm_source || '—'}`,
    `UTM medium: ${lead.utm_medium || '—'}`,
    `UTM campaign: ${lead.utm_campaign || '—'}`,
    '',
    `Lead ID: ${lead.id}`,
    `Submitted: ${lead.created_at || new Date().toISOString()}`,
  ]

  try {
    const { error } = await resend.emails.send({
      from: 'M&A Stump Grinding Leads <leads@mnastumpgrinding.com>',
      to: ['nickperna@mnastumpgrinding.com'],
      subject,
      text: lines.join('\n'),
    })
    if (error) {
      console.error('Resend error:', error)
      return { sent: false, error: error.message || 'Resend failed' }
    }
    return { sent: true }
  } catch (err) {
    console.error('Resend exception:', err)
    return { sent: false, error: err.message }
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // POST — public lead capture
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
      const email = typeof body.email === 'string' ? body.email.trim() : ''
      const cityZip = typeof body.cityZip === 'string' ? body.cityZip.trim() : ''
      const serviceNeeded =
        typeof body.serviceNeeded === 'string' ? body.serviceNeeded.trim() : ''
      const message = typeof body.message === 'string' ? body.message.trim() : ''
      const utmSource =
        typeof body.utmSource === 'string' ? body.utmSource.trim() : ''
      const utmMedium =
        typeof body.utmMedium === 'string' ? body.utmMedium.trim() : ''
      const utmCampaign =
        typeof body.utmCampaign === 'string' ? body.utmCampaign.trim() : ''

      if (!name || !phone) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name and phone are required' }),
        }
      }

      const { client: supabase, error: configError } = getSupabase()
      if (configError || !supabase) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            error: 'Leads not configured',
            details: configError,
          }),
        }
      }

      const newLead = {
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        phone,
        email: email || null,
        city_zip: cityZip || null,
        service_needed: serviceNeeded || null,
        message: message || null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        status: 'new',
      }

      const { data, error } = await supabase
        .from('leads')
        .insert([newLead])
        .select()
        .single()

      if (error) {
        console.error('Supabase insert error:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'Failed to save lead',
            details: error.message,
          }),
        }
      }

      const emailResult = await sendLeadEmail(data)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Lead submitted successfully',
          lead: transformLead(data),
          emailSent: emailResult.sent,
        }),
      }
    } catch (error) {
      console.error('Error creating lead:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to submit lead',
          details: error.message,
        }),
      }
    }
  }

  // GET — list leads (auth required)
  if (event.httpMethod === 'GET') {
    try {
      const authHeader =
        event.headers.authorization || event.headers.Authorization
      const user = verifyToken(authHeader)
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' }),
        }
      }

      const { client: supabase, error: configError } = getSupabase()
      if (configError || !supabase) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            error: 'Leads not configured',
            details: configError,
          }),
        }
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'Failed to fetch leads',
            details: error.message,
          }),
        }
      }

      const leads = (data || []).map(transformLead).filter(Boolean)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(leads),
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to fetch leads',
          details: error.message,
        }),
      }
    }
  }

  // PATCH — update status (auth required)
  if (event.httpMethod === 'PATCH') {
    try {
      const authHeader =
        event.headers.authorization || event.headers.Authorization
      const user = verifyToken(authHeader)
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' }),
        }
      }

      const id =
        leadIdFromPath(event.path) ||
        leadIdFromPath(event.rawUrl || '') ||
        JSON.parse(event.body || '{}').id

      const body = JSON.parse(event.body || '{}')
      const status = typeof body.status === 'string' ? body.status.trim() : ''

      if (!id || !status) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Lead ID and status are required' }),
        }
      }

      const { client: supabase, error: configError } = getSupabase()
      if (configError || !supabase) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            error: 'Leads not configured',
            details: configError,
          }),
        }
      }

      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase update error:', error)
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            error: 'Failed to update lead',
            details: error.message,
          }),
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          lead: transformLead(data),
        }),
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to update lead',
          details: error.message,
        }),
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  }
}
