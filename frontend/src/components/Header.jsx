import { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header style={{
        background: 'var(--white)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 20px'
        }}>
          <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMobileMenu}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/logo-clear.png" 
                alt="M&A Stump Grinding Logo" 
                style={{ 
                  height: '80px', 
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  const textSpan = e.target.nextSibling
                  if (textSpan) textSpan.style.display = 'block'
                }}
              />
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--primary-color)',
                display: 'none'
              }}>M&A Stump Grinding</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                color: 'var(--text-dark)',
                fontWeight: 500,
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}
            >
              Home
            </Link>
            <Link 
              to="/portfolio" 
              style={{ 
                textDecoration: 'none', 
                color: 'var(--text-dark)',
                fontWeight: 500,
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-dark)'}
            >
              Portfolio
            </Link>
            <a 
              href="https://www.facebook.com/mnastumpgrinding/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src="/facebook.png" 
                alt="Facebook" 
                style={{ 
                  height: '32px', 
                  width: '32px'
                }}
              />
            </a>
            <a 
              href="tel:+18133255306" 
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              Call Now
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              flexDirection: 'column',
              gap: '5px',
              zIndex: 1001
            }}
          >
            <span style={{
              display: 'block',
              width: '25px',
              height: '3px',
              background: 'var(--text-dark)',
              transition: 'all 0.3s',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
            }}></span>
            <span style={{
              display: 'block',
              width: '25px',
              height: '3px',
              background: 'var(--text-dark)',
              transition: 'all 0.3s',
              opacity: mobileMenuOpen ? 0 : 1
            }}></span>
            <span style={{
              display: 'block',
              width: '25px',
              height: '3px',
              background: 'var(--text-dark)',
              transition: 'all 0.3s',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
            }}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={closeMobileMenu}
        >
          {/* Close Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '40px'
          }}>
            <button
              onClick={closeMobileMenu}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--white)',
                fontSize: '2rem',
                cursor: 'pointer',
                padding: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Menu Items */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center'
          }}>
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              style={{
                background: 'var(--primary-color)',
                padding: '20px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'var(--white)',
                fontSize: '1.2rem',
                fontWeight: 600,
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center',
                transition: 'all 0.3s',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--secondary-color)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary-color)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Home
            </Link>
            <Link 
              to="/portfolio" 
              onClick={closeMobileMenu}
              style={{
                background: 'var(--primary-color)',
                padding: '20px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'var(--white)',
                fontSize: '1.2rem',
                fontWeight: 600,
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center',
                transition: 'all 0.3s',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--secondary-color)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary-color)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Portfolio
            </Link>
            <a 
              href="https://www.facebook.com/mnastumpgrinding/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              style={{
                background: 'var(--primary-color)',
                padding: '20px 40px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: 'var(--white)',
                fontSize: '1.2rem',
                fontWeight: 600,
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center',
                transition: 'all 0.3s',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--secondary-color)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary-color)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <img 
                src="/facebook.png" 
                alt="Facebook" 
                style={{ 
                  height: '24px', 
                  width: '24px'
                }}
              />
              Facebook
            </a>
            <a 
              href="tel:+18133255306" 
              onClick={closeMobileMenu}
              className="btn btn-primary"
              style={{
                textDecoration: 'none',
                width: '100%',
                maxWidth: '300px',
                textAlign: 'center',
                padding: '20px 40px',
                fontSize: '1.2rem'
              }}
            >
              Call Now
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex !important;
          }

          header .container {
            padding: 15px !important;
          }

          header img {
            height: 60px !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default Header

