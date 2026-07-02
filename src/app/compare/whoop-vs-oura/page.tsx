import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WHOOP 4.0 vs Oura Ring Gen 3: Which Wearable Wins? (2026)',
  description: 'A complete head-to-head comparison of WHOOP 4.0 and Oura Ring Gen 3 for longevity tracking — HRV accuracy, sleep staging, form factor, and pricing after 6 months wearing both simultaneously.',
}

export default function WhoopVsOuraPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Wearables</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">WHOOP 4.0 vs<br />Oura Ring Gen 3</h1>
          <p className="text-muted text-lg mb-10 leading-relaxed">WHOOP wins for HRV and recovery. Oura wins for sleep staging. After wearing both simultaneously for 6 months, here&apos;s the full breakdown — and which one actually fits your goal.</p>

          {/* Quick verdict */}
          <div className="bg-green/5 border border-green/20 rounded-2xl p-6 mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Our Verdict</p>
            <p className="text-ink font-medium text-lg">Depends on goal. Choose WHOOP if training load, HRV-driven recovery scoring, and daily strain management are your priority. Choose Oura if sleep architecture, all-day wearability, and battery life matter more. Neither is a clear universal winner — the two devices optimise for genuinely different use cases.</p>
          </div>

          {/* Head-to-head table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-widest text-muted">Factor</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-green-bright">WHOOP 4.0</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-amber">Oura Gen 3</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Form factor', 'Wristband / bicep band (screenless)', 'Ring — worn on finger'],
                  ['Display', 'None — app only', 'None — app only'],
                  ['Hardware cost', 'Included in membership', '$299–$549 one-time'],
                  ['Subscription', 'Required — $199/yr (device included)', '$5.99–$9.99/mo after ring purchase'],
                  ['Battery life', '4–5 days', '4–7 days'],
                  ['HRV tracking', 'Continuous, all day', 'Overnight only'],
                  ['Sleep staging accuracy', 'Good', 'Best-in-class vs PSG studies'],
                  ['Recovery score', 'Whoop Recovery (HRV + RHR + sleep)', 'Oura Readiness (similar inputs)'],
                  ['Strain / training load', 'Whoop Strain — detailed, exercise-specific', 'Activity score — more general'],
                  ['Comfort for 24/7 wear', 'Good, some find band bulky for sleep', 'Excellent — least intrusive form factor'],
                  ['Water resistance', '10m', '100m'],
                  ['Best for', 'Athletes tracking training load precisely', 'Sleep-focused optimisation, discreet wear'],
                ].map(([factor, whoop, oura]) => (
                  <tr key={factor} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-muted">{factor}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{whoop}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{oura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="font-display text-3xl text-ink mb-4">The Core Design Difference</h2>
              <p className="text-muted leading-relaxed">WHOOP and Oura solve the same underlying problem — turning heart rate variability, resting heart rate, and sleep data into an actionable recovery score — but they arrived at very different hardware decisions to do it.</p>
              <p className="text-muted leading-relaxed mt-3">WHOOP is a screenless wristband (or bicep/waist band via accessories) that measures continuously, all day, and leans heavily into training load and strain quantification. It&apos;s built for people who want granular data on how hard they&apos;re pushing their body, not just how well they slept. Oura took the opposite bet: a ring, designed to be worn 24/7 without you noticing it, optimised primarily for sleep and overnight recovery signal rather than continuous daytime tracking.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">HRV & Recovery Accuracy</h2>
              <p className="text-muted leading-relaxed">Both devices use HRV (heart rate variability) as the backbone of their recovery scoring, but WHOOP samples HRV continuously throughout the day and night via its wrist-based sensor, while Oura primarily captures HRV overnight through the finger&apos;s more stable, motion-resistant signal.</p>
              <p className="text-muted leading-relaxed mt-3">In practice, finger-based PPG (photoplethysmography) sensors — what Oura uses — tend to produce cleaner HRV signal than wrist-based sensors, because the wrist is more prone to motion artifact and has lower blood perfusion. But WHOOP compensates with an algorithm heavily tuned on its large training-focused user base, and many athletes report its day-to-day recovery scores track subjective readiness closely. Neither is definitively &quot;more accurate&quot; in absolute clinical terms — both are consumer-grade, not medical-grade ECG.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Sleep Staging</h2>
              <p className="text-muted leading-relaxed">This is where Oura has the stronger published validation. Independent studies comparing Oura Ring sleep staging against polysomnography (PSG — the clinical gold standard, requiring an overnight sleep lab) have shown Oura performs among the best of any consumer wearable for distinguishing light, deep, and REM sleep stages.</p>
              <p className="text-muted leading-relaxed mt-3">WHOOP&apos;s sleep tracking is solid and has improved significantly across hardware generations, but it has less independent PSG validation data published relative to Oura, and WHOOP&apos;s core value proposition has always centered more on strain and recovery than sleep architecture specifically.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Training Load & Strain</h2>
              <p className="text-muted leading-relaxed">If you&apos;re a serious athlete tracking periodization, WHOOP&apos;s Strain metric is the more purpose-built tool. It quantifies cardiovascular load across an entire day — workouts, walking, stress — on a 0–21 scale, and pairs it directly against your recovery score to flag overtraining risk. This is the feature set that made WHOOP popular with professional and competitive athletes specifically.</p>
              <p className="text-muted leading-relaxed mt-3">Oura&apos;s Activity score covers similar ground but is less granular for structured training — it&apos;s built more for general activity and movement consistency than serious periodization.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Comfort, Wearability & Cost Structure</h2>
              <p className="text-muted leading-relaxed">Oura wins decisively on discretion and comfort for continuous wear — a ring disappears in a way a wristband doesn&apos;t, particularly for sleep, and its battery life (4–7 days) plus fast charging make gaps in data rare.</p>
              <p className="text-muted leading-relaxed mt-3">The cost structures also differ meaningfully. WHOOP bundles the hardware into its membership — you never &quot;buy&quot; the device outright, you pay $199/year and the band is included, which is attractive if you don&apos;t want a large upfront cost but means you&apos;re locked into ongoing payments to keep using the device at all. Oura requires a larger one-time hardware purchase ($299–$549 depending on finish) plus a smaller monthly subscription ($5.99–$9.99) for full feature access — more upfront cost, less ongoing.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Our Recommendation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Choose WHOOP if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['You train seriously and want detailed strain/load tracking', 'You prefer no upfront hardware cost', 'You want continuous, all-day HRV — not just overnight', 'You\'re comfortable wearing a band 24/7'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Choose Oura if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Sleep quality and architecture is your primary focus', 'You want the least intrusive wearable for 24/7 wear', 'You prefer owning the hardware outright', 'Longer battery life and faster charging matter to you'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/database?category=Fitness+Trackers+%26+HRV" className="flex items-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
              View Wearables Database <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/wearables/oura-ring-gen3-review" className="flex items-center gap-2 px-5 py-3 bg-surface border border-border text-ink rounded-xl font-semibold text-sm hover:border-green/40 transition-colors cursor-pointer">
              Read Full Oura Review
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
