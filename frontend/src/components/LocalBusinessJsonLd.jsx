import { useEffect } from 'react'
import { buildLocalBusinessSchema } from '../data/localBusinessSchema'

export const localBusinessSchema = buildLocalBusinessSchema()

const SCRIPT_ID = 'local-business-jsonld'

/**
 * Injects LocalBusiness JSON-LD into <head> once (name, phone, address, hours, service area).
 * Static HTML also gets the same schema via vite transformIndexHtml.
 */
const LocalBusinessJsonLd = () => {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'application/ld+json'
    script.text = JSON.stringify(localBusinessSchema)
    document.head.appendChild(script)

    return () => {
      const existing = document.getElementById(SCRIPT_ID)
      if (existing) existing.remove()
    }
  }, [])

  return null
}

export default LocalBusinessJsonLd
