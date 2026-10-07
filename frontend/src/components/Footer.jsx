import { BUSINESS } from '../data/business'
import {
  SERVICE_AREA_BY_COUNTY,
  SERVICE_AREA_CITIES,
  SERVICE_AREA_HEADLINE,
} from '../data/serviceCities'

const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--text-dark)',
        color: 'var(--white)',
        padding: '48px 0 40px',
        textAlign: 'center',
      }}
    >
      <div className="container">
        <p style={{ fontWeight: 600, marginBottom: '8px' }}>{BUSINESS.name}</p>
        <p style={{ opacity: 0.9, marginBottom: '4px' }}>
          {BUSINESS.serviceAreaTagline}
        </p>
        <p style={{ opacity: 0.9, marginBottom: '4px' }}>
          <a
            href={`tel:${BUSINESS.phoneE164}`}
            data-link-location="footer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {BUSINESS.phoneDisplay}
          </a>
          {' · '}
          {BUSINESS.hoursDisplay}
        </p>

        <div
          className="footer-service-area"
          style={{
            marginTop: '36px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: 'clamp(1.05rem, 2.8vw, 1.25rem)',
              lineHeight: 1.35,
              margin: '0 0 10px',
              letterSpacing: '-0.01em',
            }}
          >
            {SERVICE_AREA_HEADLINE}
          </p>
          <p
            style={{
              fontSize: '0.85rem',
              opacity: 0.75,
              margin: '0 0 14px',
              fontWeight: 500,
            }}
          >
            including:
          </p>
          <nav
            aria-label={`Service area cities across ${SERVICE_AREA_BY_COUNTY.map((c) => c.name).join(', ')}`}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'baseline',
              rowGap: '6px',
              columnGap: '0',
              width: '100%',
              fontSize: '0.875rem',
              lineHeight: 1.55,
              opacity: 0.92,
            }}
          >
            {SERVICE_AREA_CITIES.map((city, index) => (
              <span
                key={city}
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  whiteSpace: 'nowrap',
                }}
              >
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      padding: '0 0.4em',
                      opacity: 0.45,
                      userSelect: 'none',
                    }}
                  >
                    ·
                  </span>
                )}
                <a
                  href="/"
                  data-link-location="footer-service-area"
                  style={{
                    color: 'inherit',
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                    textDecorationColor: 'rgba(255,255,255,0.35)',
                    fontWeight: 400,
                  }}
                >
                  {city}
                </a>
              </span>
            ))}
          </nav>
        </div>

        <p style={{ marginTop: '32px', opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </p>
        <p style={{ marginTop: '8px', opacity: 0.8 }}>
          Licensed & Insured | Serving {BUSINESS.serviceArea}
        </p>
        <p style={{ marginTop: '8px', opacity: 0.7, fontSize: '0.9rem' }}>
          Site by{' '}
          <a
            href="https://digitaldynamicsolution.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            DDS
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
