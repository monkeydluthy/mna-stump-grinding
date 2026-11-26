// Title / meta description overrides, one entry per page path, written by the DDS SEO pod
// (dds-agents `python -m seopod.titles pr`: one PR, this one JSON file, merged with
// `approve` in Slack). Applied twice so the served HTML and the rendered page agree:
//   - at build, by titleOverridesPlugin in vite.config.js (the static shells Google and
//     link previews read), and
//   - at runtime, by SeoHead (what React sets after hydration).
// {} = nothing overridden. When a wording settles, move it into seo.js / locations.js and
// drop the entry here; this file is the pod's inbox, not the long-term home of the copy.
import overrides from './titles.json'

export function normalizePath(path) {
  if (!path) return '/'
  const p = path.split(/[?#]/)[0]
  return p === '/' ? p : p.replace(/\/+$/, '') || '/'
}

/** {title, description} for this path, or null. */
export function titleOverride(path) {
  const entry = overrides[normalizePath(path)]
  if (!entry || typeof entry.title !== 'string' || typeof entry.description !== 'string') return null
  return entry
}

export const TITLE_OVERRIDES = overrides
