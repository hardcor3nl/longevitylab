import Link from 'next/link'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowRight, GitCompare } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Supplement Comparisons — NMN vs NR, Infrared vs Traditional Sauna & More',
  description: 'Head-to-head comparisons of top longevity supplements and devices. Evidence-based verdicts on NMN vs NR, WHOOP vs Oura, infrared vs traditional sauna, and more.',
}

const comparisons = [
  {
    slug: 'nmn-vs-nr',
    title: 'NMN vs NR',
    subtitle: 'Which NAD+ precursor is better?',
    category: 'Supplements',
    verdict: 'NMN',
    description: 'Both NMN and NR effectively raise NAD+ levels. We break down the evidence, bioavailability differences, and who should choose which.',
  },
  {
    slug: 'whoop-vs-oura',
    title: 'WHOOP 4.0 vs Oura Ring Gen 3',
    subtitle: 'Best longevity wearable?',
    category: 'Wearables',
    verdict: 'Depends on goal',
    description: 'WHOOP wins for HRV and recovery. Oura wins for sleep staging. After 6 months wearing both simultaneously, here\'s the verdict.',
  },
  {
    slug: 'infrared-vs-traditional-sauna',
    title: 'Infrared vs Traditional Sauna',
    subtitle: 'Which delivers better longevity benefits?',
    category: 'Recovery',
    verdict: 'Traditional',
    description: 'The KIHD mortality data is from traditional saunas. Infrared has unique near-IR benefits. We break down the full evidence comparison.',
  },
  {
    slug: 'creatine-vs-hmb',
    title: 'Creatine vs HMB',
    subtitle: 'Best anti-sarcopenic supplement?',
    category: 'Supplements',
    verdict: 'Creatine',
    description: 'For muscle retention and longevity, creatine has 500+ studies. HMB has a narrower evidence base. The evidence comparison is clear.',
  },
  {
    slug: 'cold-plunge-vs-ice-bath',
    title: 'Cold Plunge vs DIY Ice Bath',
    subtitle: 'Is a $5,000 cold plunge worth it?',
    category: 'Recovery',
    verdict: 'Depends on budget',
    description: 'A DIY chest freezer reaches the same temperature as a $5,000 Plunge Pro. But filtration, convenience, and maintenance tell a different story.',
  },
  {
    slug: 'magnesium-forms',
    title: 'Magnesium Glycinate vs L-Threonate vs Malate',
    subtitle: 'Which magnesium form is best?',
    category: 'Supplements',
    verdict: 'Glycinate for sleep, L-Threonate for brain',
    description: 'The form of magnesium matters enormously. Glycinate for sleep, L-Threonate for cognitive benefits, Malate for energy. Full breakdown.',
  },
]

export default function ComparePage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="w-4 h-4 text-green-bright" />
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Head-to-Head</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4">Comparisons</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Evidence-based head-to-head comparisons of top longevity supplements, devices, and protocols.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {comparisons.map((c, i) => (
            <AnimatedSection key={c.slug} delay={i * 0.07}>
              <Link href={`/compare/${c.slug}`}
                className="group block bg-surface border border-border rounded-2xl p-6 hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted border border-border px-2 py-0.5 rounded-full">{c.category}</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-green-bright">
                    Verdict: {c.verdict}
                  </div>
                </div>
                <h2 className="font-display text-2xl text-ink group-hover:text-green transition-colors leading-tight mb-1">{c.title}</h2>
                <p className="text-muted text-sm italic mb-3">{c.subtitle}</p>
                <p className="text-muted text-sm leading-relaxed mb-4">{c.description}</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-bright group-hover:gap-2 transition-all">
                  Read comparison <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
