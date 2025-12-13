const Hero = () => {
  return (
    <section style={{
      backgroundImage: 'url(/stump-header.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      color: 'var(--white)',
      padding: '60px 0',
      textAlign: 'center',
      minHeight: 'auto',
      width: '100%',
      overflow: 'hidden'
    }}>
      {/* Overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '100%', padding: '0 20px' }}>
        <h1 style={{ color: 'var(--white)', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontSize: 'clamp(1.8rem, 5vw, 3rem)', padding: '0' }}>
          Professional Stump Grinding Services
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
          marginBottom: '40px',
          maxWidth: '100%',
          margin: '0 auto 40px',
          opacity: 0.95,
          textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          padding: '0'
        }}>
          Expert stump removal that clears the way for your next project. 
          Fast, reliable, and affordable service you can trust.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0', width: '100%' }}>
          <a href="tel:+18133255306" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            📞 Call Now
          </a>
          <a href="sms:+18133255306" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            💬 Text Us
          </a>
          <a href="mailto:nickperna@mnastumpgrinding.com" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            ✉️ Email
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero

