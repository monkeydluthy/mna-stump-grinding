const Hero = () => {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 0 !important;
          }
          .hero-h1 {
            font-size: clamp(1.8rem, 5vw, 3rem) !important;
            padding: 0 10px !important;
          }
          .hero-p {
            font-size: clamp(1rem, 3vw, 1.25rem) !important;
            padding: 0 10px !important;
            max-width: 100% !important;
          }
          .hero-buttons {
            padding: 0 10px !important;
          }
        }
      `}</style>
      <section className="hero-section" style={{
        backgroundImage: 'url(/stump-header.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        color: 'var(--white)',
        padding: '80px 20px',
        textAlign: 'center'
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
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="hero-h1" style={{ color: 'var(--white)', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Professional Stump Grinding Services
          </h1>
          <p className="hero-p" style={{ 
            fontSize: '1.25rem', 
            marginBottom: '40px',
            maxWidth: '800px',
            margin: '0 auto 40px',
            opacity: 0.95,
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
          }}>
            Expert stump removal that clears the way for your next project. 
            Fast, reliable, and affordable service you can trust.
          </p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
    </>
  )
}

export default Hero

