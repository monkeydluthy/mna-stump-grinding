import { useState, useEffect } from 'react'
import axios from 'axios'

/** Public review write URL — not derived from env (keeps keys server-side only) */
const LEAVE_REVIEW_URL = 'https://g.page/r/CXVIPFRcTuiaEBM/review'

const ReviewCard = ({ review }) => {
  const reviewRating = typeof review.rating === 'number' ? review.rating : 0
  return (
    <article className="review-card">
      <div className="review-card-head">
        <div>
          <div className="review-card-name">{review.name}</div>
          <div
            className="review-card-stars"
            role="img"
            aria-label={`${reviewRating} out of 5 stars`}
          >
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < reviewRating ? '#FFA500' : '#ddd' }}>
                ★
              </span>
            ))}
          </div>
        </div>
        <span className="review-card-date">{review.date || review.relativeTime}</span>
      </div>
      {review.text && <p className="review-card-text">{review.text}</p>}
    </article>
  )
}

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(null)
  const [totalReviews, setTotalReviews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews/google?v=3')
        const data = response.data || {}
        const liveReviews = Array.isArray(data.reviews) ? data.reviews : []
        if (liveReviews.length === 0) {
          console.error(
            '[reviews] Feed returned no reviews; hiding the reviews section.',
            { status: response.status, rating: data.rating, totalReviews: data.totalReviews }
          )
          return
        }
        setReviews(liveReviews)
        setRating(typeof data.rating === 'number' ? data.rating : null)
        setTotalReviews(typeof data.totalReviews === 'number' ? data.totalReviews : null)
      } catch (err) {
        console.error('[reviews] Failed to load reviews; hiding the reviews section.', {
          status: err.response?.status,
          response: err.response?.data,
          message: err.message,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Nothing to show (still loading, errored, or empty feed): render no section at all.
  if (loading || reviews.length === 0) return null

  const showStats = rating != null || totalReviews != null

  return (
    <>
      <style>{`
        .reviews-panel {
          width: 100%;
          background: var(--bg-light);
          border-radius: 12px;
          padding: 50px 0 30px;
          overflow: hidden;
        }
        .reviews-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          margin-bottom: 30px;
          padding: 0 20px;
        }
        .reviews-scroller {
          display: flex;
          flex-wrap: nowrap;
          gap: 20px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-padding: 0 30px;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          padding: 4px 30px 18px;
        }
        .reviews-scroller:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: -2px;
        }
        .review-card {
          flex: 0 0 320px;
          scroll-snap-align: start;
          background: var(--white);
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          box-sizing: border-box;
        }
        .review-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }
        .review-card-name { font-weight: 600; margin-bottom: 8px; font-size: 1.1rem; }
        .review-card-stars { display: flex; gap: 2px; font-size: 1rem; }
        .review-card-date { color: var(--text-light); font-size: 0.85rem; white-space: nowrap; }
        .review-card-text {
          margin: 0;
          color: var(--text-dark);
          line-height: 1.7;
          font-size: 0.95rem;
          white-space: pre-wrap;
        }
        @media (max-width: 768px) {
          .reviews-panel { padding: 40px 0 24px; }
          .reviews-scroller { gap: 12px; padding: 4px 12px 16px; scroll-padding: 0 12px; }
          .review-card { flex-basis: 265px; padding: 18px; }
          .review-card-name { font-size: 1rem; }
          .reviews-header .btn { width: 100%; text-align: center; box-sizing: border-box; }
        }
      `}</style>
      <section style={{ background: 'var(--white)', overflow: 'hidden' }}>
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div style={{ marginTop: '40px' }}>
            <div className="reviews-panel">
              <div className="reviews-header">
                <h3 style={{ margin: 0, fontSize: '1.3rem', textAlign: 'center' }}>
                  Recent Google Reviews
                </h3>
                {showStats && (
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
                          style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}
                        >
                          {rating.toFixed(1)}
                        </span>
                        <div style={{ display: 'flex', gap: '3px' }} aria-hidden="true">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              style={{
                                color: i < Math.round(rating) ? '#FFA500' : '#ddd',
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
                        style={{ fontSize: '1rem', color: 'var(--text-light)', fontWeight: 500 }}
                      >
                        ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'} on Google)
                      </span>
                    )}
                  </div>
                )}
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)' }}>
                  Showing {reviews.length} recent {reviews.length === 1 ? 'review' : 'reviews'}
                  {reviews.length > 1 ? ' — swipe or scroll to see more' : ''}
                </p>
                <a
                  href={LEAVE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ textDecoration: 'none', textAlign: 'center' }}
                >
                  Leave a Review
                </a>
              </div>

              <div
                className="reviews-scroller"
                role="region"
                aria-label="Google reviews"
                tabIndex={0}
              >
                {reviews.map((review, index) => (
                  <ReviewCard key={`review-${index}-${review.name}`} review={review} />
                ))}
              </div>

              <p
                style={{
                  margin: '10px 0 0',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-light)',
                }}
              >
                Reviews from Google
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Reviews
