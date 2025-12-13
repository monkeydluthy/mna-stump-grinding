import { useState, useEffect } from 'react'
import Header from '../components/Header'

const PortfolioPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImages, setModalImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [modalItem, setModalItem] = useState(null)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [videoItem, setVideoItem] = useState(null)

  // Static portfolio items from public folder
  const portfolioItems = [
    {
      id: '1',
      type: 'gallery',
      images: [
        'portfolio-1.jpg',
        'portfolio-2.jpg',
        'portfolio-3.jpg',
        'portfolio-4.jpg'
      ],
      description: 'Complete stump grinding project - multiple angles showing our professional work'
    },
    {
      id: '2',
      type: 'gallery',
      images: [
        'portfolio-6.jpg',
        'portfolio-7.jpg',
        'portfolio-8.jpg',
        'portfolio-9.jpg'
      ],
      description: 'Professional stump removal project - comprehensive service showcase'
    },
    {
      id: '5',
      filename: 'portfolio-5.mp4',
      type: 'standalone',
      mediaType: 'video',
      description: 'Stump grinding in action'
    }
  ]

  const openModal = (item) => {
    setModalImages(item.images)
    setModalItem(item)
    setCurrentImageIndex(0)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalImages([])
    setModalItem(null)
    setCurrentImageIndex(0)
  }

  const openVideoModal = (item) => {
    setVideoItem(item)
    setVideoModalOpen(true)
  }

  const closeVideoModal = () => {
    setVideoModalOpen(false)
    setVideoItem(null)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modalImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length)
  }

  // Handle keyboard navigation
  useEffect(() => {
    if (!modalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % modalImages.length)
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen, modalImages.length])

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .portfolio-section {
            padding: 60px 0 40px !important;
          }
          .portfolio-h1 {
            font-size: clamp(1.8rem, 5vw, 3rem) !important;
          }
          .portfolio-p {
            font-size: clamp(0.9rem, 3vw, 1.1rem) !important;
            padding: 0 15px !important;
            max-width: 100% !important;
            margin: 0 auto 30px !important;
          }
          .portfolio-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
            gap: 20px !important;
            padding: 0 20px !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      <div>
        <Header />
        <section className="portfolio-section" style={{ padding: '100px 0 80px', background: 'var(--bg-light)' }}>
          <div className="container">
            <h1 className="portfolio-h1" style={{ textAlign: 'center', marginBottom: '20px' }}>Our Work</h1>
            <p className="portfolio-p" style={{ 
              textAlign: 'center', 
              color: 'var(--text-light)',
              fontSize: '1.1rem',
              maxWidth: '800px',
              margin: '0 auto 40px'
            }}>
              See our professional stump grinding work. Every job is completed with precision and care.
            </p>

            {portfolioItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
                  No portfolio items yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="portfolio-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '30px'
              }}>
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--white)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  {item.type === 'gallery' ? (
                    <div 
                      style={{ 
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onClick={() => openModal(item)}
                    >
                      <img 
                        src={`/${item.images[0]}`}
                        alt="Project cover"
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(10px)'
                      }}>
                        +{item.images.length - 1}
                      </div>
                    </div>
                  ) : item.type === 'before-after' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                      <div>
                        <img 
                          src={`/${item.beforeImage}`}
                          alt="Before"
                          style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                        <div style={{ 
                          padding: '10px', 
                          background: 'var(--bg-light)',
                          textAlign: 'center',
                          fontWeight: 600
                        }}>Before</div>
                      </div>
                      <div>
                        <img 
                          src={`/${item.afterImage}`}
                          alt="After"
                          style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                        />
                        <div style={{ 
                          padding: '10px', 
                          background: 'var(--bg-light)',
                          textAlign: 'center',
                          fontWeight: 600
                        }}>After</div>
                      </div>
                    </div>
                  ) : item.mediaType === 'video' ? (
                    <div 
                      style={{ 
                        position: 'relative',
                        cursor: 'pointer',
                        width: '100%',
                        height: '300px',
                        background: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => openVideoModal(item)}
                    >
                      <video
                        preload="metadata"
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        muted
                      >
                        <source src={`/${item.filename}`} type="video/mp4" />
                      </video>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '60px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        color: 'var(--text-dark)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        ▶
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={`/${item.filename}`}
                      alt={item.description || 'Portfolio item'}
                      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />
                  )}
                  {item.description && (
                    <div style={{ padding: '20px' }}>
                      <p style={{ color: 'var(--text-light)' }}>{item.description}</p>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>
        </section>

      {/* Image Gallery Modal */}
      {modalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              position: 'relative',
              background: 'var(--white)',
              borderRadius: '12px',
              maxWidth: '95vw',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              margin: '0 10px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  marginBottom: '5px',
                  fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                  color: 'var(--text-dark)'
                }}>
                  {modalItem?.description || 'Project Gallery'}
                </h2>
                {modalItem?.description && (
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--text-light)',
                    fontSize: '0.9rem'
                  }}>
                    Complete stump grinding project
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dark)',
                  fontSize: '1.5rem',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                ×
              </button>
            </div>

            {/* Image Container */}
            <div style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              background: '#f8f8f8',
              minHeight: '300px'
            }}>
              {/* Previous Button */}
              {modalImages.length > 1 && (
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    color: 'var(--text-dark)',
                    fontSize: '1.5rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--white)'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  ‹
                </button>
              )}

              <div style={{
                width: '100%',
                maxWidth: 'min(90vw, 600px)',
                aspectRatio: '1 / 1',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                background: '#fff',
                margin: '0 auto'
              }}>
                <img 
                  src={`/${modalImages[currentImageIndex]}`}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>

              {/* Next Button */}
              {modalImages.length > 1 && (
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    color: 'var(--text-dark)',
                    fontSize: '1.5rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 10
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--white)'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  ›
                </button>
              )}

              {/* Image Counter */}
              {modalImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  {currentImageIndex + 1} / {modalImages.length}
                </div>
              )}
            </div>

            {/* Footer */}
            {modalItem && (
              <div style={{
                padding: '15px 20px',
                borderTop: '1px solid #e0e0e0',
                background: 'var(--white)',
                display: 'flex',
                gap: '20px',
                fontSize: '0.85rem',
                color: 'var(--text-light)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Service:</strong> Stump Grinding
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Project:</strong> Complete Removal
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && videoItem && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeVideoModal}
        >
          <div 
            style={{
              position: 'relative',
              background: 'var(--white)',
              borderRadius: '12px',
              maxWidth: '95vw',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              margin: '0 10px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: '15px 20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  marginBottom: '5px',
                  fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                  color: 'var(--text-dark)'
                }}>
                  {videoItem.description || 'Video'}
                </h2>
                <p style={{ 
                  margin: 0, 
                  color: 'var(--text-light)',
                  fontSize: '0.9rem'
                }}>
                  Stump grinding in action
                </p>
              </div>
              <button
                onClick={closeVideoModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dark)',
                  fontSize: '1.5rem',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'background 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                ×
              </button>
            </div>

            {/* Video Container */}
            <div style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px',
              background: '#000',
              minHeight: '300px'
            }}>
              <div style={{
                width: '100%',
                maxWidth: 'min(90vw, 600px)',
                aspectRatio: '1 / 1',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                background: '#000'
              }}>
                <video
                  controls
                  autoPlay
                  preload="metadata"
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                >
                  <source src={`/${videoItem.filename}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '15px 20px',
              borderTop: '1px solid #e0e0e0',
              background: 'var(--white)',
              display: 'flex',
              gap: '20px',
              fontSize: '0.85rem',
              color: 'var(--text-light)',
              flexWrap: 'wrap'
            }}>
              <div>
                <strong style={{ color: 'var(--text-dark)' }}>Service:</strong> Stump Grinding
              </div>
              <div>
                <strong style={{ color: 'var(--text-dark)' }}>Media:</strong> Video
              </div>
            </div>
          </div>
        </div>
      )}

      <footer style={{
        background: 'var(--text-dark)',
        color: 'var(--white)',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} M&A Stump Grinding. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  )
}

export default PortfolioPage

