import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAuthHeaders } from '../utils/auth'

const AdminLeads = ({ onUnauthorized }) => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/api/leads', { headers: getAuthHeaders() })
        setLeads(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        if (err.response?.status === 401) {
          onUnauthorized?.()
          return
        }
        setError(err.response?.data?.details || err.response?.data?.error || err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [onUnauthorized])

  const formatDate = (value) => {
    if (!value) return '—'
    try {
      return new Date(value).toLocaleString()
    } catch {
      return value
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Leads</h2>
        <p style={{ margin: '6px 0 0', color: 'var(--text-light)' }}>
          Quote requests from the homepage form · newest first
        </p>
      </div>

      {loading && (
        <p style={{ color: 'var(--text-light)', padding: '40px 0', textAlign: 'center' }}>
          Loading leads…
        </p>
      )}

      {!loading && error && (
        <div
          style={{
            padding: '16px',
            borderRadius: '8px',
            background: '#f8d7da',
            color: '#721c24',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <p style={{ color: 'var(--text-light)', padding: '40px 0', textAlign: 'center' }}>
          No leads yet.
        </p>
      )}

      {!loading && !error && leads.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'var(--white)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.08)',
            }}
          >
            <thead>
              <tr style={{ background: '#f4f6f3', textAlign: 'left' }}>
                {['Date', 'Name', 'Phone', 'Service', 'Status'].map((label) => (
                  <th
                    key={label}
                    style={{
                      padding: '14px 16px',
                      fontSize: '0.9rem',
                      color: 'var(--text-dark)',
                      borderBottom: '1px solid #e5e8e3',
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={tdStyle}>{formatDate(lead.createdAt)}</td>
                  <td style={tdStyle}>{lead.name}</td>
                  <td style={tdStyle}>
                    <a href={`tel:${lead.phone}`} style={{ color: 'var(--primary-color)' }}>
                      {lead.phone}
                    </a>
                  </td>
                  <td style={tdStyle}>{lead.serviceNeeded || '—'}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: lead.status === 'new' ? '#eef3ea' : '#f0f0f0',
                        color: 'var(--primary-color)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      {lead.status || 'new'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const tdStyle = {
  padding: '14px 16px',
  borderBottom: '1px solid #eef0ed',
  fontSize: '0.95rem',
  color: 'var(--text-dark)',
  verticalAlign: 'top',
}

export default AdminLeads
