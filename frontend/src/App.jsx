import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import Home from './pages/Home'
import PortfolioPage from './pages/PortfolioPage'
import Login from './pages/Login'
import Admin from './components/Admin'
import NotFound from './pages/NotFound'
import Analytics from './components/Analytics'
import Header from './components/Header'
import './index.css'

const headerRoot =
  typeof document !== 'undefined' ? document.getElementById('site-header-root') : null

/**
 * Site chrome that sits outside React's #root replacement:
 * - Header portals into #site-header-root (above the stable hero)
 * - #critical-hero stays in index.html forever; only toggled hidden off-home
 */
function SiteChrome({ children }) {
  const location = useLocation()

  useEffect(() => {
    const hero = document.getElementById('critical-hero')
    if (!hero) return
    const onHome = location.pathname === '/'
    hero.hidden = !onHome
  }, [location.pathname])

  return (
    <>
      {headerRoot ? createPortal(<Header />, headerRoot) : <Header />}
      <Analytics />
      {children}
    </>
  )
}

function App() {
  return (
    <Router>
      <SiteChrome>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SiteChrome>
    </Router>
  )
}

export default App
