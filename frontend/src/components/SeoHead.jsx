import { useEffect } from 'react'

/**
 * Sets document title and meta description for the current route.
 * Keeps SPA pages aligned with the static tags in index.html.
 */
const SeoHead = ({ title, description }) => {
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
  }, [title, description])

  return null
}

export default SeoHead
