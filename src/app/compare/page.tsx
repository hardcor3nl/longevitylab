import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowRight, GitCompare, Scale, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import { comparisons } from '@/lib/comparisons'
import { SITE, absoluteUrl } from '@/lib/site'

const url = absoluteUrl('/compare')

export const metadata: Metadata = {
  title: 'Longevity Comparisons — NMN vs NR, WHOOP vs Oura & More',
  description:
    'Decision matrix for longevity: NMN vs NR, WHOOP vs Oura, sauna types, magnesium forms, creatine vs HMB, and cold plunge vs DIY — with clear verdicts.',
  alternates: { canonical: url },
  openGraph: {
    title: `Comparisons | ${SITE.name}`,
    description: 'Evidence-based head-to-head longevity comparisons with clear verdicts.',
    url,
    type: 'website',
    siteName: SITE.name,
  },
}

const categories = ['All', ...Array.from(new Set(comparisons.map(c => c.category)))]

export default function ComparePage() {
  const featured = comparisons.filter(c => c.featured)
  const rest = comparisons.filter(c => !c.featured)

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="w-4 h-4 text-green-bright" />
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">
              Decision matrix
            </span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">
            Head-to-head comparisons
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            When two options both look good, use these evidence tables. Every card has a clear
            verdict, category, and links into deeper reviews.
          </p>
        </AnimatedSection>

        {/* Featured matrix */}
        <AnimatedSection className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Most searched</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map(c => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 hover:border-green/35 hover:shadow-lg transition-all h-full"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at top right, rgba(45,158,88,0.06), transparent 55%)' }} />
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted border border-border px-2 py-0.5 rounded-full">
                  {c.category}
                </span>
                <h2 className="font-display text-2xl text-ink group-hover:text-green transition-colors mt-3 leading-tight">
                  {c.title}
                </h2>
                <p className="text-sm text-muted mt-1 mb-4">{c.subtitle}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-green/10 text-green-bright border border-green/20">
                    {c.a}
                  </span>
                  <Scale className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-amber/10 text-amber border border-amber/20">
                    {c.b}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2">{c.description}</p>
                <p className="text-xs font-semibold text-green-bright">
                  Verdict: {c.verdict}
                </p>
              </Link>
            ))}
          </div>
        </AnimatedSection>

        {/* Category chips (static anchors for SEO + scanability) */}
        <AnimatedSection className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span
                key={cat}
                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-border text-muted bg-surface"
              >
                {cat === 'All' ? `${comparisons.length} comparisons` : cat}
              </span>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-4">
          {rest.map((c, i) => (
            <AnimatedSection key={c.slug} delay={i * 0.05}>
              <Link
                href={`/compare/${c.slug}`}
                className="group block bg-surface border border-border rounded-2xl p-5 hover:border-green/30 hover:shadow-md transition-all h-full"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted border border-border px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                  <span className="text-[11px] font-semibold text-green-bright text-right">
                    {c.verdict}
                  </span>
                </div>
                <h2 className="font-display text-xl text-ink group-hover:text-green transition-colors leading-tight mb-1">
                  {c.title}
                </h2>
                <p className="text-muted text-sm mb-2">{c.subtitle}</p>
                <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-2">{c.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-border">{c.a}</span>
                    <span>vs</span>
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-border">{c.b}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-bright">
                    Compare <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12 p-6 rounded-2xl border border-border bg-surface">
          <h3 className="font-display text-xl text-ink mb-2">How we decide winners</h3>
          <p className="text-sm text-muted leading-relaxed max-w-3xl">
            Verdicts weigh human evidence, safety, practicality, and cost — not sponsor preference.
            When the evidence is close, we say so and route you to the deeper protocol or product guide.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/best" className="text-sm font-semibold text-green-bright hover:underline">
              Best lists →
            </Link>
            <Link href="/database" className="text-sm font-semibold text-green-bright hover:underline">
              Evidence database →
            </Link>
            <Link href="/get-started" className="text-sm font-semibold text-green-bright hover:underline">
              Beginner path →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
