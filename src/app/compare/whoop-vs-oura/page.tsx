import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight } from 'lucide-react'
import { FaqSection } from '@/components/FaqSection'
import { getCompareFaqs } from '@/lib/faqs'
import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'WHOOP 5.0 vs Oura Ring 4: Evidence & Cost (2026)',
  description: 'WHOOP 5.0 vs Oura Ring 4 compared for recovery, sleep, battery life, cost, and published validation—with no unsupported hands-on claims.',
  alternates: { canonical: absoluteUrl('/compare/whoop-vs-oura') },
}

export default function WhoopVsOuraPage() {
  const faqs = getCompareFaqs('whoop-vs-oura')
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
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">WHOOP 5.0 vs<br />Oura Ring 4</h1>
          <p className="text-muted text-lg mb-10 leading-relaxed">A documentation-based comparison of the current devices, checked September 7, 2026. Published validation helps set expectations, but it does not establish a current-generation head-to-head winner.</p>

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
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-green-bright">WHOOP 5.0</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-amber">Oura Ring 4</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Form factor', 'Wristband / bicep band (screenless)', 'Ring — worn on finger'],
                  ['Display', 'None — app only', 'None — app only'],
                  ['Hardware cost', 'Included with annual plan', 'From $349 one-time'],
                  ['Subscription', 'From $199/year', '$5.99/month or $69.99/year (US)'],
                  ['Claimed battery life', '14+ days', 'Typically 5–8 days'],
                  ['HRV use', 'Nightly recovery baseline', 'Overnight trends'],
                  ['Published validation', 'Earlier WHOOP models studied', 'Oura Gen3 studied'],
                  ['Recovery score', 'Whoop Recovery (HRV + RHR + sleep)', 'Oura Readiness (similar inputs)'],
                  ['Strain / training load', 'Whoop Strain — detailed, exercise-specific', 'Activity score — more general'],
                  ['Comfort for 24/7 wear', 'Good, some find band bulky for sleep', 'Excellent — least intrusive form factor'],
                  ['Water resistance', 'Confirm for chosen device/accessory', '100m'],
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
              <p className="text-muted leading-relaxed">WHOOP and Oura both turn heart rate, HRV, sleep, and activity data into proprietary scores, but their buying models and emphasis differ.</p>
              <p className="text-muted leading-relaxed mt-3">WHOOP 5.0 is a screenless wearable bundled with an annual membership and emphasizes strain, recovery, and coaching. Oura Ring 4 is purchased upfront and emphasizes sleep, readiness, stress, and a discreet ring form. Those are product-positioning differences—not proof that either score is a clinical diagnosis.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">HRV & Recovery Accuracy</h2>
              <p className="text-muted leading-relaxed">A 2021 validation study found acceptable agreement between an earlier WHOOP device and ECG-derived heart rate, while HRV precision required more cautious interpretation. The paper also reports a potential conflict: one researcher&apos;s position became WHOOP-sponsored after data collection.</p>
              <p className="text-muted leading-relaxed mt-3">That evidence does not validate every WHOOP 5.0 output or compare it directly with Oura Ring 4. Treat either device as a consistent personal trend tool; do not interchange its HRV values with ECG measurements or use a readiness score to diagnose illness.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Sleep Staging</h2>
              <p className="text-muted leading-relaxed">Oura Gen3 has published multi-night polysomnography validation. In a 2024 study of 96 generally healthy adults, global sleep measures showed good agreement, but Oura funded the work. A separate 2024 single-night study of 35 adults also found useful sleep-stage performance for Gen3.</p>
              <p className="text-muted leading-relaxed mt-3">WHOOP also has published sleep research, including a 2024 systematic review and a newer laboratory comparison of WHOOP 4.0 with PSG. Results across consumer wearables vary by metric, population, algorithm, placement, and study design. None of these papers is a direct WHOOP 5.0 versus Oura Ring 4 clinical trial.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Training Load & Strain</h2>
              <p className="text-muted leading-relaxed">If you&apos;re a serious athlete tracking periodization, WHOOP&apos;s Strain metric is the more purpose-built tool. It quantifies cardiovascular load across an entire day — workouts, walking, stress — on a 0–21 scale, and pairs it directly against your recovery score to flag overtraining risk. This is the feature set that made WHOOP popular with professional and competitive athletes specifically.</p>
              <p className="text-muted leading-relaxed mt-3">Oura&apos;s Activity score covers similar ground but is less granular for structured training — it&apos;s built more for general activity and movement consistency than serious periodization.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Comfort, Wearability & Cost Structure</h2>
              <p className="text-muted leading-relaxed">Comfort is personal: rings can be unobtrusive for sleep but inconvenient for lifting or for people whose finger size changes, while a band may suit training but occupies wrist space. Use the sizing/trial policies rather than assuming one form factor will disappear for everyone.</p>
              <p className="text-muted leading-relaxed mt-3">The cost structures differ meaningfully. WHOOP&apos;s official US plans currently start at $199 per year with WHOOP 5.0 included; Peak is $239 and Life with WHOOP MG is $359. Oura Ring 4 currently starts at $349, with US membership at $5.99 monthly or $69.99 annually after the included trial month. Prices and regional terms can change, so confirm them before purchase.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Our Recommendation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Choose WHOOP if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['You train seriously and want detailed strain/load tracking', 'You prefer the device bundled with a yearly plan', 'You want recovery coaching centered on training', 'You\'re comfortable wearing a band 24/7'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Choose Oura if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Sleep trends are your primary focus', 'You prefer a ring to a wristband', 'You prefer buying the hardware upfront', 'A lower ongoing US membership price matters to you'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Sources and Scope</h2>
              <p className="text-muted leading-relaxed">This page is a research comparison, not a hands-on test. Product specifications and US prices were checked September 7, 2026 against <a className="text-green hover:underline" href="https://www.whoop.com/us/en/membership/" target="_blank" rel="noreferrer">WHOOP membership details</a>, <a className="text-green hover:underline" href="https://support.ouraring.com/hc/en-us/articles/33045011508115-Oura-Ring-4" target="_blank" rel="noreferrer">Oura Ring 4 specifications</a>, and <a className="text-green hover:underline" href="https://ouraring.com/membership" target="_blank" rel="noreferrer">Oura membership pricing</a>.</p>
              <p className="text-muted leading-relaxed mt-3">Validation context comes from the <a className="text-green hover:underline" href="https://pubmed.ncbi.nlm.nih.gov/34065516/" target="_blank" rel="noreferrer">WHOOP HR/HRV study</a>, <a className="text-green hover:underline" href="https://pubmed.ncbi.nlm.nih.gov/38557808/" target="_blank" rel="noreferrer">WHOOP sleep systematic review</a>, <a className="text-green hover:underline" href="https://pubmed.ncbi.nlm.nih.gov/40303381/" target="_blank" rel="noreferrer">six-device PSG comparison</a>, <a className="text-green hover:underline" href="https://pubmed.ncbi.nlm.nih.gov/38382312/" target="_blank" rel="noreferrer">Oura Gen3 multi-night PSG study</a>, and <a className="text-green hover:underline" href="https://pubmed.ncbi.nlm.nih.gov/39460013/" target="_blank" rel="noreferrer">three-device PSG study</a>. Consumer wearables can support awareness and trend tracking, but they do not replace a sleep study, ECG, or clinician.</p>
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
          <FaqSection faqs={faqs} title="WHOOP vs Oura FAQ" />
        </AnimatedSection>
      </div>
    </div>
  )
}
