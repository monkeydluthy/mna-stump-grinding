/** Homepage FAQs — single source for visible accordion + FAQPage JSON-LD (injected into index.html at build via vite.config.js) */
export const FAQS = [
  {
    question: 'Where do you offer stump grinding in the Tampa area?',
    answer:
      'M&A Stump Grinding serves Tampa, Thonotosassa, and the greater Tampa Bay area — including Brandon, Wesley Chapel, Lutz, Riverview, and surrounding communities. Not sure if we cover your address? Call or text (813) 325-5306 and we’ll let you know right away.',
  },
  {
    question: 'How do I get rid of a tree stump?',
    answer:
      'Grinding is the most common fix. A stump grinder shreds the stump below ground level, so there’s nothing left to trip over, and the leftover wood chips can be used as mulch or backfill. Full stump removal digs out the entire root ball, which is far more disruptive to your yard. Most homeowners choose grinding.',
  },
  {
    question: 'How much does stump grinding cost in Tampa?',
    answer:
      'It depends on the stump’s diameter, how much root flare there is, how easy the machine can reach it, and how many stumps you have. We give free estimates. Call or send a photo and we’ll quote you.',
  },
  {
    question: 'How deep do you grind stumps?',
    answer:
      'We typically grind 6 to 12 inches below ground level, which is enough for grass, sod, or most landscaping. If you’re planting a tree or need a deeper grind for a specific project, tell us when you request a quote and we’ll plan accordingly.',
  },
  {
    question: 'Is there a limit on stump size?',
    answer:
      'No — we handle stumps of all sizes, from small ornamental trees to large oaks and palms. Bigger stumps take more time and may affect pricing, but our equipment is built for heavy-duty residential and commercial work throughout Tampa Bay.',
  },
  {
    question: 'Do you remove the roots and clean up the wood chips?',
    answer:
      'Yes. Stump grinding includes breaking down the stump and major surface roots in the grinding area. We rake the site when we’re done and can leave wood chips for you to use as mulch or haul them away — just let us know your preference when you book.',
  },
  {
    question: 'How fast can you come out?',
    answer:
      'We work until dark. Call or text and we’ll get your estimate scheduled as soon as we can.',
  },
  {
    question: 'Can you grind a stump next to a fence, driveway, or structure?',
    answer:
      'In most cases, yes. Our grinder is compact enough to reach tight spots near fences, sidewalks, and foundations. We’ll walk the site with you first and explain what we can safely grind so your property stays protected.',
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes. M&A Stump Grinding is fully licensed and insured for stump removal and grinding work in Florida. You get professional service and peace of mind on every job.',
  },
]

/** FAQPage JSON-LD built from FAQS so schema text always matches the visible Q&A */
export function buildFaqPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
