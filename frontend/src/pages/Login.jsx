import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          const response = await axios.get('/api/auth/check', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (response.data.authenticated) {
            navigate('/admin')
          } else {
            localStorage.removeItem('authToken')
          }
        }
      } catch (error) {
        localStorage.removeItem('authToken')
      }
    }
    checkAuth()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })

      if (response.data.success && response.data.token) {
        // Store JWT token
        localStorage.setItem('authToken', response.data.token)
        navigate('/admin')
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <div style={{
        maxWidth: '500px',
        margin: '80px auto',
        padding: '40px',
        background: 'var(--white)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          marginBottom: '30px', 
          textAlign: 'center',
          color: 'var(--text-dark)'
        }}>
          Admin Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: 600,
              color: 'var(--text-dark)'
            }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontWeight: 600,
              color: 'var(--text-dark)'
            }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              borderRadius: '8px',
              background: '#f8d7da',
              color: '#721c24'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              width: '100%',
              padding: '14px',
              fontSize: '16px'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

