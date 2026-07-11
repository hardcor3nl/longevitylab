import Link from 'next/link'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight, TestTube2, Moon, HeartPulse, Salad, FlaskConical } from 'lucide-react'

const steps = [
  {
    icon: TestTube2,
    step: '01',
    title: 'Test Your Baseline',
    desc: 'You can’t improve what you don’t measure. Start with the right blood panel.',
    href: '/best/best-longevity-labs',
  },
  {
    icon: Moon,
    step: '02',
    title: 'Fix Your Sleep',
    desc: 'The highest-leverage intervention in all of longevity. 20 changes, ranked.',
    href: '/protocols/sleep-hygiene-protocol',
  },
  {
    icon: HeartPulse,
    step: '03',
    title: 'Build the Cardio Base',
    desc: 'Zone 2 training is the foundation. The complete 12-week programme.',
    href: '/protocols/zone2-training-deep-dive',
  },
  {
    icon: Salad,
    step: '04',
    title: 'Dial In Nutrition',
    desc: 'An evidence-first eating framework — no diet ideology, just the data.',
    href: '/protocols/longevity-nutrition-framework',
  },
  {
    icon: FlaskConical,
    step: '05',
    title: 'Add the Stack',
    desc: 'The complete tiered supplement stack: what to take, when, and why.',
    href: '/best/complete-longevity-stack',
  },
]

export function StartHere() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="flex items-end justify-between mb-12">
        <div>
          <div className="section-rule" />
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">New Here?</p>
          <h2 className="font-display text-4xl text-ink leading-tight">The 5-Step Longevity Path</h2>
          <p className="text-muted mt-2.5 max-w-lg leading-relaxed">
            Skip the noise. This is the order of operations our research supports —
            each step builds on the one before it.
          </p>
        </div>
        <Link href="/get-started"
          className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors duration-150 cursor-pointer group shrink-0">
          Full beginner guide
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-150" />
        </Link>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map(({ icon: Icon, step, title, desc, href }, i) => (
          <AnimatedSection key={step} delay={i * 0.07}>
            <Link href={href}
              className="group relative flex flex-col h-full bg-surface border border-border rounded-2xl p-5 pt-6 hover:border-green/35 transition-all duration-200 cursor-pointer overflow-hidden"
              style={{ boxShadow: 'var(--shadow-sm)' }}>
              {/* Giant step number watermark */}
              <span
                className="absolute top-1 right-2 font-display text-[56px] leading-none select-none pointer-events-none transition-colors duration-300"
                style={{ color: 'var(--ink)', opacity: 0.05 }}
                aria-hidden="true">
                {step}
              </span>

              <div className="relative w-9 h-9 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-green-bright" />
              </div>
              <p className="relative font-mono text-[10px] uppercase tracking-widest text-green-bright mb-1.5">Step {step}</p>
              <h3 className="relative font-display text-lg text-ink group-hover:text-green-bright transition-colors duration-150 leading-tight mb-2">{title}</h3>
              <p className="relative text-xs text-muted leading-relaxed flex-1">{desc}</p>
              <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-muted group-hover:text-green-bright transition-colors duration-150">
                Read the guide <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" />
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection className="mt-5 sm:hidden">
        <Link href="/get-started"
          className="flex items-center justify-center gap-1.5 w-full py-3 border border-border rounded-xl text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer">
          Read the full beginner guide <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </AnimatedSection>
    </section>
  )
}
