import { supplements, getSupplementById } from '@/lib/supplements'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ScoreBar } from '@/components/ScoreBar'
import { ArrowUpRight, ArrowLeft, Clock, Layers, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return supplements.map(s => ({ id: s.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const s = getSupplementById(params.id)
  if (!s) return {}
  return { title: `${s.name} — Evidence Review`, description: s.summary }
}

const evidenceBadgeColors: Record<string, string> = {
  Strong: 'bg-green/10 text-green-bright border-green/25',
  Moderate: 'bg-amber/10 text-amber border-amber/25',
  Emerging: 'bg-blue-500/10 text-blue-500 border-blue-500/25',
  Weak: 'bg-red-500/10 text-red-400 border-red-500/25',
}

export default function SupplementPage({ params }: { params: { id: string } }) {
  const s = getSupplementById(params.id)
  if (!s) notFound()

  const relatedSupps = supplements.filter(r => s.stacksWith.includes(r.id))

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/database" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Database
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main */}
            <div>
              <div className="mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{s.category}</span>
              </div>
              <h1 className="font-display text-5xl text-ink mb-2">{s.name}</h1>
              {s.aliases.length > 0 && (
                <p className="text-muted text-sm font-mono mb-6">Also known as: {s.aliases.join(' · ')}</p>
              )}

              {/* Evidence badge + study count */}
              <div className="flex items-center gap-3 mb-8">
                <span className={`font-mono text-xs border px-3 py-1 rounded-full uppercase tracking-wider ${evidenceBadgeColors[s.evidenceLevel]}`}>
                  {s.evidenceLevel} Evidence
                </span>
                <span className="text-sm text-muted">{s.studyCount}+ human studies</span>
              </div>

              {/* Summary */}
              <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
                <p className="text-ink text-lg leading-relaxed">{s.summary}</p>
              </div>

              {/* Mechanism */}
              <div className="mb-8">
                <h2 className="font-display text-2xl text-ink mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-bright" /> Mechanism of Action
                </h2>
                <p className="text-muted leading-relaxed">{s.mechanism}</p>
              </div>

              {/* Dosage */}
              <div className="mb-8">
                <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber" /> Dosage &amp; Timing
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">Dose</p>
                    <p className="text-ink font-semibold">{s.dosage}</p>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">When to take</p>
                    <p className="text-ink font-semibold">{s.timing}</p>
                  </div>
                </div>
              </div>

              {/* Stack compatibility */}
              {relatedSupps.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl text-ink mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-green-bright" /> Stacks Well With
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {relatedSupps.map(r => (
                      <Link key={r.id} href={`/database/${r.id}`}
                        className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 hover:border-green/40 transition-colors cursor-pointer group">
                        <span className="text-sm font-medium text-ink group-hover:text-green transition-colors">{r.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-muted" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Avoid */}
              {s.avoid.length > 0 && (
                <div className="bg-amber/5 border border-amber/20 rounded-2xl p-5 mb-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-2">Caution</p>
                  <p className="text-sm text-ink">May interact with: {s.avoid.join(', ')}</p>
                </div>
              )}

              {/* CTA */}
              {s.affiliateUrl && (
                <Link href={s.affiliateUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green-bright transition-colors cursor-pointer">
                  View Top Picks <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-surface border border-border rounded-2xl p-5 space-y-5 sticky top-28">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Evidence Scores</h3>
                <ScoreBar score={s.evidenceScore} label="Evidence Quality" />
                <ScoreBar score={s.safetyScore} label="Safety Profile" />
                <ScoreBar score={s.popularityScore} label="Popularity" />
                <div className="pt-2 border-t border-border">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">Goals</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.goals.map(g => (
                      <Link key={g} href={`/database?goal=${g}`}
                        className="font-mono text-[9px] uppercase tracking-wider border border-border text-muted px-2 py-0.5 rounded-full hover:border-green/40 hover:text-ink transition-colors cursor-pointer">
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
                {s.reviewSlug && (
                  <Link href={`/${s.reviewSlug}`}
                    className="flex items-center justify-between w-full text-sm font-medium text-green hover:text-green-bright transition-colors cursor-pointer">
                    Read our full review <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
