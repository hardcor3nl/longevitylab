import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'LongevityLab — Science-Backed Longevity Reviews', template: '%s | LongevityLab' },
  description: 'Expert reviews and science-backed guides on supplements, wearables, diagnostics, and protocols for living longer and better. Independent, physician-reviewed.',
  keywords: ['longevity', 'supplements', 'NMN', 'red light therapy', 'infrared sauna', 'cold plunge', 'HRV', 'biohacking', 'longevity supplements', 'anti-aging'],
  authors: [{ name: 'LongevityLab Editorial Team' }],
  creator: 'LongevityLab',
  publisher: 'LongevityLab',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'LongevityLab',
    title: 'LongevityLab — Science-Backed Longevity Reviews',
    description: 'Expert reviews on supplements, wearables, diagnostics, and protocols for living longer and better.',
    url: 'https://longevitylab-five.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LongevityLab — Science-Backed Longevity Reviews',
    description: 'Expert reviews on supplements, wearables, and longevity protocols.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
