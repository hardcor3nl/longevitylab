import { affiliateLinks } from '@/lib/affiliateLinks'
import { AffiliateRedirect } from '@/components/AffiliateRedirect'

export function generateStaticParams() {
  return Object.keys(affiliateLinks).map(product => ({ product }))
}

export default function GoPage({ params }: { params: { product: string } }) {
  const url = affiliateLinks[params.product] ?? '/'
  return <AffiliateRedirect url={url} />
}
