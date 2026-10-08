/**
 * Location landing pages — single source for routes, copy, photos, FAQs.
 * Footer city links resolve via locationPathForCity().
 *
 * Photos: no portfolio rows are tagged city=Thonotosassa yet, so these are
 * real Cloudinary portfolio stills chosen manually (residential jobs).
 */

export const LOCATIONS = [
  {
    slug: 'stump-grinding-thonotosassa-fl',
    city: 'Thonotosassa',
    county: 'Hillsborough',
    state: 'FL',
    path: '/stump-grinding-thonotosassa-fl',
    title: 'Stump Grinding in Thonotosassa, FL | M&A Stump Grinding',
    h1: 'Stump Grinding in Thonotosassa, FL',
    description:
      'Licensed stump grinding and stump removal in Thonotosassa, FL. Fast scheduling, free quotes, and cleanup included. Call or request a quote today.',
    intro:
      'M&A Stump Grinding is based in Thonotosassa and serves homeowners and businesses across Hillsborough County. We grind stumps flush or below grade, clean up the site, and get your yard ready for sod, landscaping, or the next project.',
    photos: [
      {
        src: 'https://res.cloudinary.com/dsxjzbf2c/image/upload/v1789573569/mna-stump-portfolio/portfolio-1789573569453-dahohgcov.jpg',
        alt: 'Multi-trunk stump ground flush near a home foundation in Thonotosassa, FL',
        width: 1600,
        height: 1200,
      },
      {
        src: 'https://res.cloudinary.com/dsxjzbf2c/image/upload/v1789573538/mna-stump-portfolio/portfolio-1789573537864-w0oqxi24i.jpg',
        alt: 'Large stump removed and ground below grade with the yard leveled in Thonotosassa, FL',
        width: 1600,
        height: 1200,
      },
      {
        src: 'https://res.cloudinary.com/dsxjzbf2c/image/upload/v1788972811/mna-stump-portfolio/portfolio-1788972811125-thpr5ewef.jpg',
        alt: 'Large oak stump ground below grade — front yard ready for new sod in Thonotosassa, FL',
        width: 1600,
        height: 1200,
      },
    ],
    /** Seeded from homepage FAQ set (3.1a), localized for Thonotosassa */
    faqs: [
      {
        question: 'Do you offer stump grinding in Thonotosassa?',
        answer:
          'Yes. M&A Stump Grinding is based in Thonotosassa and regularly works throughout Hillsborough County and the greater Tampa Bay area. Call or text (813) 325-5306 and we’ll confirm we can reach your property.',
      },
      {
        question: 'How much does stump grinding cost in Thonotosassa?',
        answer:
          'Pricing depends on stump size, how many stumps you have, root spread, and access to the job site. Most residential stumps fall in a straightforward range once we see the work in person. We provide free quotes so you know the cost before we start — no surprises.',
      },
      {
        question: 'How deep do you grind stumps?',
        answer:
          'We typically grind 6 to 12 inches below ground level, which is enough for grass, sod, or most landscaping. If you’re planting a tree or need a deeper grind for a specific project, tell us when you request a quote and we’ll plan accordingly.',
      },
      {
        question: 'Are you licensed and insured?',
        answer:
          'Yes. M&A Stump Grinding is fully licensed and insured for stump removal and grinding work in Florida. You get professional service and peace of mind on every job in Thonotosassa and across Tampa Bay.',
      },
    ],
    relatedCities: [
      { name: 'Tampa', path: '/' },
      { name: 'Brandon', path: '/' },
      { name: 'Lutz', path: '/' },
      { name: 'Riverview', path: '/' },
    ],
  },
]

export function getLocationBySlug(slug) {
  return LOCATIONS.find((loc) => loc.slug === slug) || null
}

/** Map display city name → location path when a page exists */
export const LOCATION_PATH_BY_CITY = Object.fromEntries(
  LOCATIONS.map((loc) => [loc.city, loc.path])
)

export function locationPathForCity(city) {
  return LOCATION_PATH_BY_CITY[city] || '/'
}

export function buildLocationFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
