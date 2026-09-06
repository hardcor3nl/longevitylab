import { AnimatedSection } from '@/components/AnimatedSection'
import { Shield, BookOpen, FlaskConical, ClipboardCheck } from 'lucide-react'
import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About Longevity Intel — Editorial Policy & Methodology',
  description: 'How Longevity Intel researches, compares, and maintains guides on supplements, wearables, and longevity protocols.',
  alternates: { canonical: absoluteUrl('/about') },
}

const methodology = [
  { icon: BookOpen, title: 'Visible Sources', description: 'Research claims should link to the underlying publication or official source, with study design and limitations stated where relevant.' },
  { icon: FlaskConical, title: 'Testing Status', description: 'Hands-on testing is claimed only when the page documents what was tested and how. Otherwise, the page is presented as research-based analysis.' },
  { icon: Shield, title: 'Commercial Transparency', description: 'Affiliate relationships are disclosed. A commission does not establish product quality or clinical benefit.' },
  { icon: ClipboardCheck, title: 'Recorded Review', description: 'Medical review is displayed only when a named reviewer, review date, credentials, and permission are documented for that article.' },
]

const scoringCriteria = [
  { label: 'Evidence Quality', weight: '35%', description: 'Human RCT data, meta-analyses, effect sizes, and study quality' },
  { label: 'Safety Profile', weight: '25%', description: 'Long-term safety data, contraindications, and adverse event reports' },
  { label: 'Mechanistic Plausibility', weight: '20%', description: 'Does the biology make sense? Is the mechanism well-understood?' },
  { label: 'Value & Accessibility', weight: '20%', description: 'Price per effective dose, quality control, and sourcing standards' },
]

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedSection className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">Our Mission</p>
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-6 leading-tight">
            Science-First.<br />
            <span className="text-green dark:text-green-bright">Always Independent.</span>
          </h1>
          <p className="text-muted text-xl leading-relaxed max-w-3xl">
            Longevity Intel exists because the longevity space is flooded with pseudoscience,
            marketing disguised as research, and conflicts of interest that compromise editorial integrity.
            We&apos;re building the resource we wish existed.
          </p>
        </AnimatedSection>

        {/* Methodology grid */}
        <AnimatedSection className="mb-16" delay={0.1}>
          <h2 className="font-display text-3xl text-ink mb-6">How We Work</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {methodology.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-surface border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-green/10 border border-green/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-green-bright" />
                </div>
                <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Scoring methodology */}
        <AnimatedSection className="mb-16" delay={0.15}>
          <h2 className="font-display text-3xl text-ink mb-3">Our Scoring System</h2>
          <p className="text-muted mb-6">When a page uses an overall score, it is an editorial comparison from 0–100—not a clinical measurement—and uses these four criteria:</p>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {scoringCriteria.map((c, i) => (
              <div key={c.label} className={`p-5 flex items-start gap-4 ${i < scoringCriteria.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="font-mono text-sm font-medium text-green-bright bg-green/10 border border-green/20 px-2.5 py-1 rounded-lg shrink-0 mt-0.5">{c.weight}</div>
                <div>
                  <p className="font-semibold text-ink mb-0.5">{c.label}</p>
                  <p className="text-muted text-sm">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Editorial attribution */}
        <AnimatedSection className="mb-16" delay={0.2}>
          <h2 className="font-display text-3xl text-ink mb-6">Editorial Attribution</h2>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-display text-xl text-ink mb-2">Longevity Intel Editorial Team</h3>
            <p className="text-muted text-sm leading-relaxed">
              Legacy articles are attributed to the editorial team while contributor identities,
              credentials, testing records, and review records are being verified. Named medical
              or specialist attribution will appear only after that documentation is complete.
            </p>
          </div>
        </AnimatedSection>

        {/* Affiliate disclosure */}
        <AnimatedSection id="affiliate" delay={0.25}>
          <div className="bg-amber/5 border border-amber/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display text-xl text-ink mb-2">Affiliate Disclosure</h3>
                <p className="text-muted leading-relaxed text-sm">
                  <strong className="text-ink">As an Amazon Associate, Longevity Intel earns from qualifying purchases.</strong> We also
                  participate in affiliate programmes with direct brand partners. When you click a link and make a purchase, we may earn
                  a commission at no extra cost to you.
                  <br /><br />
                  This income funds site operations. Rankings are not sold, and sponsored content,
                  when it exists, is clearly labelled. Readers should still compare the cited
                  evidence, limitations, and current product information.
                  <br /><br />
                  Prices, availability, and product details shown on this site are estimates and may not reflect current pricing —
                  always confirm the live price on the retailer&apos;s site before purchasing.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
