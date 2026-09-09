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
 * Prefers the item description when present so each photo has unique alt text.
 */
export function portfolioAltText({ kind, description, index, total } = {}) {
  const detail = typeof description === 'string' ? description.trim() : ''

  // Prefer unique job descriptions when available (best for SEO + accessibility)
  if (detail) {
    switch (kind) {
      case 'before':
        return `Before stump grinding in ${LOCATION}: ${detail}`
      case 'after':
        return `After stump grinding in ${LOCATION}: ${detail}`
      case 'gallery-modal': {
        const n = index && total ? ` (photo ${index} of ${total})` : ''
        return `Stump grinding in ${LOCATION}${n}: ${detail}`
      }
      case 'video':
        return `Stump grinding video in ${LOCATION}: ${detail}`
      case 'gallery':
      case 'standalone':
      default:
        return `Stump grinding in ${LOCATION}: ${detail}`
    }
  }

  switch (kind) {
    case 'before':
      return `Before stump grinding in ${LOCATION}`
    case 'after':
      return `After stump grinding in ${LOCATION}`
    case 'gallery':
      return `Stump grinding project gallery in ${LOCATION}`
    case 'gallery-modal': {
      const n = index && total ? ` photo ${index} of ${total}` : ''
      return `Stump grinding${n} in ${LOCATION}`
    }
    case 'video':
      return `Stump grinding video in ${LOCATION}`
    case 'standalone':
    default:
      return `Stump grinding work in ${LOCATION}`
  }
}
