import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SiteJsonLd } from '@/components/SiteJsonLd'

const siteUrl = 'https://thelongevityintel.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Longevity Intel — Science-Backed Longevity Reviews', template: '%s | Longevity Intel' },
  description: 'Expert reviews and science-backed guides on supplements, wearables, diagnostics, and protocols for living longer and better. Independent, physician-reviewed.',
  keywords: ['longevity', 'supplements', 'NMN', 'red light therapy', 'infrared sauna', 'cold plunge', 'HRV', 'biohacking', 'longevity supplements', 'anti-aging', 'healthspan', 'lifespan extension', 'creatine', 'omega-3'],
  authors: [{ name: 'Longevity Intel Editorial Team' }],
  creator: 'Longevity Intel',
  publisher: 'Longevity Intel',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: siteUrl },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'Longevity Intel',
    title: 'Longevity Intel — Science-Backed Longevity Reviews',
    description: 'Expert reviews on supplements, wearables, diagnostics, and protocols for living longer and better.',
    url: siteUrl,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Longevity Intel' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Longevity Intel — Science-Backed Longevity Reviews',
    description: 'Expert reviews on supplements, wearables, and longevity protocols.',
    images: ['/og-default.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteJsonLd />
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
