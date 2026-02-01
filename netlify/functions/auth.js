const jwt = require('jsonwebtoken');

// Auth from env (never commit credentials to repo)
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// Set CORS headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
});

exports.handler = async (event, context) => {
  const headers = getHeaders();

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Login route
  if (
    event.httpMethod === 'POST' &&
    (event.path.endsWith('/login') || event.path.includes('/login'))
  ) {
    try {
      if (!ADMIN_PASSWORD || ALLOWED_EMAILS.length === 0 || !JWT_SECRET) {
        return {
          statusCode: 503,
          headers,
          body: JSON.stringify({
            error:
              'Login not configured. Set ADMIN_PASSWORD, ALLOWED_EMAILS, and JWT_SECRET in environment.',
          }),
        };
      }

      const { email, password } = JSON.parse(event.body || '{}');

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email and password are required' }),
        };
      }

      if (
        ALLOWED_EMAILS.includes(email.toLowerCase()) &&
        password === ADMIN_PASSWORD
      ) {
        // Generate JWT token
        const token = jwt.sign({ email: email.toLowerCase() }, JWT_SECRET, {
          expiresIn: '7d',
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Login successful',
            token,
            user: { email: email.toLowerCase() },
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid email or password' }),
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Login failed' }),
      };
    }
  }

  // Check auth status
  if (
    event.httpMethod === 'GET' &&
    (event.path.endsWith('/check') || event.path.includes('/check'))
  ) {
    try {
      if (!JWT_SECRET) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ authenticated: false }),
        };
      }

      const authHeader =
        event.headers.authorization || event.headers.Authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ authenticated: false }),
        };
      }

      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            authenticated: true,
            user: { email: decoded.email },
          }),
        };
      } catch (jwtError) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ authenticated: false }),
        };
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ authenticated: false }),
      };
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: 'Not found' }),
  };
};
