import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SeoHead from '../components/SeoHead'
import Footer from '../components/Footer'
import LeadForm from '../components/LeadForm'
import NotFound from './NotFound'
import { BUSINESS } from '../data/business'
import {
  buildLocationFaqSchema,
  getLocationBySlug,
} from '../data/locations'
import { thumbUrl, lightboxUrl } from '../utils/images'

const FAQ_SCRIPT_ID = 'location-faq-jsonld'

const LocationPage = () => {
  const { citySlug } = useParams()
  const location = getLocationBySlug(`stump-grinding-${citySlug}`)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    if (!location) return

    const existing = document.getElementById(FAQ_SCRIPT_ID)
    if (existing) existing.remove()

    const script = document.createElement('script')
    script.id = FAQ_SCRIPT_ID
    script.type = 'application/ld+json'
    script.text = JSON.stringify(buildLocationFaqSchema(location.faqs))
    document.head.appendChild(script)

    return () => {
      document.getElementById(FAQ_SCRIPT_ID)?.remove()
    }
  }, [location])

  if (!location) {
    return <NotFound />
  }

  const canonical = `${BUSINESS.url}${location.path}`

  return (
    <div>
      <SeoHead
        title={location.title}
        description={location.description}
        canonical={canonical}
      />

      <section
        style={{
          background:
            'linear-gradient(160deg, #1a2e0f 0%, var(--primary-color) 45%, var(--secondary-color) 100%)',
          color: 'var(--white)',
          padding: '72px 0 64px',
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            {location.county} County · {location.state}
          </p>
          <h1
            style={{
              margin: '0 0 16px',
              fontSize: 'clamp(1.85rem, 4.5vw, 2.75rem)',
              lineHeight: 1.15,
              color: 'var(--white)',
            }}
          >
            {location.h1}
          </h1>
          <p
            style={{
              margin: '0 0 28px',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              opacity: 0.95,
            }}
          >
            {location.intro}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <a
              href="#lead-form"
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('lead-form')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
                window.setTimeout(() => {
                  document.getElementById('lead-name')?.focus({
                    preventScroll: true,
                  })
                }, 450)
              }}
            >
              Get a Quote
            </a>
            <a
              href={`tel:${BUSINESS.phoneE164}`}
              data-link-location="location-hero"
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            >
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-light)', padding: '64px 0' }}>
        <div className="container">
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '12px',
              color: 'var(--primary-color)',
            }}
          >
            Recent stump grinding work
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-light)',
              maxWidth: '560px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Real jobs from our portfolio — the same equipment and cleanup we bring
            to {location.city} properties.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {location.photos.map((photo) => (
              <figure
                key={photo.src}
                style={{
                  margin: 0,
                  background: 'var(--white)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                <a href={lightboxUrl(photo.src)} target="_blank" rel="noopener noreferrer">
                  <img
                    src={thumbUrl(photo.src)}
                    alt={photo.alt}
                    width={photo.width || 800}
                    height={photo.height || 600}
                    loading="lazy"
                    decoding="async"
                    style={{
                      display: 'block',
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                    }}
                  />
                </a>
                <figcaption
                  style={{
                    padding: '14px 16px',
                    fontSize: '0.9rem',
                    color: 'var(--text-light)',
                    lineHeight: 1.45,
                  }}
                >
                  {photo.alt}
                </figcaption>
              </figure>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link
              to="/portfolio"
              style={{ color: 'var(--primary-color)', fontWeight: 600 }}
            >
              See the full portfolio →
            </Link>
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--white)', padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '28px',
              color: 'var(--primary-color)',
            }}
          >
            {location.city} stump grinding FAQ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {location.faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={faq.question}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '16px 18px',
                      background: isOpen ? 'var(--bg-light)' : 'var(--white)',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: 'var(--text-dark)',
                      fontFamily: 'inherit',
                    }}
                  >
                    {faq.question}
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 18px 16px',
                        color: 'var(--text-light)',
                        lineHeight: 1.65,
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="lead-form"
        style={{
          background:
            'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          color: 'var(--white)',
          padding: '72px 0',
          scrollMarginTop: '100px',
        }}
      >
        <div className="container">
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '12px',
              color: 'var(--white)',
            }}
          >
            Get a free stump grinding quote in {location.city}
          </h2>
          <p
            style={{
              textAlign: 'center',
              opacity: 0.95,
              maxWidth: '640px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Tell us about your stump and we’ll follow up quickly — or call{' '}
            <a
              href={`tel:${BUSINESS.phoneE164}`}
              data-link-location="location-cta"
              style={{ color: 'inherit', fontWeight: 600 }}
            >
              {BUSINESS.phoneDisplay}
            </a>
            .
          </p>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <LeadForm />
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-light)', padding: '40px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px', color: 'var(--text-light)' }}>
            <Link to="/" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
              ← Back to M&A Stump Grinding home
            </Link>
          </p>
          <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem' }}>
            Also serving nearby:{' '}
            {location.relatedCities.map((city, i) => (
              <span key={city.name}>
                {i > 0 && ' · '}
                <Link
                  to={city.path}
                  style={{ color: 'var(--primary-color)' }}
                >
                  {city.name}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LocationPage
