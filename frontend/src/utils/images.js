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
