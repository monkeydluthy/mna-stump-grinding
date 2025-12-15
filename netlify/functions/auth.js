const jwt = require('jsonwebtoken')

// Allowed emails and password
const ALLOWED_EMAILS = [
  'luthdigitalconsult@gmail.com',
  'nickperna@mnastumpgrinding.com'
]
const PASSWORD = 'bigpern555!'
const JWT_SECRET = process.env.JWT_SECRET || 'mna-stump-grinding-secret-key-change-in-production'

// Set CORS headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
})

exports.handler = async (event, context) => {
  const headers = getHeaders()

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Login route
  if (event.httpMethod === 'POST' && (event.path.endsWith('/login') || event.path.includes('/login'))) {
    try {
      const { email, password } = JSON.parse(event.body || '{}')

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and password are required' })
        }
      }

      if (ALLOWED_EMAILS.includes(email.toLowerCase()) && password === PASSWORD) {
        // Generate JWT token
        const token = jwt.sign(
          { email: email.toLowerCase() },
          JWT_SECRET,
          { expiresIn: '7d' }
        )

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            token,
            user: { email: email.toLowerCase() }
          })
        }
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid email or password' })
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Login failed' })
      }
    }
  }

  // Check auth status
  if (event.httpMethod === 'GET' && (event.path.endsWith('/check') || event.path.includes('/check'))) {
    try {
      const authHeader = event.headers.authorization || event.headers.Authorization
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ authenticated: false })
        }
      }

      const token = authHeader.substring(7)
      
      try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            authenticated: true,
            user: { email: decoded.email }
          })
        }
      } catch (jwtError) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ authenticated: false })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ authenticated: false })
      }
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' })
  }
}

