import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

/** Curated money pages — the routes people (and Google) should find first. */
const guides = [
  {
    href: '/best/complete-longevity-stack',
    category: 'Stack',
    title: 'Complete Longevity Supplement Stack',
    desc: 'Tiered what / when / why — start with foundations, not hype compounds.',
  },
  {
    href: '/supplements/best-nmn-supplements-2024',
    category: 'Supplements',
    title: 'Best NMN Supplements 2026',
    desc: 'Purity, dose, and testing criteria for NAD+ precursors.',
  },
  {
    href: '/protocols/sleep-hygiene-protocol',
    category: 'Protocol',
    title: 'Sleep Hygiene Protocol',
    desc: '20 ranked changes. Highest leverage intervention in longevity.',
  },
  {
    href: '/recovery/best-home-saunas-infrared-2024',
    category: 'Recovery',
    title: 'Best Home Infrared Saunas',
    desc: 'Full-spectrum vs far-IR, EMF, and value from portable to cabin.',
  },
  {
    href: '/recovery/cold-plunge-ice-bath-review',
    category: 'Recovery',
    title: 'Best Cold Plunges 2026',
    desc: 'DIY to pro pods — temperature, filtration, and training timing.',
  },
  {
    href: '/best/best-wearables-longevity-2024',
    category: 'Wearables',
    title: 'Best Longevity Wearables',
    desc: 'WHOOP, Oura, Garmin, and CGM — ranked by use case.',
  },
  {
    href: '/recovery/best-red-light-therapy-panels-2024',
    category: 'Recovery',
    title: 'Best Red Light Panels',
    desc: 'Irradiance and wavelength accuracy, not marketing watts.',
  },
  {
    href: '/supplements/best-creatine-supplements',
    category: 'Supplements',
    title: 'Best Creatine for Longevity',
    desc: 'Monohydrate wins. Muscle, cognition, and healthspan evidence.',
  },
]

export function TopGuides() {
  return (
    <section className="py-20 border-y border-border bg-surface/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="section-rule" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">
              Most useful guides
            </p>
            <h2 className="font-display text-4xl text-ink leading-tight">
              The pages that answer real questions
            </h2>
            <p className="text-muted mt-2.5 max-w-xl leading-relaxed">
              Not a feed of everything we publish — the decision-grade guides our readers open first.
            </p>
          </div>
          <Link
            href="/best"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors group shrink-0"
          >
            All best lists
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((g, i) => (
            <AnimatedSection key={g.href} delay={i * 0.04}>
              <Link
                href={g.href}
                className="group h-full flex flex-col bg-surface border border-border rounded-2xl p-5 hover:border-green/35 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                    <Star className="w-3 h-3 text-amber" />
                    {g.category}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green-bright transition-colors" />
                </div>
                <h3 className="font-display text-lg text-ink group-hover:text-green transition-colors leading-snug mb-2">
                  {g.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed flex-1">{g.desc}</p>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
