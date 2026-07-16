import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/sleep')

export const metadata: Metadata = {
  title: 'Sleep Optimization for Longevity',
  description:
    'Science-backed sleep protocols, tools, and stacks — the highest-leverage intervention in longevity medicine.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Sleep Optimization for Longevity',
    description: 'Protocols and tools for better sleep and recovery.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function SleepLayout({ children }: { children: React.ReactNode }) {
  return children
}
