import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SaunaComparison() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>
          <h1 className="font-display text-4xl text-ink mb-4">Infrared vs. Traditional Sauna: Full Comparison</h1>
          <p className="text-muted text-lg max-w-2xl mb-12">
            Both sauna types have cardiovascular and stress benefits, but they differ in mechanism, temperature, comfort, and cost. Here&apos;s the science.
          </p>
        </AnimatedSection>

        {/* Comparison Table */}
        <AnimatedSection delay={0.1}>
          <div className="overflow-x-auto mb-12">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-display text-ink font-semibold">Factor</th>
                  <th className="text-left px-4 py-3 font-display text-ink font-semibold">Infrared</th>
                  <th className="text-left px-4 py-3 font-display text-ink font-semibold">Traditional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { factor: 'Temperature', infrared: '120–150°F (49–65°C)', traditional: '160–212°F (70–100°C)' },
                  { factor: 'Heating Method', infrared: 'Infrared light (IR) → direct tissue penetration', traditional: 'Heat stones + water → air convection' },
                  { factor: 'Depth of Penetration', infrared: 'Shallow to moderate (1–1.5 inches)', traditional: 'Surface only (skin)' },
                  { factor: 'Sweat Profile', infrared: 'Lighter sweat, more comfortable for beginners', traditional: 'Heavy sweat, intense detox sensation' },
                  { factor: 'Cardiovascular Effect', infrared: 'Mild HR increase (~100 bpm)', traditional: 'Stronger HR increase (~150+ bpm)' },
                  { factor: 'Cost (Home Unit)', infrared: '$2,000–$6,000 (barrel or cabin)', traditional: '$5,000–$15,000+ (wood fired or electric)' },
                  { factor: 'Maintenance', infrared: 'Low (clean interior occasionally)', traditional: 'High (water, stones, ventilation)' },
                  { factor: 'Time to Heat', infrared: '10–20 minutes', traditional: '30–60 minutes' },
                  { factor: 'Best Session Duration', infrared: '20–45 min', traditional: '15–30 min (more intense)' },
                  { factor: 'EMF/Safety Concern', infrared: 'Some models emit low EMF; check specs', traditional: 'No EMF; very safe' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-surface/50">
                    <td className="px-4 py-3 font-semibold text-ink">{row.factor}</td>
                    <td className="px-4 py-3 text-muted">{row.infrared}</td>
                    <td className="px-4 py-3 text-muted">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        {/* Health Benefits */}
        <AnimatedSection delay={0.2}>
          <h2 className="font-display text-2xl text-ink mb-6">Health Benefits: Evidence-Based</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                type: 'Traditional Sauna',
                benefits: [
                  '↓ Cardiovascular mortality by ~50% (2015 Kuopio study, 20y follow-up)',
                  '↑ Blood flow, ↓ Blood pressure',
                  'Strong heat shock protein (HSP) induction → muscle repair',
                  'Improved endothelial function',
                  'Mitochondrial biogenesis',
                  'Better for HIIT-like effect (intense, short duration)',
                ],
              },
              {
                type: 'Infrared Sauna',
                benefits: [
                  '↓ Blood pressure (similar to traditional)',
                  'Moderate HSP induction (less than traditional)',
                  'Skin penetration → collagen synthesis claims (limited RCT evidence)',
                  'More comfortable for beginners / injured',
                  'Can do longer sessions (20–45 min vs 15–30)',
                  'Claims of detox; lacks strong mechanistic evidence',
                ],
              },
            ].map((section, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-display text-lg text-ink mb-4">{section.type}</h3>
                <ul className="space-y-2">
                  {section.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <span className="text-green-bright mt-0.5">✓</span>
                      <span className="text-muted">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Recommendation Matrix */}
        <AnimatedSection delay={0.3}>
          <h2 className="font-display text-2xl text-ink mb-6">Who Should Use What?</h2>
          <div className="space-y-4 mb-12">
            {[
              { profile: 'Beginners (new to sauna)', rec: 'Infrared', why: 'Lower temp, longer sessions, more forgiving. Easier to build habit.' },
              { profile: 'Budget-conscious', rec: 'DIY cold plunge + community sauna', why: 'Sauna membership ($20–50/mo) + DIY ice bath. Lowest cost, high ROI.' },
              { profile: 'Longevity-focused', rec: 'Traditional sauna', why: 'Strongest evidence for mortality reduction. Aim 2–4x/week, 15–30 min.' },
              { profile: 'Joint issues / Pain', rec: 'Infrared', why: 'Less intense heat stress, longer tolerance, good for arthritis discomfort.' },
              { profile: 'Performance athletes', rec: 'Traditional', why: 'Stronger HSP response, better muscle recovery from intense training.' },
              { profile: 'Skeptical / Want minimal risk', rec: 'Traditional', why: 'Oldest, most research, zero EMF concerns.' },
            ].map((item, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-display text-ink">{item.profile}</h3>
                  <span className="font-semibold text-green-bright text-sm">{item.rec}</span>
                </div>
                <p className="text-muted text-sm">{item.why}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Protocol Recommendations */}
        <AnimatedSection delay={0.4}>
          <h2 className="font-display text-2xl text-ink mb-6">Longevity-Optimized Sauna Protocol</h2>
          <div className="bg-surface border border-border rounded-lg p-6 mb-12">
            <div className="space-y-4">
              {[
                { phase: 'Frequency', protocol: '2–4x per week (3x is sweet spot)' },
                { phase: 'Duration (Traditional)', protocol: '15–30 min at 170–185°F (76–85°C). Build up gradually.' },
                { phase: 'Duration (Infrared)', protocol: '20–45 min at 130–150°F (54–65°C)' },
                { phase: 'Temperature Progression', protocol: 'Start cool, gradually increase over weeks. 1–2 sessions/week at high temp max.' },
                { phase: 'Cooling Method', protocol: 'Cold plunge (50°F / 10°C) for 1–3 min post-sauna. Contrast therapy amplifies benefits.' },
                { phase: 'Hydration', protocol: 'Drink 500 ml water before, 500 ml after. Monitor sweat loss.' },
                { phase: 'Best Time', protocol: 'Evening (post-exercise recovery + sleep improvement). Avoid sauna right before bed if overstimulating.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 pb-3 border-b border-border last:border-b-0">
                  <div className="font-semibold text-green-bright min-w-fit text-sm">{item.phase}</div>
                  <div className="text-muted text-sm">{item.protocol}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Cost Breakdown */}
        <AnimatedSection delay={0.5}>
          <h2 className="font-display text-2xl text-ink mb-6">Cost Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                option: 'Infrared Home Unit',
                cost: '$2,000–$6,000',
                breakdown: ['$2,000 barrel sauna (outdoor)', '$4,000 indoor cabin (full-size)', '$6,000+ cedar luxury cabin'],
                annual: '$100–$300 maintenance',
              },
              {
                option: 'Traditional Home Unit',
                cost: '$5,000–$15,000+',
                breakdown: ['$5,000 electric (indoor cabin)', '$8,000–$15,000 wood-fired (outdoor)', '$2,000+ installation + ventilation'],
                annual: '$300–$800 maintenance',
              },
            ].map((section, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-6">
                <h3 className="font-display text-lg text-ink mb-4">{section.option}</h3>
                <div className="mb-4">
                  <p className="text-sm text-muted mb-2">Initial Cost</p>
                  <p className="font-display text-2xl text-ink">{section.cost}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted mb-2">Breakdown</p>
                  <ul className="space-y-1 text-sm text-muted">
                    {section.breakdown.map((line, j) => (
                      <li key={j}>• {line}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-muted"><strong>Annual Maintenance:</strong> {section.annual}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h3 className="font-display text-lg text-ink mb-4">Budget Alternative: Community Sauna</h3>
            <p className="text-muted text-sm mb-3">No home unit? Use your local sauna / spa:</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><strong>Cost:</strong> $15–50/visit or $100–200/month membership</li>
              <li><strong>Upside:</strong> Social, no maintenance, try before buying home unit</li>
              <li><strong>Downside:</strong> Less privacy, fixed hours, travel time</li>
            </ul>
          </div>
        </AnimatedSection>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.6} className="mt-12 text-center">
          <Link href="/compare" className="inline-flex items-center gap-2 text-green-bright hover:text-green font-semibold text-sm transition-colors cursor-pointer">
            ← Back to All Comparisons
          </Link>
        </AnimatedSection>
      </div>
    </div>
  )
}
