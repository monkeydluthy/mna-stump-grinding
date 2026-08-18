export const GA_MEASUREMENT_ID = 'G-47EDHHMP3S'

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

export function trackPageView(path) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function isPublicPath(pathname) {
  return pathname !== '/admin' && pathname !== '/login' && !pathname.startsWith('/admin/')
}

export function trackContactClick(href) {
  if (!href) return
  if (href.startsWith('tel:')) {
    trackEvent('click_call', {
      event_category: 'contact',
      event_label: href,
    })
  } else if (href.startsWith('sms:')) {
    trackEvent('click_text', {
      event_category: 'contact',
      event_label: href,
    })
  } else if (href.startsWith('mailto:')) {
    trackEvent('click_email', {
      event_category: 'contact',
      event_label: href,
    })
  }
}
