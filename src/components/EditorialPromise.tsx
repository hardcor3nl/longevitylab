import Link from 'next/link'
import { BadgeCheck, Microscope, Scale, Shield } from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

const promises = [
  {
    icon: Shield,
    title: 'No brand funding of scores',
    body: 'Rankings are not sold. Affiliate commissions never change evidence scores or pick order.',
  },
  {
    icon: Microscope,
    title: 'Claims tied to literature',
    body: 'Mechanistic hype is labelled as hype. Human trials and safety data drive recommendations.',
  },
  {
    icon: Scale,
    title: 'Trade-offs, not miracles',
    body: 'We say who should skip a product, what it costs, and what lifestyle must come first.',
  },
  {
    icon: BadgeCheck,
    title: 'Physician-reviewed process',
    body: 'Medical review is part of the editorial pipeline — not a decorative badge.',
  },
]

export function EditorialPromise() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-start">
        <div>
          <div className="section-rule" />
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">
            Why Longevity Intel
          </p>
          <h2 className="font-display text-4xl text-ink leading-tight mb-4">
            Built to be the hub you trust when the industry is noisy
          </h2>
          <p className="text-muted leading-relaxed mb-6 max-w-xl">
            Longevity content is flooded with protocols without hierarchy and products without
            evidence grades. We organise the field so you can act in the right order — sleep,
            training, labs, then stack.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-bright transition-colors"
              style={{ boxShadow: 'var(--shadow-green)' }}
            >
              Editorial standards
            </Link>
            <Link
              href="/authors"
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-border bg-surface text-sm font-semibold text-ink hover:border-green/40 transition-colors"
            >
              Meet the team
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {promises.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-surface border border-border rounded-2xl p-4"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-green-bright" />
              </div>
              <h3 className="font-display text-base text-ink mb-1.5 leading-snug">{title}</h3>
              <p className="text-xs text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  )
}
