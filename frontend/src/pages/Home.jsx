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
        title="Stump Grinding in Tampa & Hillsborough County | M&A"
        description="Local stump grinding in Tampa, Thonotosassa and Hillsborough County. 5-star rated on Google, free estimates, cleanup included. Call or text M&A today."
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
