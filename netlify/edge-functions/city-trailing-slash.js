// 301 /stump-grinding-<city>-fl/  ->  /stump-grinding-<city>-fl  (city pages only).
// Runs before redirect-rule matching, so Googlebot's prerendered 200 on the slash URL
// can't occur. The Location never ends in "/", so the no-slash URL always falls through.
const CITY_SLASH = /^\/stump-grinding-[a-z0-9-]+-fl\/$/

export default async (request, context) => {
  const url = new URL(request.url)
  if (!CITY_SLASH.test(url.pathname)) return context.next()

  url.pathname = url.pathname.slice(0, -1)
  return new Response(null, {
    status: 301,
    headers: {
      Location: url.toString(), // preserves the query string
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export const config = { path: '/stump-grinding-*' }
