const Reviews = () => {
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

  const ReviewCard = ({ review, index }) => (
    <div 
      key={index}
      style={{
        background: 'var(--white)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '260px',
        maxWidth: '320px',
        width: '260px',
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
    <section style={{ background: 'var(--white)', overflow: 'hidden', width: '100%' }}>
      <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
        <h2 style={{ padding: '0 20px' }}>What Our Customers Say</h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          marginTop: '40px',
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Google Reviews Carousel */}
          <div style={{
            width: '100%',
            maxWidth: '100%',
            background: 'var(--bg-light)',
            borderRadius: '12px',
            padding: '30px 0',
            overflow: 'hidden',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '30px',
              padding: '0 20px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <h3 style={{ marginBottom: '5px' }}>Google Reviews</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>4.9</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: '#FFA500', fontSize: '1.2rem' }}>★</span>
                    ))}
                  </div>
                  <span style={{ color: 'var(--text-light)' }}>(24 reviews)</span>
                </div>
              </div>
              <a 
                href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                Leave a Review
              </a>
            </div>

            {/* Scrolling Container */}
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%'
            }}>
              <div className="reviews-track" style={{
                display: 'flex',
                gap: '15px',
                width: 'fit-content'
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
          </div>
        </div>
      </div>
    </section>
  )
}

export default Reviews

