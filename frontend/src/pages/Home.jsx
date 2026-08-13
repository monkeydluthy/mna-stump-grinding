import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Reviews from '../components/Reviews'
import Contact from '../components/Contact'
import SeoHead from '../components/SeoHead'

const Home = () => {
  return (
    <div>
      <SeoHead
        title="M&A Stump Grinding | Stump Removal in Tampa, FL"
        description="M&A Stump Grinding provides fast, licensed stump removal and grinding in Tampa, FL and the surrounding Tampa Bay area. Free quotes. Call or text today."
      />
      <Header />
      <Hero />
      <Services />
      <Reviews />
      <Contact />
      <footer style={{
        background: 'var(--text-dark)',
        color: 'var(--white)',
        padding: '40px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} M&A Stump Grinding. All rights reserved.</p>
          <p style={{ marginTop: '10px', opacity: 0.8 }}>
            Licensed & Insured | Professional Stump Removal Services in Tampa, FL
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
