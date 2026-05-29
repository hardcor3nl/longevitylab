import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'LongevityLab — Science-Backed Longevity Reviews', template: '%s | LongevityLab' },
  description: 'Expert reviews and science-backed guides on supplements, wearables, diagnostics, and protocols for living longer and better.',
  openGraph: { type: 'website', siteName: 'LongevityLab' },
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
