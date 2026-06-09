const siteUrl = 'https://longevitylab-five.vercel.app'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'LongevityLab',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
      description:
        'Independent, physician-reviewed longevity reviews and guides covering supplements, wearables, diagnostics, and protocols.',
      sameAs: ['https://github.com/hardcor3nl/longevitylab'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'LongevityLab',
      description: 'Science-backed longevity reviews and protocols.',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en-US',
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
