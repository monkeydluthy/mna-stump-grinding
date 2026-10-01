export const GA_MEASUREMENT_ID = 'G-47EDHHMP3S'

let gaScriptScheduled = false

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
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
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

  installGtagStub()
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
