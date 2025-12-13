const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image and video files are allowed'))
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
})

// Portfolio data file (simple JSON storage - can upgrade to database later)
const portfolioFile = path.join(__dirname, '../portfolio.json')

// Helper function to read portfolio data
const readPortfolio = () => {
  try {
    if (fs.existsSync(portfolioFile)) {
      const data = fs.readFileSync(portfolioFile, 'utf8')
      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.error('Error reading portfolio:', error)
    return []
  }
}

// Helper function to write portfolio data
const writePortfolio = (data) => {
  try {
    fs.writeFileSync(portfolioFile, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing portfolio:', error)
    return false
  }
}

// Get all portfolio items
router.get('/', (req, res) => {
  try {
    const portfolio = readPortfolio()
    res.json(portfolio)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' })
  }
})

// Upload single image/video (standalone)
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const portfolio = readPortfolio()
    const isVideo = req.file.mimetype.startsWith('video/')
    
    const newItem = {
      id: uuidv4(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mediaType: isVideo ? 'video' : 'image',
      type: 'standalone',
      description: req.body.description || '',
      uploadedAt: new Date().toISOString()
    }

    portfolio.push(newItem)
    writePortfolio(portfolio)

    res.json({ message: 'File uploaded successfully', item: newItem })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Upload before/after images
router.post('/upload-before-after', upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), (req, res) => {
  try {
    if (!req.files.beforeImage || !req.files.afterImage) {
      return res.status(400).json({ error: 'Both before and after images are required' })
    }

    const portfolio = readPortfolio()
    
    const newItem = {
      id: uuidv4(),
      beforeImage: req.files.beforeImage[0].filename,
      afterImage: req.files.afterImage[0].filename,
      type: 'before-after',
      description: req.body.description || '',
      uploadedAt: new Date().toISOString()
    }

    portfolio.push(newItem)
    writePortfolio(portfolio)

    res.json({ message: 'Before/after images uploaded successfully', item: newItem })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload files' })
  }
})

// Delete portfolio item
router.delete('/:id', (req, res) => {
  try {
    const portfolio = readPortfolio()
    const item = portfolio.find(p => p.id === req.params.id)
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    // Delete associated files
    const uploadsDir = path.join(__dirname, '../uploads')
    if (item.type === 'before-after') {
      if (item.beforeImage) {
        const beforePath = path.join(uploadsDir, item.beforeImage)
        if (fs.existsSync(beforePath)) fs.unlinkSync(beforePath)
      }
      if (item.afterImage) {
        const afterPath = path.join(uploadsDir, item.afterImage)
        if (fs.existsSync(afterPath)) fs.unlinkSync(afterPath)
      }
    } else if (item.filename) {
      const filePath = path.join(uploadsDir, item.filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    // Remove from portfolio
    const updatedPortfolio = portfolio.filter(p => p.id !== req.params.id)
    writePortfolio(updatedPortfolio)

    res.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

module.exports = router

