const Contact = () => {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
      color: 'var(--white)',
      padding: '80px 0'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
      <div className="container" style={{ width: '100%', maxWidth: '100%', padding: '0 20px' }}>
        <div className="contact-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'stretch',
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Left side - Contact options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '15px',
            height: '100%'
          }}>
            <a 
              href="tel:+18133255306"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'var(--white)',
                transition: 'all 0.3s',
                border: '2px solid rgba(255,255,255,0.2)',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📞</div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Call Us</h3>
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '5px' }}>(813) 325-5306</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Available 24/7</p>
            </a>

            <a 
              href="sms:+18133255306"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'var(--white)',
                transition: 'all 0.3s',
                border: '2px solid rgba(255,255,255,0.2)',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Text Us</h3>
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '5px' }}>(813) 325-5306</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Quick response</p>
            </a>

            <a 
              href="mailto:nickperna@mnastumpgrinding.com"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                textDecoration: 'none',
                color: 'var(--white)',
                transition: 'all 0.3s',
                border: '2px solid rgba(255,255,255,0.2)',
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✉️</div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Email Us</h3>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '5px' }}>nickperna@mnastumpgrinding.com</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Send us a message</p>
            </a>
          </div>

          {/* Right side - Image */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%'
          }}>
            <img 
              src="/footer-img.jpg" 
              alt="Contact us" 
              style={{
                width: '100%',
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

