export const GA_MEASUREMENT_ID = 'G-47EDHHMP3S'

let gaScriptScheduled = false

// Internal-traffic flag. GA4's "Internal Traffic" rule matches the traffic_type
// parameter, so flagged devices send traffic_type: 'internal' and the GA4 data
// filter excludes them. A device is flagged by visiting any page with
// ?internal=1 (remove with ?internal=0) or by logging in to /login.
const INTERNAL_FLAG_KEY = 'mna_internal_traffic'
export const INTERNAL_TRAFFIC_TYPE = 'internal'

function readFlag() {
  try {
    return window.localStorage.getItem(INTERNAL_FLAG_KEY) === '1'
  } catch {
    return false
  }
}

function hasAdminToken() {
  try {
    return Boolean(window.localStorage.getItem('authToken'))
  } catch {
    return false
  }
}

export function markInternalTraffic() {
  try {
    window.localStorage.setItem(INTERNAL_FLAG_KEY, '1')
  } catch {
    // storage blocked: the flag still applies through a logged-in token
  }
}

function applyInternalQueryParam() {
  try {
    const value = new URLSearchParams(window.location.search).get('internal')
    if (value === '1') window.localStorage.setItem(INTERNAL_FLAG_KEY, '1')
    else if (value === '0') window.localStorage.removeItem(INTERNAL_FLAG_KEY)
  } catch {
    // ignore: no storage or unparsable query string
  }
}

export function isInternalTraffic() {
  if (typeof window === 'undefined') return false
  return readFlag() || hasAdminToken()
}

export function isPublicPath(pathname) {
  return pathname !== '/admin' && pathname !== '/login' && !pathname.startsWith('/admin/')
}

function installGtagStub() {
  if (typeof window.gtag === 'function') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  const config = { send_page_view: false }
  if (isInternalTraffic()) config.traffic_type = INTERNAL_TRAFFIC_TYPE
  window.gtag('config', GA_MEASUREMENT_ID, config)
}

// Covers a login or ?internal=1 that happens after the config call, in the
// same page load (single-page navigation).
let internalApplied = false
function syncInternalTraffic() {
  if (internalApplied || !isInternalTraffic()) return
  internalApplied = true
  window.gtag('set', { traffic_type: INTERNAL_TRAFFIC_TYPE })
}

function injectGtagScript() {
  if (typeof document === 'undefined') return
  if (document.getElementById('ga-gtag-js')) return

  const script = document.createElement('script')
  script.id = 'ga-gtag-js'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
}

function scheduleGtagScript() {
  if (gaScriptScheduled) return
  gaScriptScheduled = true

  const run = () => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => injectGtagScript(), { timeout: 4000 })
    } else {
      setTimeout(injectGtagScript, 1)
    }
  }

  if (document.readyState === 'complete') {
    run()
  } else {
    window.addEventListener('load', run, { once: true })
  }
}

/**
 * Installs a cheap dataLayer stub immediately (so click_to_call can queue),
 * but defers the real gtag.js download until window load + idle time so it
 * does not compete with LCP on the main thread.
 */
export function ensureGaLoaded() {
  if (typeof window === 'undefined') return
  if (!isPublicPath(window.location.pathname)) return

  applyInternalQueryParam()
  installGtagStub()
  syncInternalTraffic()
  scheduleGtagScript()
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || !isPublicPath(window.location.pathname)) return
  ensureGaLoaded()
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackPageView(path) {
  trackEvent('page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

function linkLocation(link) {
  const explicit = link.getAttribute('data-link-location')
  if (explicit) return explicit
  if (link.closest('header, .mobile-menu-overlay')) return 'header'
  if (link.closest('footer')) return 'footer'
  if (link.closest('.hero-section, #critical-hero')) return 'hero'
  if (link.closest('.faq-intro')) return 'faq'
  return 'page'
}

export function trackContactClick(link) {
  if (!link || typeof window === 'undefined') return
  if (!isPublicPath(window.location.pathname)) return

  const href = link.getAttribute('href') || ''
  const params = {
    link_location: linkLocation(link),
    page_location: window.location.href,
  }

  if (href.startsWith('tel:')) {
    trackEvent('click_to_call', params)
  } else if (href.startsWith('sms:')) {
    trackEvent('click_text', params)
  } else if (href.startsWith('mailto:')) {
    trackEvent('click_email', params)
  }
}
