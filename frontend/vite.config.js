import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildFaqPageSchema } from './src/data/faqs.js'
import { buildLocalBusinessSchema } from './src/data/localBusinessSchema.js'

/**
 * Injects LocalBusiness + FAQPage JSON-LD into static HTML so crawlers see
 * schema in view-source (areaServed stays in sync with SERVICE_AREA_BY_COUNTY).
 */
function structuredDataJsonLdPlugin() {
  return {
    name: 'structured-data-jsonld',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const localBusinessJson = JSON.stringify(
          buildLocalBusinessSchema(),
          null,
          2
        )
        const localBusinessScript = `    <script id="local-business-jsonld" type="application/ld+json">\n${localBusinessJson}\n    </script>`

        // Replace the hand-maintained LocalBusiness block in index.html
        let next = html.replace(
          /<script type="application\/ld\+json">\s*\{[\s\S]*?"@type"\s*:\s*"LocalBusiness"[\s\S]*?\}\s*<\/script>/,
          localBusinessScript
        )

        const faqJson = JSON.stringify(buildFaqPageSchema(), null, 2)
        const faqScript = `    <script type="application/ld+json">\n${faqJson}\n    </script>`
        next = next.replace(
          /(<\/script>\s*\n)(\s*<link rel="icon")/,
          `$1${faqScript}\n$2`
        )

        return next
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), structuredDataJsonLdPlugin()],
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
