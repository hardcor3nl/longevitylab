import type { Metadata } from 'next'
import { affiliateLinks } from '@/lib/affiliateLinks'
import { AffiliateRedirect } from '@/components/AffiliateRedirect'

export function generateStaticParams() {
  return Object.keys(affiliateLinks).map(product => ({ product }))
}

export function generateMetadata({ params }: { params: { product: string } }): Metadata {
  return {
    title: 'Redirecting…',
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: `/go/${params.product}` },
  }
}

export default function GoPage({ params }: { params: { product: string } }) {
  const url = affiliateLinks[params.product] ?? '/'
  return <AffiliateRedirect url={url} />
}
