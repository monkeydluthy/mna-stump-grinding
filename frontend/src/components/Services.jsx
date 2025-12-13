const Services = () => {
  const services = [
    {
      icon: '🪓',
      title: 'Stump Grinding',
      description: 'Complete stump removal down to ground level, leaving your yard clean and ready for landscaping.'
    },
    {
      icon: '🌳',
      title: 'Tree Stump Removal',
      description: 'Professional removal of tree stumps of all sizes, from small residential to large commercial projects.'
    },
    {
      icon: '🧹',
      title: 'Cleanup Included',
      description: 'Full cleanup and debris removal included with every job. We leave your property spotless.'
    },
    {
      icon: '⚡',
      title: 'Fast Service',
      description: 'Quick turnaround times to get your project done when you need it, without compromising quality.'
    },
    {
      icon: '💰',
      title: 'Competitive Pricing',
      description: 'Fair, transparent pricing with no hidden fees. Get a free quote today.'
    },
    {
      icon: '🛡️',
      title: 'Licensed & Insured',
      description: 'Fully licensed and insured professionals you can trust with your property.'
    }
  ]

  return (
    <section style={{ background: 'var(--bg-light)', width: '100%', overflow: 'hidden' }}>
      <div className="container" style={{ width: '100%', maxWidth: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '30px',
          width: '100%',
          maxWidth: '100%'
        }}>
          {services.map((service, index) => (
            <div 
              key={index}
              style={{
                background: 'var(--white)',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                textAlign: 'center',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
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
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
                {service.icon}
              </div>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>
                {service.title}
              </h3>
              <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

