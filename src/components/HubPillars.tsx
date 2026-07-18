import Link from 'next/link'
import {
  ArrowUpRight,
  Compass,
  Database,
  FlaskConical,
  Layers,
  Moon,
  Sparkles,
  Watch,
  Zap,
} from 'lucide-react'
import { AnimatedSection } from './AnimatedSection'

const pillars = [
  {
    title: 'Start here',
    desc: 'New to longevity? Follow the order that actually compounds.',
    icon: Compass,
    href: '/get-started',
    cta: 'Build my plan',
    accent: 'bg-green/10 text-green-bright border-green/20',
    links: [
      { href: '/get-started', label: '5-step beginner path' },
      { href: '/quiz', label: 'Bio age quiz' },
      { href: '/about', label: 'How we review' },
    ],
  },
  {
    title: 'Best of',
    desc: 'Ranked picks when you need a clear buy / do decision.',
    icon: Sparkles,
    href: '/best',
    cta: 'Browse best lists',
    accent: 'bg-amber/10 text-amber border-amber/20',
    links: [
      { href: '/best/complete-longevity-stack', label: 'Complete stack' },
      { href: '/supplements/best-nmn-supplements-2024', label: 'Best NMN 2026' },
      { href: '/best/best-wearables-longevity-2024', label: 'Best wearables' },
    ],
  },
  {
    title: 'Reviews',
    desc: 'Deep, independent product and compound reviews.',
    icon: FlaskConical,
    href: '/category/supplements',
    cta: 'All categories',
    accent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    links: [
      { href: '/category/supplements', label: 'Supplements' },
      { href: '/category/recovery', label: 'Recovery devices' },
      { href: '/category/wearables', label: 'Wearables' },
    ],
  },
  {
    title: 'Evidence DB',
    desc: '68+ compounds scored by evidence, safety, and plausibility.',
    icon: Database,
    href: '/database',
    cta: 'Open database',
    accent: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    links: [
      { href: '/database', label: 'Full database' },
      { href: '/compare', label: 'Head-to-head compares' },
      { href: '/glossary', label: 'Glossary' },
    ],
  },
]

const quickTopics = [
  { href: '/sleep', label: 'Sleep', icon: Moon },
  { href: '/cardio', label: 'Zone 2', icon: Zap },
  { href: '/nutrition', label: 'Nutrition', icon: Layers },
  { href: '/category/recovery', label: 'Recovery', icon: Sparkles },
  { href: '/category/wearables', label: 'Wearables', icon: Watch },
  { href: '/protocols', label: 'Protocols', icon: FlaskConical },
]

export function HubPillars() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="mb-10">
        <div className="section-rule" />
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">
          The hub map
        </p>
        <h2 className="font-display text-4xl text-ink leading-tight max-w-2xl">
          Everything you need to optimise healthspan — in one place
        </h2>
        <p className="text-muted mt-3 max-w-2xl leading-relaxed">
          Most longevity sites sell a product or a personality. We organise evidence into clear
          paths: start simple, rank what matters, then go deep.
        </p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {pillars.map(({ title, desc, icon: Icon, href, cta, accent, links }, i) => (
          <AnimatedSection key={title} delay={i * 0.06}>
            <div
              className="h-full flex flex-col bg-surface border border-border rounded-2xl p-5 hover:border-green/30 transition-all duration-200"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${accent}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl text-ink mb-1.5">{title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{desc}</p>
              <ul className="space-y-1.5 mb-4">
                {links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink/80 hover:text-green-bright transition-colors inline-flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-green-bright/70" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-bright hover:text-green transition-colors group"
              >
                {cta}
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted mr-1">
            Jump to topic
          </span>
          {quickTopics.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-surface text-sm text-muted hover:text-ink hover:border-green/35 transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-green-bright" />
              {label}
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </section>
  )
}
