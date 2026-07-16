import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/exotic-methods')

export const metadata: Metadata = {
  title: 'Advanced Longevity Methods',
  description:
    'Peptides, NAD+ IV, rapamycin, and other advanced longevity interventions — evidence, risks, and practical framing.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Advanced Longevity Methods',
    description: 'Evidence and risks for advanced longevity interventions.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function ExoticMethodsLayout({ children }: { children: React.ReactNode }) {
  return children
}
