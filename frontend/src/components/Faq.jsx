import { useState } from 'react'
import { FAQS } from '../data/faqs'
import { BUSINESS } from '../data/business'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <style>{`
        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .faq-intro h2 {
            text-align: left !important;
          }
        }
      `}</style>
      <section style={{ background: 'var(--white)' }}>
        <div className="container">
          <div
            className="faq-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 1fr) minmax(320px, 1.4fr)',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            <div className="faq-intro">
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--secondary-color)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--secondary-color)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                Got questions?
              </p>
              <h2
                style={{
                  textAlign: 'left',
                  marginBottom: '16px',
                  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                  color: 'var(--primary-color)',
                }}
              >
                Frequently Asked Questions
              </h2>
              <p
                style={{
                  color: 'var(--text-light)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                  maxWidth: '420px',
                }}
              >
                Straight answers for Tampa-area homeowners — pricing, timing, how deep we grind,
                and what to expect before we show up.
              </p>
              <a
                href={`tel:${BUSINESS.phoneE164}`}
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Ask us anything →
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index
                const panelId = `faq-panel-${index}`
                const buttonId = `faq-button-${index}`

                return (
                  <div
                    key={faq.question}
                    style={{
                      border: '1px solid #e8ebe8',
                      borderRadius: '12px',
                      background: isOpen ? '#fafbf9' : 'var(--white)',
                      boxShadow: isOpen
                        ? '0 4px 14px rgba(45, 80, 22, 0.08)'
                        : '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'box-shadow 0.2s ease, background 0.2s ease',
                    }}
                  >
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(index)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        padding: '18px 20px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--text-dark)',
                        lineHeight: 1.4,
                      }}
                    >
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        style={{
                          flexShrink: 0,
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isOpen ? 'var(--primary-color)' : '#eef3ea',
                          color: isOpen ? 'var(--white)' : 'var(--primary-color)',
                          fontSize: '1.25rem',
                          fontWeight: 400,
                          transition: 'background 0.2s ease, color 0.2s ease',
                        }}
                      >
                        {isOpen ? '×' : '+'}
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                      style={{
                        padding: isOpen ? '0 20px 20px' : '0 20px',
                        color: 'var(--text-light)',
                        lineHeight: 1.7,
                        fontSize: '0.98rem',
                      }}
                    >
                      {isOpen && <p style={{ margin: 0 }}>{faq.answer}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Faq
