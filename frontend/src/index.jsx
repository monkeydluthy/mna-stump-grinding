import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

// Configure axios base URL
// In development, Vite proxy handles /api routes
// In production, Netlify Functions handle /api routes automatically
// No base URL needed - use relative paths

// Configure axios to send credentials (cookies) with all requests
axios.defaults.withCredentials = true

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

