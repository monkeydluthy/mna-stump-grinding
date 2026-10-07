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

/**
 * Descriptive alt text for portfolio media.
 * Prefers stored altText, then description, then city-aware fallbacks.
 */
export function portfolioAltText({
  kind,
  description,
  altText,
  city,
  index,
  total,
} = {}) {
  const stored = typeof altText === 'string' ? altText.trim() : ''
  if (stored) {
    if (kind === 'before') return `Before: ${stored}`
    if (kind === 'after') return `After: ${stored}`
    if (kind === 'gallery-modal' && index && total) {
      return `${stored} (photo ${index} of ${total})`
    }
    return stored
  }

  const location =
    typeof city === 'string' && city.trim()
      ? `${city.trim()}, FL`
      : 'Tampa, FL'
  const detail = typeof description === 'string' ? description.trim() : ''

  if (detail) {
    switch (kind) {
      case 'before':
        return `Before stump grinding in ${location}: ${detail}`
      case 'after':
        return `After stump grinding in ${location}: ${detail}`
      case 'gallery-modal': {
        const n = index && total ? ` (photo ${index} of ${total})` : ''
        return `Stump grinding in ${location}${n}: ${detail}`
      }
      case 'video':
        return `Stump grinding video in ${location}: ${detail}`
      case 'gallery':
      case 'standalone':
      default:
        return `Stump grinding in ${location}: ${detail}`
    }
  }

  switch (kind) {
    case 'before':
      return `Before stump grinding in ${location}`
    case 'after':
      return `After stump grinding in ${location}`
    case 'gallery':
      return `Stump grinding project gallery in ${location}`
    case 'gallery-modal': {
      const n = index && total ? ` photo ${index} of ${total}` : ''
      return `Stump grinding${n} in ${location}`
    }
    case 'video':
      return `Stump grinding video in ${location}`
    case 'standalone':
    default:
      return `Stump grinding work in ${location}`
  }
}
