import { SITE, absoluteUrl } from '@/lib/site'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(SITE.logo),
        width: 512,
        height: 512,
      },
      description: SITE.description,
      sameAs: [SITE.github].filter(Boolean),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.shortDescription,
      publisher: { '@id': `${SITE.url}/#organization` },
      inLanguage: SITE.language,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE.url}/best?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
