import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/database') },
}

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return children
}
