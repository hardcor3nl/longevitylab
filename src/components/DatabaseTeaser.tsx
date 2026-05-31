import Link from 'next/link'
import { supplements } from '@/lib/supplements'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight, FlaskConical } from 'lucide-react'

export function DatabaseTeaser() {
  const top = [...supplements].sort((a, b) => b.evidenceScore - a.evidenceScore).slice(0, 4)
  const evidenceColor: Record<string, string> = {
    Strong: 'text-green-bright',
    Moderate: 'text-amber',
    Emerging: 'text-blue-400',
    Weak: 'text-red-400',
  }

  return (
    <section className="py-20 bg-surface/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Evidence Database</p>
            <h2 className="font-display text-4xl text-ink">Top-Ranked Supplements</h2>
            <p className="text-muted mt-2 max-w-lg">Ranked by evidence quality, safety, and mechanistic plausibility across {supplements.length} longevity interventions.</p>
          </div>
          <Link href="/database" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer group shrink-0">
            Full database <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {top.map((s, i) => (
            <AnimatedSection key={s.id} delay={i * 0.08}>
              <Link href={`/database/${s.id}`}
                className="group block bg-surface border border-border rounded-2xl p-5 hover:border-green/30 hover:shadow-md transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-green-bright" />
                  </div>
                  <span className="font-display text-2xl text-ink">{s.evidenceScore}</span>
                </div>
                <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors mb-1">{s.name}</h3>
                <p className={`font-mono text-[10px] uppercase tracking-widest mb-2 ${evidenceColor[s.evidenceLevel]}`}>{s.evidenceLevel} Evidence</p>
                <p className="text-sm text-muted line-clamp-2">{s.summary}</p>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-6 sm:hidden">
          <Link href="/database" className="flex items-center justify-center gap-1.5 w-full py-3 border border-border rounded-xl text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer">
            View all {supplements.length} supplements <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
