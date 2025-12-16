const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not configured')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Set CORS headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
}

exports.handler = async (event, context) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Perform a simple query to keep Supabase active
    // This queries the portfolio_items table with a limit of 1
    // It's a lightweight operation that prevents the project from pausing
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Health check error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          status: 'error', 
          message: 'Health check failed',
          error: error.message 
        })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'Supabase connection active'
      })
    }
  } catch (error) {
    console.error('Health check exception:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: 'error',
        message: 'Health check failed',
        error: error.message 
      })
    }
  }
}

