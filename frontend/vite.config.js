import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { buildFaqPageSchema } from './src/data/faqs.js'
import { buildLocalBusinessSchema } from './src/data/localBusinessSchema.js'
import {
  LOCATIONS,
  buildLocationFaqSchema,
} from './src/data/locations.js'

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

/**
 * Emits per-location HTML shells so Googlebot curl/view-source sees unique
 * title, canonical, H1, and FAQ JSON-LD (SPA still hydrates via the same JS).
 */
function locationPagesPlugin() {
  return {
    name: 'location-pages-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) return

      const baseHtml = fs.readFileSync(indexPath, 'utf8')

      for (const loc of LOCATIONS) {
        const faqJson = JSON.stringify(buildLocationFaqSchema(loc.faqs), null, 2)
        const faqScript = `<script type="application/ld+json">\n${faqJson}\n    </script>`
        const crawlBlock = `
    <div id="location-crawl-content">
      <h1>${loc.h1}</h1>
      <p>${loc.intro}</p>
      <p><a href="/">M&amp;A Stump Grinding home</a> · <a href="/portfolio">Portfolio</a></p>
    </div>`

        let html = baseHtml
          .replace(
            /<title>[^<]*<\/title>/,
            `<title>${loc.title}</title>`
          )
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
            `<meta name="description" content="${loc.description.replace(/"/g, '&quot;')}" />`
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="https://mnastumpgrinding.com${loc.path}" />`
          )
          // Remove homepage critical hero entirely (don't leave a competing H1 for crawlers)
          .replace(
            /<!-- Stable LCP hero:[\s\S]*?<section id="critical-hero"[\s\S]*?<\/section>/,
            '<!-- critical-hero omitted on location page -->'
          )
          .replace(
            /<div id="root"><\/div>/,
            `<div id="root">${crawlBlock}\n    </div>`
          )
          .replace(
            /(<\/script>\s*\n)(\s*<link rel="icon")/,
            `$1    ${faqScript}\n$2`
          )

        const outDir = path.join(distDir, loc.slug)
        fs.mkdirSync(outDir, { recursive: true })
        fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), structuredDataJsonLdPlugin(), locationPagesPlugin()],
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
