/**
 * Optimize Cloudinary delivery URLs (format/quality/size).
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeImageUrl(url, { width = 800, quality = 'auto' } = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url
  }

  const match = url.match(
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(.+)$/
  )
  if (!match) return url

  const [, prefix, rest] = match
  const segments = rest.split('/')
  // Drop existing transform segments so we can request a different size
  while (segments.length) {
    const s = segments[0]
    if (/^v\d+$/.test(s)) break
    if (
      s.includes(',') ||
      /^(f_|q_|w_|h_|c_|dpr_|fl_|e_|b_|g_|x_|y_|so_|du_)/.test(s)
    ) {
      segments.shift()
      continue
    }
    break
  }

  const base = `${prefix}${segments.join('/')}`
  const transforms = [`f_auto`, `q_${quality}`, `w_${width}`, 'c_limit']
  return base.replace('/upload/', `/upload/${transforms.join(',')}/`)
}

/** Grid / card thumbnails — small & fast */
export function thumbUrl(url) {
  return optimizeImageUrl(url, { width: 480, quality: 'auto' })
}

/** Lightbox full view — capped sharpness without multi‑MB downloads */
export function lightboxUrl(url) {
  return optimizeImageUrl(url, { width: 1200, quality: 'auto:good' })
}

const LOCATION = 'Tampa, FL'

/**
 * Descriptive alt text for portfolio media: service + location, not generic labels.
 * Prefers the item description when present so each photo has unique alt text.
 */
export function portfolioAltText({ kind, description, index, total } = {}) {
  const detail = typeof description === 'string' ? description.trim() : ''

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
