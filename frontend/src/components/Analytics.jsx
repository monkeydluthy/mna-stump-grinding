import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ensureGaLoaded, isPublicPath, trackContactClick, trackPageView } from '../utils/analytics'

const Analytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (!isPublicPath(location.pathname)) return
    ensureGaLoaded()
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onClick = (event) => {
      if (!isPublicPath(window.location.pathname)) return
      const link = event.target.closest('a')
      if (!link) return
      trackContactClick(link)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}

export default Analytics
