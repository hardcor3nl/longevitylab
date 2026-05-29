'use client'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { Check, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function ProductCard({ product }: { product: Product }) {
  const badgeColor: Record<string, string> = {
    'Best Pick': 'bg-green/10 text-green border-green/20',
    'Runner-Up': 'bg-amber/10 text-amber border-amber/20',
    'Budget': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-surface border border-border rounded-2xl p-6 hover:border-green/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          {product.badge && (
            <span className={`font-mono text-xs uppercase tracking-wider border px-2 py-0.5 rounded-full ${badgeColor[product.badge] ?? ''}`}>
              {product.badge}
            </span>
          )}
          <h3 className="font-display text-xl text-ink mt-2">{product.name}</h3>
          <p className="text-muted text-sm">{product.brand} · {product.price}</p>
        </div>
        <div className="text-right">
          <div className="font-display text-3xl text-ink">{product.rating}</div>
          <div className="font-mono text-xs text-muted">/100</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-green mb-2">Pros</p>
          <ul className="space-y-1">
            {product.pros.map(pro => (
              <li key={pro} className="flex items-start gap-1.5 text-sm text-ink">
                <Check className="w-3.5 h-3.5 text-green mt-0.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-amber mb-2">Cons</p>
          <ul className="space-y-1">
            {product.cons.map(con => (
              <li key={con} className="flex items-start gap-1.5 text-sm text-muted">
                <X className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link
        href={product.affiliateUrl}
        className="flex items-center justify-center gap-2 w-full py-3 bg-green text-white rounded-xl font-medium hover:bg-green-bright transition-colors text-sm cursor-pointer"
      >
        View on Amazon <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  )
}
