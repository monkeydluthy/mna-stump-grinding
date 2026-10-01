import { Link } from 'react-router-dom'
import SeoHead from '../components/SeoHead'

const NotFound = () => {
  return (
    <div>
      <SeoHead title="Page not found | M&A Stump Grinding" robots="noindex" />
      <main style={{ textAlign: 'center', padding: '120px 20px 80px' }}>
        <h1>Page not found</h1>
        <p>
          <Link to="/" style={{ color: 'var(--primary-color)' }}>
            Back to the homepage
          </Link>
        </p>
      </main>
    </div>
  )
}

export default NotFound
