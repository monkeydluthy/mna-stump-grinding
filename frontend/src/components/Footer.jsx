import { BUSINESS } from '../data/business'

const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--text-dark)',
        color: 'var(--white)',
        padding: '40px 0',
        textAlign: 'center',
      }}
    >
      <div className="container">
        <p style={{ fontWeight: 600, marginBottom: '8px' }}>{BUSINESS.name}</p>
        <p style={{ opacity: 0.9, marginBottom: '4px' }}>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(BUSINESS.addressFull)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {BUSINESS.addressFull}
          </a>
        </p>
        <p style={{ opacity: 0.9, marginBottom: '4px' }}>
          <a
            href={`tel:${BUSINESS.phoneE164}`}
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            {BUSINESS.phoneDisplay}
          </a>
          {' · '}
          {BUSINESS.hoursDisplay}
        </p>
        <p style={{ marginTop: '16px', opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </p>
        <p style={{ marginTop: '8px', opacity: 0.8 }}>
          Licensed & Insured | Serving {BUSINESS.serviceArea}
        </p>
      </div>
    </footer>
  )
}

export default Footer
