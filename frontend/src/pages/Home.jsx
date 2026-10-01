import Faq from '../components/Faq'
import Services from '../components/Services'
import Reviews from '../components/Reviews'
import Contact from '../components/Contact'
import SeoHead from '../components/SeoHead'
import Footer from '../components/Footer'

/**
 * Homepage body below the stable #critical-hero in index.html.
 * Header is portaled by App; Hero must not remount the LCP image.
 */
const Home = () => {
  return (
    <div>
      <SeoHead
        title="M&A Stump Grinding | Stump Removal in Tampa, FL"
        description="M&A Stump Grinding provides fast, licensed stump removal and grinding in Tampa, FL and the surrounding Tampa Bay area. Free quotes. Call or text today."
      />
      <Services />
      <Reviews />
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home
