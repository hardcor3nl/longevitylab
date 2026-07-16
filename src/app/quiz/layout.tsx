import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/quiz')

export const metadata: Metadata = {
  title: 'Biological Age Quiz — Free Longevity Assessment',
  description:
    'Answer 10 science-backed questions and get an estimated biological age plus a personalised protocol. Free, no sign-up.',
  alternates: { canonical: url },
  openGraph: {
    title: 'Biological Age Quiz — Free Longevity Assessment',
    description: 'Estimate your biological age in 2 minutes and get a personalised protocol.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children
}
