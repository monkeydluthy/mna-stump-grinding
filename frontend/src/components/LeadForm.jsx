import { useMemo, useState } from 'react'
import axios from 'axios'
import { trackEvent } from '../utils/analytics'

const SERVICE_OPTIONS = [
  'Stump Grinding',
  'Tree Stump Removal',
  'Multiple Stumps',
  'Commercial Job',
  'Other / Not Sure',
]

function readUtmParams() {
  if (typeof window === 'undefined') {
    return { utmSource: '', utmMedium: '', utmCampaign: '' }
  }
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
  }
}

const LeadForm = () => {
  const utm = useMemo(() => readUtmParams(), [])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cityZip: '',
    serviceNeeded: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.')
      return
    }

    setSubmitting(true)
    try {
      await axios.post('/api/leads', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        cityZip: form.cityZip.trim(),
        serviceNeeded: form.serviceNeeded.trim(),
        message: form.message.trim(),
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
      })

      // No PII in GA4 params — only non-identifying context
      trackEvent('generate_lead', {
        lead_source: 'homepage_form',
        has_service: Boolean(form.serviceNeeded.trim()),
        has_utm: Boolean(utm.utmSource || utm.utmMedium || utm.utmCampaign),
      })

      setSuccess(true)
      setForm({
        name: '',
        phone: '',
        email: '',
        cityZip: '',
        serviceNeeded: '',
        message: '',
      })
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Something went wrong. Please call or text us instead.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const fieldStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '2px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    fontSize: '0.95rem',
  }

  if (success) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '28px 24px',
          textAlign: 'center',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.35rem' }}>
          Request received
        </h3>
        <p style={{ margin: 0, opacity: 0.95, lineHeight: 1.6 }}>
          Thanks — we got your details and will follow up soon. Prefer to talk now?
          Call or text (813) 325-5306.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="btn btn-secondary"
          style={{
            alignSelf: 'center',
            marginTop: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding: '24px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '1.35rem' }}>
        Request a free quote
      </h3>
      <p style={{ margin: '0 0 20px', opacity: 0.9, lineHeight: 1.5, fontSize: '0.95rem' }}>
        Prefer a callback? Leave your details and we’ll reach out.
      </p>

      <div style={{ display: 'grid', gap: '14px' }}>
        <div>
          <label style={labelStyle} htmlFor="lead-name">
            Name *
          </label>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={updateField('name')}
            style={fieldStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="lead-phone">
            Phone *
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={updateField('phone')}
            style={fieldStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="lead-email">
            Email
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField('email')}
            style={fieldStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="lead-city">
            City / ZIP
          </label>
          <input
            id="lead-city"
            name="cityZip"
            autoComplete="postal-code"
            value={form.cityZip}
            onChange={updateField('cityZip')}
            style={fieldStyle}
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="lead-service">
            Service needed
          </label>
          <select
            id="lead-service"
            name="serviceNeeded"
            value={form.serviceNeeded}
            onChange={updateField('serviceNeeded')}
            style={{ ...fieldStyle, appearance: 'auto' }}
          >
            <option value="" style={{ color: '#111' }}>
              Select a service
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option} style={{ color: '#111' }}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle} htmlFor="lead-message">
            Message
          </label>
          <textarea
            id="lead-message"
            name="message"
            rows={3}
            value={form.message}
            onChange={updateField('message')}
            style={{ ...fieldStyle, resize: 'vertical' }}
          />
        </div>
      </div>

      {error && (
        <p
          style={{
            margin: '14px 0 0',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(248, 215, 218, 0.95)',
            color: '#721c24',
            fontSize: '0.95rem',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-secondary"
        style={{
          width: '100%',
          marginTop: '18px',
          border: 'none',
          cursor: submitting ? 'wait' : 'pointer',
          opacity: submitting ? 0.8 : 1,
        }}
      >
        {submitting ? 'Sending…' : 'Request a Quote'}
      </button>
    </form>
  )
}

export default LeadForm
