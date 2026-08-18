import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { isPublicPath, trackContactClick, trackPageView } from '../utils/analytics'

const Analytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (!isPublicPath(location.pathname)) return
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a')
      if (!link) return
      trackContactClick(link.getAttribute('href') || '')
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}

export default Analytics
