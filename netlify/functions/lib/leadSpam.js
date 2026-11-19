/**
 * Lead-form spam rules. Pure functions, no I/O, so they can be tested directly.
 *
 * Edit SPAM_PHRASES to add or remove phrases. Matching is case-insensitive and
 * whole-word ("seo" matches "SEO services" but not "Seoul").
 */
const SPAM_PHRASES = [
  'seo',
  'web design',
  'website design',
  'marketing',
  'lead generation',
  'backlink',
  'rank higher',
  'guest post',
  'social media management',
  'business funding',
  'our team can',
  'partnership opportunity',
]

/** Minimum time between the form rendering and the submit, in ms */
const MIN_FILL_MS = 3000

/** Name of the hidden honeypot field the form sends */
const HONEYPOT_FIELD = 'contact_pref'

const URL_PATTERN = /(https?:\/\/|\bwww\.)/i

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const PHRASE_PATTERNS = SPAM_PHRASES.map((phrase) => ({
  phrase,
  re: new RegExp(`\\b${escapeRegex(phrase).replace(/\s+/g, '\\s+')}\\b`, 'i'),
}))

/** Keyword and link rule on free text. Returns a reason string or null. */
function textSpamReason(text) {
  if (!text) return null
  if (URL_PATTERN.test(text)) return 'link'
  const hit = PHRASE_PATTERNS.find(({ re }) => re.test(text))
  return hit ? `phrase:${hit.phrase}` : null
}

/**
 * Classify a raw POST body from the lead form.
 * Returns { spam: boolean, reasons: string[] }.
 */
function classifyLead(body = {}) {
  const reasons = []

  const honeypot = body[HONEYPOT_FIELD]
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    reasons.push('honeypot')
  }

  // elapsedMs is measured client-side (render → submit) so server/client clock
  // skew can't cause false positives. Missing = older cached bundle; not a signal.
  const elapsed = Number(body.elapsedMs)
  if (body.elapsedMs !== undefined && body.elapsedMs !== null && Number.isFinite(elapsed) && elapsed < MIN_FILL_MS) {
    reasons.push('too_fast')
  }

  for (const field of ['message', 'serviceNeeded']) {
    const value = typeof body[field] === 'string' ? body[field] : ''
    const reason = textSpamReason(value)
    if (reason) reasons.push(`${field}:${reason}`)
  }

  return { spam: reasons.length > 0, reasons }
}

module.exports = {
  SPAM_PHRASES,
  MIN_FILL_MS,
  HONEYPOT_FIELD,
  textSpamReason,
  classifyLead,
}
