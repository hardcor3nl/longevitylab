/**
 * Single source of truth for site identity and absolute URLs.
 * Import from here — never hardcode thelongevityintel.com elsewhere.
 */
export const SITE = {
  name: 'Longevity Intel',
  shortName: 'Longevity Intel',
  url: 'https://thelongevityintel.com',
  description:
    'Expert reviews and science-backed guides on supplements, wearables, diagnostics, and protocols for living longer and better. Independent, physician-reviewed.',
  shortDescription: 'Science-backed longevity reviews and protocols.',
  locale: 'en_US',
  language: 'en-US',
  twitterHandle: '', // set when social accounts exist
  github: 'https://github.com/hardcor3nl/longevitylab',
  ogImage: '/og-default.png',
  logo: '/logo.png',
  amazonTag: 'michaelregeer-20',
} as const

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE.url
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageTitle(title: string): string {
  return `${title} | ${SITE.name}`
}
