import { useEffect } from 'react'
import { BUSINESS } from '../data/business'

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BUSINESS.url}/#business`,
  name: BUSINESS.name,
  url: BUSINESS.url,
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  image: `${BUSINESS.url}/logo-clear.png`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.streetAddress,
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.addressCountry,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  areaServed: [
    {
      '@type': 'City',
      name: 'Tampa',
      containedInPlace: { '@type': 'State', name: 'Florida' },
    },
    {
      '@type': 'City',
      name: 'Thonotosassa',
      containedInPlace: { '@type': 'State', name: 'Florida' },
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Tampa Bay',
    },
  ],
  sameAs: [BUSINESS.facebookUrl],
  description:
    'Professional stump grinding and stump removal serving Tampa, FL and the surrounding Tampa Bay area. Licensed and insured.',
}

const SCRIPT_ID = 'local-business-jsonld'

/**
 * Injects LocalBusiness JSON-LD into <head> once (name, phone, address, hours, service area).
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
