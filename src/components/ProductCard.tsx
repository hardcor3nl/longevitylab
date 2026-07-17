'use client'
import { motion, useInView } from 'framer-motion'
import { Product } from '@/lib/types'
import { Check, X, ExternalLink, Award } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

/* Amazon Associates policy requires a date/time-stamped "subject to change"
   notice anywhere price/availability is shown. Bump this when product.price
   values in src/lib/products.ts are re-checked. */
const PRICE_LAST_VERIFIED = 'July 2026'

const badgeStyles: Record<string, string> = {
  'Best Pick': 'bg-green/10 text-green-bright border-green/25',
  'Runner-Up': 'bg-amber/10 text-amber border-amber/25',
  'Budget': 'bg-blue-500/10 text-blue-500 border-blue-500/25',
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const scoreColor = product.rating >= 85 ? 'var(--green-bright)' : product.rating >= 70 ? 'var(--amber)' : '#e05a3a'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/25 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            {product.badge && (
              <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border px-2.5 py-1 rounded-full mb-2 ${badgeStyles[product.badge] ?? ''}`}>
                <Award className="w-2.5 h-2.5" />
                {product.badge}
              </span>
            )}
            <h3 className="font-display text-xl text-ink leading-tight">{product.name}</h3>
            <p className="text-muted text-sm mt-0.5">{product.brand} · {product.price}</p>
            <p className="text-muted/70 text-[10px] mt-0.5">
              Price accurate as of {PRICE_LAST_VERIFIED} — see retailer for current price &amp; availability.
            </p>
          </div>
          {/* Circular score */}
          <div className="relative shrink-0 w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border)" strokeWidth="4" />
              <motion.circle
                cx="28" cy="28" r="24"
                fill="none"
                stroke={scoreColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 24}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                animate={inView ? { strokeDashoffset: 2 * Math.PI * 24 * (1 - product.rating / 100) } : {}}
                transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs font-medium text-ink">{product.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="px-5 pb-4">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor }}
            initial={{ width: 0 }}
            animate={inView ? { width: `${product.rating}%` } : {}}
            transition={{ duration: 1, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Pros / Cons */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-green-bright mb-2">Pros</p>
          <ul className="space-y-1.5">
            {product.pros.map(pro => (
              <li key={pro} className="flex items-start gap-1.5 text-sm text-ink">
                <Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-2">Cons</p>
          <ul className="space-y-1.5">
            {product.cons.map(con => (
              <li key={con} className="flex items-start gap-1.5 text-sm text-muted">
                <X className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA — always route via /go/ so disclosures + tracking stay consistent */}
      <div className="px-5 pb-5">
        <Link
          href={product.affiliateUrl}
          rel="nofollow sponsored noopener"
          className="group flex items-center justify-center gap-2 w-full py-3 bg-green text-white rounded-xl font-medium text-sm hover:bg-green-bright transition-colors cursor-pointer"
        >
          View Best Price
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <p className="text-[10px] text-muted text-center mt-2 font-mono">
          Affiliate link · we may earn a commission
        </p>
      </div>
    </motion.div>
  )
}
