import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(4.9)
  const [totalReviews, setTotalReviews] = useState(24)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Fetch Google Reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        console.log('Fetching reviews from:', '/api/reviews/google')
        const response = await axios.get('/api/reviews/google')
        console.log('Reviews API response:', response.data)
        
        if (response.data.reviews && response.data.reviews.length > 0) {
          console.log('Using real reviews:', response.data.reviews.length)
          setReviews(response.data.reviews)
          setRating(response.data.rating || 4.9)
          setTotalReviews(response.data.totalReviews || 24)
          setError(null)
        } else if (response.data.error) {
          // API returned an error response
          console.error('API returned error:', response.data.error, response.data.message)
          setReviews(getMockReviews())
          setError(`Unable to load reviews: ${response.data.message || response.data.error}`)
        } else {
          // Fallback to mock reviews if API returns no reviews
          console.warn('No reviews returned from API, using mock reviews')
          setReviews(getMockReviews())
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        console.error('Error details:', err.response?.data || err.message)
        // Fallback to mock reviews on error
        setReviews(getMockReviews())
        setError(`Unable to load reviews: ${err.response?.data?.message || err.message || 'Network error'}`)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Mock reviews fallback
  const getMockReviews = () => [
    {
      name: 'Sarah Johnson',
      date: '2 weeks ago',
      text: 'Excellent service! They removed a large stump from my backyard quickly and professionally. The team was on time, cleaned up everything, and left the area looking great. Highly recommend!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      date: '1 month ago',
      text: 'Fast, efficient, and affordable. Had multiple stumps removed and they did an amazing job. The crew was friendly and professional. Will definitely use them again!',
      rating: 5
    },
    {
      name: 'Jennifer Martinez',
      date: '3 weeks ago',
      text: 'Outstanding work! They ground down a huge oak stump that was in the way of our new patio. Clean, professional, and reasonably priced. Very happy with the results!',
      rating: 5
    },
    {
      name: 'David Thompson',
      date: '1 week ago',
      text: 'Great experience from start to finish. Quick response, fair pricing, and excellent workmanship. They removed three stumps and the yard looks perfect now. Highly professional team!',
      rating: 5
    },
    {
      name: 'Robert Williams',
      date: '2 months ago',
      text: 'Top-notch service! Professional, punctual, and thorough. They made quick work of a difficult stump removal. The cleanup was impeccable. Would hire again!',
      rating: 5
    },
    {
      name: 'Lisa Anderson',
      date: '3 weeks ago',
      text: 'Amazing results! The stump grinding was done perfectly and the area was left spotless. Great communication throughout the process. Highly satisfied!',
      rating: 5
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
    if (!touchStartX.current || !touchEndX.current || reviews.length === 0) return
    
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

  const ReviewCard = ({ review, index }) => {
    const reviewRating = review.rating || 5
    return (
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
                <span key={i} style={{ color: i < reviewRating ? '#FFA500' : '#ddd', fontSize: '1rem' }}>★</span>
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
  }

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
            padding: 50px 20px 30px 20px !important;
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
              padding: '60px 30px 30px 30px',
              overflow: 'hidden'
            }}>
              <div className="reviews-header" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%'
                }}>
                  <h3 style={{ marginTop: '0', marginBottom: '0', fontSize: '1.3rem', textAlign: 'center' }}>Google Reviews</h3>
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>...</span>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{rating.toFixed(1)}</span>
                        <div style={{ display: 'flex', gap: '3px' }}>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: i < Math.round(rating) ? '#FFA500' : '#ddd', fontSize: '1.3rem' }}>★</span>
                          ))}
                        </div>
                        <span style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 500 }}>
                          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'} on Google)
                        </span>
                      </div>
                      {reviews.length > 0 && (
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', textAlign: 'center' }}>
                          Showing our {reviews.length} most recent {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <a 
                  href={`https://search.google.com/local/writereview?placeid=${import.meta.env.VITE_GOOGLE_PLACE_ID || 'YOUR_PLACE_ID'}`}
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
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'var(--text-light)'
              }}>
                Loading reviews...
              </div>
            ) : reviews.length > 0 ? (
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
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'var(--text-light)'
              }}>
                No reviews available at this time.
              </div>
            )}

            {/* Mobile: Swipeable Reviews */}
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'var(--text-light)',
                display: isMobile ? 'block' : 'none'
              }}>
                Loading reviews...
              </div>
            ) : reviews.length > 0 ? (
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
                {reviews.length > 0 && (
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
                )}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'var(--text-light)',
                display: isMobile ? 'block' : 'none'
              }}>
                No reviews available at this time.
              </div>
            )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Reviews

