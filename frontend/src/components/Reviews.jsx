import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

/** Public review write URL — not derived from env (keeps keys server-side only) */
const LEAVE_REVIEW_URL = 'https://g.page/r/CXVIPFRcTuiaEBM/review'

const Reviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(null)
  const [totalReviews, setTotalReviews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasLiveData, setHasLiveData] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/reviews/google?v=3')
        const data = response.data || {}
        const liveReviews = Array.isArray(data.reviews) ? data.reviews : []
        const liveRating = typeof data.rating === 'number' ? data.rating : null
        const liveTotal =
          typeof data.totalReviews === 'number' ? data.totalReviews : null

        if (liveReviews.length > 0 || liveRating != null || liveTotal != null) {
          setReviews(liveReviews)
          setRating(liveRating)
          setTotalReviews(liveTotal)
          setHasLiveData(true)
        } else {
          setReviews([])
          setRating(null)
          setTotalReviews(null)
          setHasLiveData(false)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setReviews([])
        setRating(null)
        setTotalReviews(null)
        setHasLiveData(false)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
    } else if (distance < -minSwipeDistance) {
      setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  const goToReview = (index) => {
    setCurrentReviewIndex(index)
  }

  const showStats = hasLiveData && (rating != null || totalReviews != null)
  const showCards = hasLiveData && reviews.length > 0

  const ReviewCard = ({ review, index }) => {
    const reviewRating = typeof review.rating === 'number' ? review.rating : 0
    return (
      <div
        key={index}
        className="review-card"
        style={{
          background: 'var(--white)',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          minWidth: isMobile ? '100%' : '320px',
          maxWidth: isMobile ? '100%' : '320px',
          width: isMobile ? '100%' : '320px',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '12px',
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '1.1rem',
              }}
            >
              {review.name}
            </div>
            <div
              style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}
              aria-label={`${reviewRating} out of 5 stars`}
            >
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: i < reviewRating ? '#FFA500' : '#ddd',
                    fontSize: '1rem',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
            {review.date || review.relativeTime}
          </span>
        </div>
        <p
          style={{
            color: 'var(--text-dark)',
            lineHeight: '1.7',
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap',
          }}
        >
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '30px',
              marginTop: '40px',
            }}
          >
            <div
              className="reviews-container"
              style={{
                width: '100%',
                background: 'var(--bg-light)',
                borderRadius: '12px',
                padding: '60px 30px 30px 30px',
                overflow: 'hidden',
              }}
            >
              <div
                className="reviews-header"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: showCards || loading ? '30px' : '0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                  }}
                >
                  <h3
                    style={{
                      marginTop: '0',
                      marginBottom: '0',
                      fontSize: '1.3rem',
                      textAlign: 'center',
                    }}
                  >
                    Recent Google Reviews
                  </h3>
                  {loading ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '1.8rem',
                          fontWeight: 700,
                          color: 'var(--text-dark)',
                        }}
                      >
                        ...
                      </span>
                    </div>
                  ) : (
                    showStats && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          {rating != null && (
                            <>
                              <span
                                style={{
                                  fontSize: '1.8rem',
                                  fontWeight: 700,
                                  color: 'var(--text-dark)',
                                }}
                              >
                                {rating.toFixed(1)}
                              </span>
                              <div
                                style={{ display: 'flex', gap: '3px' }}
                                aria-hidden="true"
                              >
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      color:
                                        i < Math.round(rating)
                                          ? '#FFA500'
                                          : '#ddd',
                                      fontSize: '1.3rem',
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                          {totalReviews != null && (
                            <span
                              style={{
                                fontSize: '1rem',
                                color: 'var(--text-light)',
                                fontWeight: 500,
                              }}
                            >
                              ({totalReviews}{' '}
                              {totalReviews === 1 ? 'review' : 'reviews'} on
                              Google)
                            </span>
                          )}
                        </div>
                        {showCards && (
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.9rem',
                              color: 'var(--text-light)',
                              textAlign: 'center',
                            }}
                          >
                            Showing {reviews.length} recent{' '}
                            {reviews.length === 1 ? 'review' : 'reviews'}
                          </p>
                        )}
                      </>
                    )
                  )}
                </div>
                <a
                  href={LEAVE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{
                    textDecoration: 'none',
                    width: isMobile ? '100%' : 'auto',
                    textAlign: 'center',
                  }}
                >
                  Leave a Review
                </a>
              </div>

              {loading && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: 'var(--text-light)',
                  }}
                >
                  Loading reviews...
                </div>
              )}

              {!loading && showCards && (
                <>
                  {/* Desktop: one card per review — no duplicated set */}
                  <div
                    className="desktop-reviews"
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      width: '100%',
                      display: isMobile ? 'none' : 'block',
                    }}
                  >
                    <div
                      className="reviews-track"
                      style={{
                        display: 'flex',
                        gap: '20px',
                        width: 'fit-content',
                        maxWidth: '100%',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '0 30px',
                        margin: '0 auto',
                      }}
                    >
                      {reviews.map((review, index) => (
                        <ReviewCard
                          key={`review-${index}-${review.name}`}
                          review={review}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mobile: swipe one review at a time */}
                  <div
                    className="mobile-reviews-wrapper"
                    style={{
                      display: isMobile ? 'block' : 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '100%',
                      minHeight: '200px',
                      padding: '0 20px',
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
                        width: '100%',
                      }}
                    >
                      {reviews.map((review, index) => (
                        <div
                          key={`mobile-${index}-${review.name}`}
                          className="mobile-review-slide"
                          style={{
                            minWidth: '100%',
                            maxWidth: '100%',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '0 10px',
                            boxSizing: 'border-box',
                          }}
                          aria-hidden={index !== currentReviewIndex}
                        >
                          <div
                            style={{
                              width: '100%',
                              maxWidth: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            <ReviewCard review={review} index={index} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {reviews.length > 1 && (
                      <div
                        className="review-dots"
                        style={{
                          display: isMobile ? 'flex' : 'none',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '20px',
                        }}
                      >
                        {reviews.map((_, index) => (
                          <button
                            key={index}
                            className={`review-dot ${
                              index === currentReviewIndex ? 'active' : ''
                            }`}
                            onClick={() => goToReview(index)}
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              border: 'none',
                              background:
                                index === currentReviewIndex
                                  ? 'var(--primary-color)'
                                  : 'rgba(0, 0, 0, 0.2)',
                              cursor: 'pointer',
                              transition: 'background 0.3s',
                              padding: 0,
                            }}
                            aria-label={`Go to review ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {!loading && (
                <p
                  style={{
                    margin: showCards ? '24px 0 0' : '16px 0 0',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-light)',
                  }}
                >
                  Reviews from Google
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Reviews
