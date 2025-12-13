import { useState, useEffect, useRef } from 'react'

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const reviews = [
    {
      name: 'Sarah Johnson',
      date: '2 weeks ago',
      text: 'Excellent service! They removed a large stump from my backyard quickly and professionally. The team was on time, cleaned up everything, and left the area looking great. Highly recommend!'
    },
    {
      name: 'Michael Chen',
      date: '1 month ago',
      text: 'Fast, efficient, and affordable. Had multiple stumps removed and they did an amazing job. The crew was friendly and professional. Will definitely use them again!'
    },
    {
      name: 'Jennifer Martinez',
      date: '3 weeks ago',
      text: 'Outstanding work! They ground down a huge oak stump that was in the way of our new patio. Clean, professional, and reasonably priced. Very happy with the results!'
    },
    {
      name: 'David Thompson',
      date: '1 week ago',
      text: 'Great experience from start to finish. Quick response, fair pricing, and excellent workmanship. They removed three stumps and the yard looks perfect now. Highly professional team!'
    },
    {
      name: 'Robert Williams',
      date: '2 months ago',
      text: 'Top-notch service! Professional, punctual, and thorough. They made quick work of a difficult stump removal. The cleanup was impeccable. Would hire again!'
    },
    {
      name: 'Lisa Anderson',
      date: '3 weeks ago',
      text: 'Amazing results! The stump grinding was done perfectly and the area was left spotless. Great communication throughout the process. Highly satisfied!'
    }
  ]

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      // Swipe left - next review
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous review
      setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  const goToReview = (index) => {
    setCurrentReviewIndex(index)
  }

  const ReviewCard = ({ review, index }) => (
    <div 
      key={index}
      className="review-card"
      style={{
        background: 'var(--white)',
        padding: isMobile ? '25px' : '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: isMobile ? '100%' : '320px',
        maxWidth: isMobile ? '100%' : '320px',
        width: isMobile ? '100%' : '320px',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.1rem' }}>{review.name}</div>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: '#FFA500', fontSize: '1rem' }}>★</span>
            ))}
          </div>
        </div>
        <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{review.date}</span>
      </div>
      <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.95rem' }}>
        {review.text}
      </p>
    </div>
  )

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .review-card {
            min-width: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 20px !important;
            box-sizing: border-box !important;
          }
          .reviews-container {
            padding: 0 20px !important;
          }
          .reviews-header {
            padding: 0 20px !important;
            flex-wrap: wrap !important;
            gap: 15px !important;
          }
          .reviews-track {
            padding: 0 20px !important;
            gap: 15px !important;
          }
          .mobile-reviews-wrapper {
            display: flex !important;
            overflow: hidden !important;
            position: relative !important;
            touch-action: pan-y !important;
          }
          .mobile-review-slide {
            min-width: 100% !important;
            max-width: 100% !important;
            width: 100% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            transition: transform 0.3s ease !important;
            padding: 0 10px !important;
            box-sizing: border-box !important;
          }
          .mobile-reviews-track {
            display: flex !important;
            transition: transform 0.3s ease !important;
          }
          .review-dots {
            display: flex !important;
            justify-content: center !important;
            gap: 8px !important;
            margin-top: 20px !important;
          }
          .review-dot {
            width: 10px !important;
            height: 10px !important;
            border-radius: 50% !important;
            background: rgba(0, 0, 0, 0.2) !important;
            cursor: pointer !important;
            transition: background 0.3s !important;
          }
          .review-dot.active {
            background: var(--primary-color) !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-reviews-wrapper {
            display: none !important;
          }
          .review-dots {
            display: none !important;
          }
        }
      `}</style>
      <section style={{ background: 'var(--white)', overflow: 'hidden' }}>
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            marginTop: '40px'
          }}>
            {/* Google Reviews Carousel */}
            <div className="reviews-container" style={{
              width: '100%',
              background: 'var(--bg-light)',
              borderRadius: '12px',
              padding: '30px 0',
              overflow: 'hidden'
            }}>
              <div className="reviews-header" style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '20px' : '0',
                marginBottom: '30px',
                padding: '0 30px'
              }}>
                <div style={{ width: '100%' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '1.3rem' }}>Google Reviews</h3>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? '12px' : '15px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>4.9</span>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: '#FFA500', fontSize: '1.3rem' }}>★</span>
                        ))}
                      </div>
                    </div>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>(24 reviews)</span>
                  </div>
                </div>
                <a 
                  href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ 
                    textDecoration: 'none',
                    width: isMobile ? '100%' : 'auto',
                    textAlign: 'center'
                  }}
                >
                  Leave a Review
                </a>
              </div>

            {/* Desktop: Scrolling Container */}
            <div className="desktop-reviews" style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              display: isMobile ? 'none' : 'block'
            }}>
              <div className="reviews-track" style={{
                display: 'flex',
                gap: '20px',
                width: 'fit-content',
                padding: '0 30px'
              }}>
                {/* First set of reviews */}
                {reviews.map((review, index) => (
                  <ReviewCard key={`first-${index}`} review={review} index={index} />
                ))}
                {/* Duplicate set for seamless loop */}
                {reviews.map((review, index) => (
                  <ReviewCard key={`second-${index}`} review={review} index={index} />
                ))}
              </div>
            </div>

            {/* Mobile: Swipeable Reviews */}
            <div 
              className="mobile-reviews-wrapper"
              style={{
                display: isMobile ? 'block' : 'none',
                position: 'relative',
                overflow: 'hidden',
                width: '100%',
                minHeight: '200px',
                padding: '0 20px'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="mobile-reviews-track"
                style={{
                  display: 'flex',
                  transform: `translateX(-${currentReviewIndex * 100}%)`,
                  transition: 'transform 0.3s ease',
                  width: '100%'
                }}
              >
                {reviews.map((review, index) => (
                  <div 
                    key={index}
                    className="mobile-review-slide"
                    style={{
                      minWidth: '100%',
                      maxWidth: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0 10px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      maxWidth: '100%',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <ReviewCard review={review} index={index} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Dots */}
              <div className="review-dots" style={{
                display: isMobile ? 'flex' : 'none',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '20px'
              }}>
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    className={`review-dot ${index === currentReviewIndex ? 'active' : ''}`}
                    onClick={() => goToReview(index)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentReviewIndex ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                      padding: 0
                    }}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Reviews

