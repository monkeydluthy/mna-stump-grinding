import { useEffect } from 'react'

/**
 * Sets document title, meta description, and optional robots directive.
 * Removes a robots tag it did not request so private-route noindex does not
 * stick after a client-side navigation to a public page.
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

    return () => {
      document.querySelector('meta[name="robots"]')?.remove()
    }
  }, [title, description, robots])

  return null
}

export default SeoHead
