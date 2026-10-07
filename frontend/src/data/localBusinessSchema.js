import { BUSINESS } from './business'
import { SERVICE_AREA_BY_COUNTY } from './serviceCities'

/** areaServed from canonical county/city config — keep schema + footer in sync */
export function buildAreaServed() {
  const counties = SERVICE_AREA_BY_COUNTY.map((county) => ({
    '@type': 'AdministrativeArea',
    name: `${county.name} County`,
    containedInPlace: { '@type': 'State', name: 'Florida' },
  }))

  const cities = SERVICE_AREA_BY_COUNTY.flatMap((county) =>
    county.cities.map((name) => ({
      '@type': 'City',
      name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: `${county.name} County`,
        containedInPlace: { '@type': 'State', name: 'Florida' },
      },
    }))
  )

  return [
    ...counties,
    ...cities,
    { '@type': 'AdministrativeArea', name: 'Tampa Bay' },
  ]
}

export function buildLocalBusinessSchema() {
  return {
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
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
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
    areaServed: buildAreaServed(),
    sameAs: [BUSINESS.facebookUrl, BUSINESS.instagramUrl],
    description:
      'Professional stump grinding and stump removal serving Tampa, FL and the surrounding Tampa Bay area. Licensed and insured.',
  }
}
