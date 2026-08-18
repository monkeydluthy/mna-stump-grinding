import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAuthHeaders } from '../utils/auth'

const GA_DASHBOARD_URL = 'https://analytics.google.com/analytics/web/'

const AdminAnalytics = ({ onUnauthorized }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await axios.get('/api/analytics', { headers: getAuthHeaders() })
        setData(response.data)
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

  const cards = data?.configured
    ? [
        { label: 'Pageviews', value: data.pageviews },
        { label: 'Sessions', value: data.sessions },
        { label: 'Users', value: data.users },
        { label: 'Avg. Session', value: data.avgSession },
        { label: 'Phone Calls', value: data.phoneCalls },
        { label: 'Text Clicks', value: data.textClicks },
        { label: 'Email Clicks', value: data.emailClicks }
      ]
    : []

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '16px',
        marginBottom: '28px',
        flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Analytics</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-light)' }}>
            {data?.range || 'Last 30 days'} · Google Analytics 4
          </p>
        </div>
        <a
          href={GA_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--primary-color)',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          Open full dashboard →
        </a>
      </div>

      {loading && (
        <p style={{ color: 'var(--text-light)', padding: '40px 0', textAlign: 'center' }}>
          Loading analytics…
        </p>
      )}

      {!loading && error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '16px 20px',
          borderRadius: '10px'
        }}>
          Couldn’t load analytics: {error}
        </div>
      )}

      {!loading && data && !data.configured && (
        <div style={{
          background: 'var(--bg-light)',
          border: '1px solid #e6e8eb',
          borderRadius: '12px',
          padding: '28px'
        }}>
          <h3 style={{ marginTop: 0 }}>Almost there</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: 1.7, maxWidth: '640px' }}>
            Tracking is on the public site. To show numbers here, add a GA4 service account
            in Netlify (see <code>GA4_ADMIN_SETUP.md</code>). Until then you can still open
            the full Google Analytics dashboard.
          </p>
          <a
            href={GA_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ textDecoration: 'none', marginTop: '8px' }}
          >
            Open Google Analytics
          </a>
        </div>
      )}

      {!loading && data?.configured && !error && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {cards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: 'var(--white)',
                  border: '1px solid #ececec',
                  borderRadius: '12px',
                  padding: '22px 18px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: 'var(--text-dark)'
                }}>
                  {card.value}
                </div>
                <div style={{
                  marginTop: '8px',
                  color: 'var(--text-light)',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--white)',
            border: '1px solid #ececec',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #f0f0f0',
              fontWeight: 600
            }}>
              Top pages
            </div>
            {data.topPages?.length ? (
              data.topPages.map((page, index) => (
                <div
                  key={`${page.path}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '14px 22px',
                    borderBottom: index === data.topPages.length - 1 ? 'none' : '1px solid #f5f5f5',
                    background: index % 2 === 0 ? 'var(--white)' : '#fafbfa'
                  }}
                >
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.95rem' }}>
                    {page.path === '/' ? 'Home' : page.path}
                  </span>
                  <span style={{ color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                    {page.views} {page.views === 1 ? 'view' : 'views'}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ padding: '24px 22px', color: 'var(--text-light)', margin: 0 }}>
                No pageviews yet. Check back after the site has some traffic.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminAnalytics
