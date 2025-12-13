const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const portfolioRoutes = require('./routes/portfolio')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/portfolio', portfolioRoutes)

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

