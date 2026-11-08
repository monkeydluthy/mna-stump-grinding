import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { buildFaqPageSchema } from './src/data/faqs.js'
import { buildLocalBusinessSchema } from './src/data/localBusinessSchema.js'
import {
  localDetailIcon,
  LOCAL_DETAIL_SVG_ATTRS,
} from './src/data/localDetailIcons.js'
import { PORTFOLIO_SEO } from './src/data/seo.js'
import {
  LOCATIONS,
  buildLocationFaqSchema,
} from './src/data/locations.js'

const SITE_URL = 'https://mnastumpgrinding.com'

const escAttr = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const escHtml = (v) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Point the shell's og: tags at this page (index.html carries the homepage set) */
function withShareTags(html, { title, description, path: pagePath }) {
  const setProp = (h, key, value) =>
    h.replace(
      new RegExp(`(<meta\\s+property="${key}"\\s+content=")[^"]*(")`),
      `$1${escAttr(value)}$2`
    )
  let next = setProp(html, 'og:title', title)
  next = setProp(next, 'og:description', description)
  return setProp(next, 'og:url', `${SITE_URL}${pagePath}`)
}

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
        const faqScript = `<script id="location-faq-jsonld" type="application/ld+json">\n${faqJson}\n    </script>`
        const sectionsHtml = loc.sections?.length
          ? `\n      <section class="local-detail"><div class="local-detail__inner"><div class="local-detail__grid">` +
            loc.sections
              .map(
                (sec, i) =>
                  `<div class="local-detail__card"><svg ${LOCAL_DETAIL_SVG_ATTRS}>${localDetailIcon(i)}</svg><h2>${escHtml(sec.heading)}</h2><p>${escHtml(sec.body)}</p></div>`
              )
              .join('') +
            `</div></div></section>`
          : ''
        const crawlBlock = `
    <div id="location-crawl-content">
      <h1>${loc.h1}</h1>
      <p>${loc.intro}</p>${sectionsHtml}
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
          // Drop the homepage FAQPage so the shell only carries this page's FAQs
          .replace(
            /<script type="application\/ld\+json">\s*\{(?:(?!<\/script>)[\s\S])*?"@type"\s*:\s*"FAQPage"[\s\S]*?<\/script>\s*/,
            ''
          )
          .replace(
            /<div id="root"><\/div>/,
            `<div id="root">${crawlBlock}\n    </div>`
          )
          .replace(
            /(<\/script>\s*\n)(\s*<link rel="icon")/,
            `$1    ${faqScript}\n$2`
          )

        html = withShareTags(html, loc)
        // <slug>.html (not <slug>/index.html) so Netlify serves /<slug> without a 301 to /<slug>/
        fs.writeFileSync(path.join(distDir, `${loc.slug}.html`), html, 'utf8')
      }
    },
  }
}

/**
 * /portfolio would otherwise be served the homepage shell, whose static
 * #critical-hero H1 (hidden client-side only) makes two H1s for crawlers.
 * Emit a portfolio shell without the hero; React renders the page's own H1.
 */
function portfolioPagePlugin() {
  return {
    name: 'portfolio-page-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexPath = path.join(distDir, 'index.html')
      if (!fs.existsSync(indexPath)) return

      let html = fs
        .readFileSync(indexPath, 'utf8')
        .replace(/<title>[^<]*<\/title>/, `<title>${PORTFOLIO_SEO.title}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
          `<meta name="description" content="${escAttr(PORTFOLIO_SEO.description)}" />`
        )
        .replace(
          /<link rel="canonical" href="[^"]*"\s*\/>/,
          `<link rel="canonical" href="${SITE_URL}${PORTFOLIO_SEO.path}" />`
        )
        .replace(
          /<!-- Stable LCP hero:[\s\S]*?<section id="critical-hero"[\s\S]*?<\/section>/,
          '<!-- critical-hero omitted on portfolio page -->'
        )
        // Homepage FAQPage isn't visible on /portfolio
        .replace(
          /<script type="application\/ld\+json">\s*\{(?:(?!<\/script>)[\s\S])*?"@type"\s*:\s*"FAQPage"[\s\S]*?<\/script>\s*/,
          ''
        )

      html = withShareTags(html, PORTFOLIO_SEO)
      fs.writeFileSync(path.join(distDir, 'portfolio.html'), html, 'utf8')
    },
  }
}

export default defineConfig({
  plugins: [react(), structuredDataJsonLdPlugin(), locationPagesPlugin(), portfolioPagePlugin()],
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
