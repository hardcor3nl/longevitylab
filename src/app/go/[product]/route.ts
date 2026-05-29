import { NextRequest, NextResponse } from 'next/server'

const affiliateLinks: Record<string, string> = {
  'prohealth-nmn': 'https://www.amazon.com/dp/B07TNTQ7VV?tag=longevitylab-20',
  'tru-niagen': 'https://www.amazon.com/dp/B07DW75BX3?tag=longevitylab-20',
  'double-wood-nmn': 'https://www.amazon.com/dp/B09BKNHNN8?tag=longevitylab-20',
  'dexcom-stelo': 'https://www.stelo.com/?ref=longevitylab',
  'libre3': 'https://www.amazon.com/dp/B0C1VHRJMP?tag=longevitylab-20',
  'carlson-omega3': 'https://www.amazon.com/dp/B000NV8NKC?tag=longevitylab-20',
  'nordic-naturals': 'https://www.amazon.com/dp/B002CQU564?tag=longevitylab-20',
}

export function GET(request: NextRequest, { params }: { params: { product: string } }) {
  const url = affiliateLinks[params.product]
  if (!url) return NextResponse.redirect(new URL('/', request.url))
  return NextResponse.redirect(url)
}
