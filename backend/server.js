require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const path = require('path')
const fs = require('fs')
const portfolioRoutes = require('./routes/portfolio')
const reviewsRoutes = require('./routes/reviews')
const authRoutes = require('./routes/auth')
const requireAuth = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 5001

// Handle CORS preflight requests
app.options('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware - CORS must come before session
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration - must come after CORS
app.use(session({
  secret: process.env.SESSION_SECRET || 'mna-stump-grinding-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to false for localhost (true for HTTPS in production)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Allow cookies to be sent with cross-site requests
  }
}))

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
// Portfolio GET is public, but upload/delete routes are protected in the router
app.use('/api/portfolio', portfolioRoutes)
app.use('/api/reviews', reviewsRoutes) // Reviews don't need auth

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'M&A Stump Grinding API is running' })
})

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

