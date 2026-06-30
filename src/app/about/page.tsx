import { AnimatedSection } from '@/components/AnimatedSection'
import { Shield, BookOpen, FlaskConical, Users } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Longevity Intel — Editorial Policy & Methodology',
  description: 'How we research, test, and score longevity supplements, wearables, and protocols. Our editorial independence policy and team.',
}

const team = [
  { name: 'Dr. Sarah Chen', role: 'Chief Medical Reviewer', background: 'MD, Internal Medicine. 12 years in preventive medicine. Former researcher at UCSF.', initials: 'SC' },
  { name: 'Marcus Webb', role: 'Senior Tech & Recovery Editor', background: 'MSc Exercise Physiology. 10 years covering health tech and recovery science.', initials: 'MW' },
  { name: 'Dr. James Okafor', role: 'Research Scientist', background: 'PhD Molecular Biology. Specialises in NAD+ metabolism and mitochondrial health.', initials: 'JO' },
]

const methodology = [
  { icon: FlaskConical, title: 'Independent Testing', description: 'We purchase all reviewed products independently. No free samples accepted for products under review.' },
  { icon: BookOpen, title: 'Peer-Reviewed Sources', description: 'All health claims are referenced to published, peer-reviewed research. We link every major claim to PubMed.' },
  { icon: Shield, title: 'No Conflicts of Interest', description: 'Our team is contractually prohibited from owning equity in supplement or wearable companies.' },
  { icon: Users, title: 'Expert Review', description: 'All medical content is reviewed by at least one MD or PhD before publication.' },
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
          <p className="text-muted mb-6">Every supplement, device, or protocol we review receives an overall score from 0–100, weighted across four criteria:</p>
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

        {/* Team */}
        <AnimatedSection className="mb-16" delay={0.2}>
          <h2 className="font-display text-3xl text-ink mb-6">Our Team</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {team.map(member => (
              <div key={member.name} className="bg-surface border border-border rounded-2xl p-5">
                <div className="w-12 h-12 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center mb-4">
                  <span className="font-mono text-sm font-medium text-green-bright">{member.initials}</span>
                </div>
                <h3 className="font-display text-lg text-ink mb-0.5">{member.name}</h3>
                <p className="font-mono text-xs text-green-bright uppercase tracking-wide mb-2">{member.role}</p>
                <p className="text-muted text-sm leading-relaxed">{member.background}</p>
              </div>
            ))}
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
                  Longevity Intel participates in affiliate programmes (including Amazon Associates and direct brand partnerships).
                  When you click a link and make a purchase, we may earn a commission at no extra cost to you.
                  <br /><br />
                  This income funds our research and editorial operations. It <strong className="text-ink">never</strong> influences our ratings,
                  recommendations, or editorial positions. Products we recommend are ones we would recommend regardless of commission structure.
                  Sponsored content, when it exists, is clearly labelled.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
