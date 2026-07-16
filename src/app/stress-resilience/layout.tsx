import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/stress-resilience')

export const metadata: Metadata = {
  title: 'Stress Resilience Protocols',
  description:
    'Meditation, breathwork, adaptogens, and lifestyle tools to lower allostatic load and protect long-term health.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Stress Resilience Protocols',
    description: 'Tools and protocols for stress resilience and longevity.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function StressResilienceLayout({ children }: { children: React.ReactNode }) {
  return children
}
