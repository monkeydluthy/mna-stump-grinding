/**
 * Location landing pages — single source for routes, copy, photos, FAQs.
 * Footer city links resolve via locationPathForCity().
 *
 * Photos: no portfolio rows are tagged city=Thonotosassa yet, so these are
 * real Cloudinary portfolio stills chosen manually (residential jobs).
 */

import { FAQS } from './faqs'

const faqByQuestion = (q) => {
  const faq = FAQS.find((f) => f.question === q)
  if (!faq) throw new Error(`FAQ not found in faqs.js: ${q}`)
  return faq
}

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
      'Licensed stump grinding and stump removal in Thonotosassa, FL. Free estimates and cleanup included. Call, text, or request a quote today.',
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
    /** Local detail from Nick; rendered as H2 + paragraph between photos and FAQ */
    sections: [
      {
        heading: 'Front yard or back yard',
        body: 'Most jobs are front-yard stumps, with some in backyards. Either way, we bring the equipment to get to the stump.',
      },
      {
        heading: 'What happens to the wood chips',
        body: "When the stump is ground, we spread the chips out neatly and fill the hole with what's left. If you'd rather not keep them, we can pick the chips up completely. We offer both.",
      },
      {
        heading: 'Before we arrive',
        body: 'Let us know about anything near the stump: rocks, concrete, or concrete or plastic borders. It helps us plan the job.',
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
      { name: 'Tampa', path: '/stump-grinding-tampa-fl' },
      { name: 'Brandon', path: '/' },
      { name: 'Lutz', path: '/' },
      { name: 'Riverview', path: '/' },
    ],
  },
  {
    slug: 'stump-grinding-tampa-fl',
    city: 'Tampa',
    county: 'Hillsborough',
    state: 'FL',
    path: '/stump-grinding-tampa-fl',
    title: 'Stump Grinding in Tampa, FL | M&A Stump Grinding',
    h1: 'Stump Grinding in Tampa, FL',
    description:
      'Stump grinding and stump removal in Tampa, FL. Licensed and insured, free estimates, and cleanup included. Call, text, or request an estimate online.',
    intro:
      'M&A Stump Grinding grinds stumps for Tampa homeowners and businesses. We take the stump below ground level, clean up the site, and leave your yard ready for sod, landscaping, or the next project.',
    /** Real Tampa jobs: portfolio_items rows tagged city = 'Tampa'; alt text is the stored alt_text */
    photos: [
      {
        src: 'https://res.cloudinary.com/dsxjzbf2c/image/upload/v1788972802/mna-stump-portfolio/portfolio-1788972802471-nt9yvk7xm.jpg',
        alt: 'Stubborn stump removed and ground level, clearing the way for driveway and yard work to continue.',
        width: 2048,
        height: 1365,
      },
      {
        src: 'https://res.cloudinary.com/dsxjzbf2c/image/upload/v1788972818/mna-stump-portfolio/portfolio-1788972818729-t3inq9dpd.jpg',
        alt: 'Dense, overgrown stump cleared and ground flush — reclaiming usable yard space from years of overgrowth.',
        width: 2048,
        height: 1365,
      },
      {
        src: 'https://res.cloudinary.com/dsxjzbf2c/image/upload/v1789573553/mna-stump-portfolio/portfolio-1789573553799-xvyz90y14.jpg',
        alt: 'Stump and embedded stone base fully ground out and cleared, restoring usable space along the property line.',
        width: 2048,
        height: 1536,
      },
    ],
    /** Local detail from Nick; rendered as H2 + paragraph between photos and FAQ */
    sections: [
      {
        heading: 'Stump grinding across Tampa',
        body: 'We grind stumps throughout Tampa, including Carrollwood, Temple Terrace and Odessa. Most of the stumps we see in the area are oak, with some palm trees and the occasional pine.',
      },
      {
        heading: 'Front yard or back yard',
        body: 'Most jobs are front-yard stumps, with some in backyards. Either way, we bring the equipment to get to the stump.',
      },
      {
        heading: 'What happens to the wood chips',
        body: "When the stump is ground, we spread the chips out neatly and fill the hole with what's left. If you'd rather not keep them, we can pick the chips up completely. We offer both.",
      },
      {
        heading: 'Before we arrive',
        body: 'Let us know about anything near the stump: rocks, concrete, or concrete or plastic borders. It helps us plan the job.',
      },
    ],
    /** Drawn from the shared homepage FAQ data so wording never drifts */
    faqs: [
      faqByQuestion('How do I get rid of a tree stump?'),
      faqByQuestion('How much does stump grinding cost in Tampa?'),
      faqByQuestion('How fast can you come out?'),
    ],
    relatedCities: [
      { name: 'Thonotosassa', path: '/stump-grinding-thonotosassa-fl' },
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
