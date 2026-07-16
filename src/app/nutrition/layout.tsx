import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/nutrition')

export const metadata: Metadata = {
  title: 'Longevity Nutrition Framework',
  description:
    'Evidence-first nutrition for healthspan: protein timing, fasting, micronutrients, and frameworks without diet ideology.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Longevity Nutrition Framework',
    description: 'Evidence-first eating for longevity — no diet ideology.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function NutritionLayout({ children }: { children: React.ReactNode }) {
  return children
}
