import Link from 'next/link'
import { products } from '@/lib/products'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight, FlaskConical, ArrowUpRight } from 'lucide-react'

const evidenceBadge: Record<string, { color: string; bg: string; border: string }> = {
  Strong:   { color: 'text-green-bright', bg: 'bg-green/10',     border: 'border-green/20'      },
  Moderate: { color: 'text-amber',         bg: 'bg-amber/10',    border: 'border-amber/20'      },
  Emerging: { color: 'text-blue-400',      bg: 'bg-blue-500/10', border: 'border-blue-500/20'  },
  Weak:     { color: 'text-red-400',       bg: 'bg-red-500/10',  border: 'border-red-500/20'   },
}

const scoreGradient: Record<string, string> = {
  Strong:   'from-green/80 to-green-bright',
  Moderate: 'from-amber/70 to-amber',
  Emerging: 'from-blue-500/60 to-blue-400',
  Weak:     'from-red-500/60 to-red-400',
}

export function DatabaseTeaser() {
  const top = [...products].sort((a, b) => b.evidenceScore - a.evidenceScore).slice(0, 4)

  return (
    <section className="py-24 bg-surface/40 border-y border-border relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(45,158,88,0.04), transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between mb-12">
          <div>
            <div className="section-rule" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">Evidence Database</p>
            <h2 className="font-display text-4xl text-ink leading-tight">Top-Ranked Compounds</h2>
            <p className="text-muted mt-2.5 max-w-lg leading-relaxed">
              Ranked by evidence quality, safety profile, and mechanistic plausibility
              across {products.length} longevity interventions.
            </p>
          </div>
          <Link href="/database"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors duration-150 cursor-pointer group shrink-0">
            Full database
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {top.map((p, i) => {
            const badge = evidenceBadge[p.evidenceLevel] ?? evidenceBadge.Weak
            const grad  = scoreGradient[p.evidenceLevel]  ?? scoreGradient.Weak
            return (
              <AnimatedSection key={p.id} delay={i * 0.07}>
                <Link href="/database"
                  className="group relative block bg-surface border border-border rounded-2xl p-5 hover:border-green/35 transition-all duration-200 cursor-pointer h-full overflow-hidden"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green/0 to-green/0 group-hover:from-green/[0.03] group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />

                  {/* Rank + Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-muted/60 leading-none w-5 shrink-0">#{i + 1}</span>
                      <div className="w-9 h-9 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
                        <FlaskConical className="w-4 h-4 text-green-bright" />
                      </div>
                    </div>
                    <span className="font-display text-2xl text-ink leading-none">{p.evidenceScore}</span>
                  </div>

                  {/* Name + badge */}
                  <h3 className="font-display text-lg text-ink group-hover:text-green-bright transition-colors duration-150 mb-1.5 leading-tight">{p.name}</h3>
                  <span className={`inline-flex items-center font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-full mb-3 ${badge.color} ${badge.bg} ${badge.border}`}>
                    {p.evidenceLevel}
                  </span>

                  {/* Score bar */}
                  <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
                    <div className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-700`}
                      style={{ width: `${p.evidenceScore}%` }} />
                  </div>

                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">{p.summary}</p>

                  {/* Arrow */}
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted group-hover:text-green-bright transition-colors duration-150">
                    View evidence <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>

        <AnimatedSection className="mt-6 sm:hidden">
          <Link href="/database"
            className="flex items-center justify-center gap-1.5 w-full py-3 border border-border rounded-xl text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer">
            View all {products.length} compounds <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
