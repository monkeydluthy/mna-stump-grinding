export const GA_MEASUREMENT_ID = 'G-47EDHHMP3S'

export function isPublicPath(pathname) {
  return pathname !== '/admin' && pathname !== '/login' && !pathname.startsWith('/admin/')
}

export function ensureGaLoaded() {
  if (typeof window === 'undefined') return
  if (!isPublicPath(window.location.pathname)) return
  if (typeof window.gtag === 'function') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
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
  if (link.closest('.hero-section')) return 'hero'
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
