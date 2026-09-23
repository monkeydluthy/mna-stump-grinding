import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildFaqPageSchema } from './src/data/faqs.js'

/**
 * Injects FAQPage JSON-LD into the static HTML response so crawlers see it
 * in view-source without waiting for client-side React.
 */
function faqPageJsonLdPlugin() {
  return {
    name: 'faq-page-jsonld',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const schemaJson = JSON.stringify(buildFaqPageSchema(), null, 2)
        const script = `    <script type="application/ld+json">\n${schemaJson}\n    </script>`
        // Place immediately after the LocalBusiness JSON-LD block
        return html.replace(
          /(<\/script>\s*\n)(\s*<link rel="icon")/,
          `$1${script}\n$2`
        )
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), faqPageJsonLdPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        credentials: true
      }
    }
  }
})
