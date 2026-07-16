import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/cardio')

export const metadata: Metadata = {
  title: 'Zone 2 Cardio & VO₂ Max Protocol',
  description:
    'Interactive Zone 2 heart-rate calculator and longevity cardio protocol — the foundation for VO₂ max and healthspan.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Zone 2 Cardio & VO₂ Max Protocol',
    description: 'Calculate your Zone 2 range and follow an evidence-based cardio protocol.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function CardioLayout({ children }: { children: React.ReactNode }) {
  return children
}
