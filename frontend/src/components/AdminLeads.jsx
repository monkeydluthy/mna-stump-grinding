import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAuthHeaders } from '../utils/auth'

const AdminLeads = ({ onUnauthorized }) => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('inbox')
  const [restoringId, setRestoringId] = useState(null)
  const [actionError, setActionError] = useState('')

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

  const spamLeads = leads.filter((lead) => lead.status === 'spam')
  const inboxLeads = leads.filter((lead) => lead.status !== 'spam')
  const visibleLeads = tab === 'filtered' ? spamLeads : inboxLeads
  const showMessage = tab === 'filtered'

  /** Restore a filtered lead to the inbox via the existing status PATCH */
  const markNotSpam = async (lead) => {
    setActionError('')
    setRestoringId(lead.id)
    try {
      const response = await axios.patch(
        `/api/leads/${encodeURIComponent(lead.id)}`,
        { status: 'new' },
        { headers: getAuthHeaders() }
      )
      const updated = response.data?.lead
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? updated || { ...l, status: 'new' } : l))
      )
    } catch (err) {
      if (err.response?.status === 401) {
        onUnauthorized?.()
        return
      }
      setActionError(err.response?.data?.details || err.response?.data?.error || err.message)
    } finally {
      setRestoringId(null)
    }
  }

  const tabButton = (key, label) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      aria-pressed={tab === key}
      style={{
        padding: '8px 16px',
        borderRadius: '999px',
        border: '1px solid #d9ded6',
        background: tab === key ? 'var(--primary-color)' : 'var(--white)',
        color: tab === key ? 'var(--white)' : 'var(--text-dark)',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )

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
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          {tabButton('inbox', `Inbox (${inboxLeads.length})`)}
          {tabButton('filtered', `Filtered (${spamLeads.length})`)}
        </div>
        {tab === 'filtered' && (
          <p style={{ margin: '12px 0 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Submissions the spam filter caught. No email was sent for these. If a real
            customer ended up here, use “Not spam” to move them back to the inbox.
          </p>
        )}
      </div>

      {actionError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: '#f8d7da',
            color: '#721c24',
            marginBottom: '16px',
          }}
        >
          {actionError}
        </div>
      )}

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

      {!loading && !error && visibleLeads.length === 0 && (
        <p style={{ color: 'var(--text-light)', padding: '40px 0', textAlign: 'center' }}>
          {tab === 'filtered' ? 'Nothing filtered.' : 'No leads yet.'}
        </p>
      )}

      {!loading && !error && visibleLeads.length > 0 && (
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
                {(showMessage
                  ? ['Date', 'Name', 'Phone', 'Service', 'Message', '']
                  : ['Date', 'Name', 'Phone', 'Service', 'Status']
                ).map((label) => (
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
              {visibleLeads.map((lead) => (
                <tr key={lead.id}>
                  <td style={tdStyle}>{formatDate(lead.createdAt)}</td>
                  <td style={tdStyle}>{lead.name}</td>
                  <td style={tdStyle}>
                    <a href={`tel:${lead.phone}`} style={{ color: 'var(--primary-color)' }}>
                      {lead.phone}
                    </a>
                  </td>
                  <td style={tdStyle}>{lead.serviceNeeded || '—'}</td>
                  {showMessage ? (
                    <>
                      <td style={{ ...tdStyle, maxWidth: '420px', whiteSpace: 'pre-wrap' }}>
                        {lead.message
                          ? lead.message.length > 280
                            ? `${lead.message.slice(0, 280)}…`
                            : lead.message
                          : '—'}
                      </td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => markNotSpam(lead)}
                          disabled={restoringId === lead.id}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--primary-color)',
                            background: 'var(--white)',
                            color: 'var(--primary-color)',
                            fontWeight: 600,
                            cursor: restoringId === lead.id ? 'wait' : 'pointer',
                          }}
                        >
                          {restoringId === lead.id ? 'Restoring…' : 'Not spam'}
                        </button>
                      </td>
                    </>
                  ) : (
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
                  )}
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
