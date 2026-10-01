import { useEffect } from 'react'
import { BUSINESS } from '../data/business'

/**
 * Sets document title, meta description, optional robots, and a fixed canonical.
 * Canonical always points at the GBP Website URL (non-www, no query params),
 * including on UTM-tagged loads and client-side navigations.
 */
const SeoHead = ({ title, description, robots }) => {
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
    canonical.setAttribute('href', BUSINESS.canonicalUrl)

    return () => {
      document.querySelector('meta[name="robots"]')?.remove()
    }
  }, [title, description, robots])

  return null
}

export default SeoHead
