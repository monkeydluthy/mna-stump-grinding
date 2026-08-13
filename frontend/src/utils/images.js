/**
 * Optimize Cloudinary delivery URLs (format/quality/size).
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeImageUrl(url, { width = 800, height } = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url
  }
  // Avoid double-transforming
  if (/\/upload\/[^/]*f_auto/.test(url) || /\/upload\/f_auto/.test(url)) {
    return url
  }

  const transforms = ['f_auto', 'q_auto', `w_${width}`, 'c_limit']
  if (height) transforms.push(`h_${height}`)

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`)
}

const LOCATION = 'Tampa, FL'

/**
 * Descriptive alt text for portfolio media: service + location, not generic labels.
 */
export function portfolioAltText({ kind, description, index, total } = {}) {
  const detail = typeof description === 'string' ? description.trim() : ''
  const withDetail = (base) => (detail ? `${base}: ${detail}` : base)

  switch (kind) {
    case 'before':
      return withDetail(`Before stump grinding in ${LOCATION}`)
    case 'after':
      return withDetail(`After stump grinding in ${LOCATION}`)
    case 'gallery':
      return withDetail(`Stump grinding project gallery in ${LOCATION}`)
    case 'gallery-modal': {
      const n = index && total ? ` photo ${index} of ${total}` : ''
      return withDetail(`Stump grinding${n} in ${LOCATION}`)
    }
    case 'video':
      return withDetail(`Stump grinding video in ${LOCATION}`)
    case 'standalone':
    default:
      return withDetail(`Stump grinding work in ${LOCATION}`)
  }
}
