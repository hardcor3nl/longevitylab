import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/get-started')

export const metadata: Metadata = {
  title: 'Build Your Longevity Plan — Beginner Path',
  description:
    'A guided 5-step longevity path: baseline testing, sleep, Zone 2 cardio, nutrition, and a tiered supplement stack. Personalised for your goal and budget.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Build Your Longevity Plan — Beginner Path',
    description: 'Personalised longevity plan in a few steps — free, no account required.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children
}
