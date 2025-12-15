const express = require('express')
const router = express.Router()

// Allowed emails
const ALLOWED_EMAILS = [
  'luthdigitalconsult@gmail.com',
  'nickperna@mnastumpgrinding.com'
]
const PASSWORD = 'bigpern555!'

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (ALLOWED_EMAILS.includes(email.toLowerCase()) && password === PASSWORD) {
    req.session.isAuthenticated = true
    req.session.userEmail = email.toLowerCase()
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { email: email.toLowerCase() }
    })
  } else {
    res.status(401).json({ error: 'Invalid email or password' })
  }
})

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' })
    }
    res.json({ success: true, message: 'Logged out successfully' })
  })
})

// Check auth status
router.get('/check', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.json({ 
      authenticated: true, 
      user: { email: req.session.userEmail } 
    })
  } else {
    res.json({ authenticated: false })
  }
})

module.exports = router

