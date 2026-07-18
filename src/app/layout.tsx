import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SiteJsonLd } from '@/components/SiteJsonLd'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Science-Backed Longevity Reviews`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'longevity',
    'supplements',
    'NMN',
    'red light therapy',
    'infrared sauna',
    'cold plunge',
    'HRV',
    'biohacking',
    'longevity supplements',
    'anti-aging',
    'healthspan',
    'lifespan extension',
    'creatine',
    'omega-3',
  ],
  authors: [{ name: 'Longevity Intel Editorial Team' }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  // Do NOT set a root-level canonical to the homepage — child pages inherit it
  // and would self-canonicalise to / if they omit alternates.canonical.
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Science-Backed Longevity Reviews`,
    description:
      'Expert reviews on supplements, wearables, diagnostics, and protocols for living longer and better.',
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    locale: SITE.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Science-Backed Longevity Reviews`,
    description: 'Expert reviews on supplements, wearables, and longevity protocols.',
    images: [SITE.ogImage],
  },
  // Impact.com site verification (dashboard may show `value=`; HTML standard is `content=`)
  other: {
    'impact-site-verification': '5c36e911-416e-4424-8ebf-3cc92f0fef1d',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Impact.com site verification (token from Impact dashboard) */}
        <meta
          name="impact-site-verification"
          content="5c36e911-416e-4424-8ebf-3cc92f0fef1d"
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-green focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to content
        </a>
        <SiteJsonLd />
        <ThemeProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
