import type { Metadata } from 'next'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/contact')

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${SITE.name} for partnerships, product review submissions, editorial enquiries, and press.`,
  alternates: { canonical: url },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
