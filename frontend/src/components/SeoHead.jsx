import { useEffect } from 'react'
import { BUSINESS } from '../data/business'

/**
 * Sets document title, meta description, optional robots, and canonical.
 * Default canonical is the GBP homepage URL; pass `canonical` for location pages.
 */
const SeoHead = ({ title, description, robots, canonical: canonicalHref }) => {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }

    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (robots) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', robots)
    } else if (robotsMeta) {
      robotsMeta.remove()
    }

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalHref || BUSINESS.canonicalUrl)

    return () => {
      document.querySelector('meta[name="robots"]')?.remove()
    }
  }, [title, description, robots, canonicalHref])

  return null
}

export default SeoHead
