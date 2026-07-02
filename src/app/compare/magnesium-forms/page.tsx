import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Magnesium Glycinate vs L-Threonate vs Malate: Which Form Wins? (2026)',
  description: 'The form of magnesium matters enormously for absorption and effect. Full evidence-based comparison of glycinate, L-threonate, and malate — which one for sleep, which for cognition, which for energy.',
}

export default function MagnesiumFormsPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Supplements · Minerals</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">Magnesium Glycinate vs<br />L-Threonate vs Malate</h1>
          <p className="text-muted text-lg mb-10 leading-relaxed">Magnesium is magnesium — except the compound it&apos;s bound to changes absorption, tolerability, and where in the body it concentrates. Picking the wrong form for your goal means paying for an effect you won&apos;t get.</p>

          {/* Quick verdict */}
          <div className="bg-green/5 border border-green/20 rounded-2xl p-6 mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Our Verdict</p>
            <p className="text-ink font-medium text-lg">There is no single &quot;best&quot; form — the right choice depends entirely on your goal. Glycinate for sleep and general repletion (best absorption, calming, gentle on the gut). L-Threonate for cognitive support specifically (the only form with published evidence of meaningfully crossing the blood-brain barrier). Malate for daytime energy and muscle-related complaints (paired with malic acid, involved in ATP production).</p>
          </div>

          {/* Head-to-head table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-widest text-muted">Factor</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-green-bright">Glycinate</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-amber">L-Threonate</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-blue-500">Malate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Primary use case', 'Sleep, relaxation, general repletion', 'Cognitive function, memory', 'Energy, muscle aches, fibromyalgia symptoms'],
                  ['Elemental Mg per dose', 'Moderate (~14%)', 'Low (~7–8%)', 'Moderate (~15%)'],
                  ['Absorption', 'High — chelated, gentle on gut', 'High for brain tissue specifically', 'Good — well tolerated'],
                  ['GI side effects', 'Minimal — least likely to cause loose stools', 'Minimal', 'Low, some report mild energizing effect'],
                  ['Blood-brain barrier evidence', 'Limited', 'Strongest published evidence of any form', 'Not specifically studied'],
                  ['Timing', 'Evening — sedating, glycine itself calms', 'Flexible — daytime or evening', 'Morning/daytime — can feel activating'],
                  ['Typical dose', '200–400mg elemental', '144mg elemental (per Magtein-branded studies)', '200–400mg elemental'],
                  ['Cost per effective dose', 'Low', 'High — patented Magtein form is pricier', 'Low–moderate'],
                ].map(([factor, gly, thr, mal]) => (
                  <tr key={factor} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-muted">{factor}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{gly}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{thr}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{mal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Why the Form Matters</h2>
              <p className="text-muted leading-relaxed">Magnesium is never sold as pure elemental magnesium — it&apos;s unstable and poorly absorbed on its own, so it&apos;s always bound (&quot;chelated&quot;) to another compound that determines how well it&apos;s absorbed, how it&apos;s tolerated, and in some cases, where in the body it preferentially ends up. This is why two supplements both labeled &quot;magnesium&quot; can produce meaningfully different effects.</p>
              <p className="text-muted leading-relaxed mt-3">Cheaper forms like magnesium oxide have poor bioavailability (roughly 4% absorption) and are primarily useful as a laxative rather than for systemic repletion — worth avoiding if your goal is actually raising magnesium status. The three forms compared here — glycinate, L-threonate, and malate — are the ones with the strongest evidence for specific longevity-relevant use cases.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Magnesium Glycinate: The Default Choice</h2>
              <p className="text-muted leading-relaxed">Magnesium bound to glycine (an amino acid with its own calming, GABA-supportive properties) is widely considered the best general-purpose form. It&apos;s well absorbed, gentle on the digestive system compared to forms like citrate or oxide, and the glycine component itself has independent evidence for improving sleep quality — making the combination particularly well suited to evening use.</p>
              <p className="text-muted leading-relaxed mt-3">If you&apos;re simply trying to address a magnesium deficiency (extremely common — a majority of adults don&apos;t meet recommended intake) or want general support for sleep, muscle relaxation, and stress, glycinate is the reasonable default.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Magnesium L-Threonate: The Cognitive Specialist</h2>
              <p className="text-muted leading-relaxed">L-threonate is a newer, patented form (branded as Magtein) developed specifically because most magnesium forms don&apos;t effectively cross the blood-brain barrier. Animal studies — and a small but growing body of human research — show L-threonate meaningfully raises magnesium concentration in cerebrospinal fluid, an effect not replicated by other common forms at comparable doses.</p>
              <p className="text-muted leading-relaxed mt-3">This makes it the form of choice specifically for cognitive goals — working memory, executive function, and age-related cognitive decline — rather than general repletion. It delivers less elemental magnesium per dose than other forms, so it&apos;s not the most efficient choice if your only goal is raising overall magnesium status.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Magnesium Malate: The Energy Form</h2>
              <p className="text-muted leading-relaxed">Magnesium bound to malic acid — a compound directly involved in the Krebs cycle (the mitochondrial pathway that produces cellular energy) — has particular research interest in fibromyalgia and chronic fatigue populations, where it has shown modest benefit for muscle pain and energy levels in small trials.</p>
              <p className="text-muted leading-relaxed mt-3">Some users report malate feels mildly &quot;activating&quot; compared to the more sedating glycinate, making it a better fit for daytime dosing if you&apos;re not looking for a sleep aid.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Can You Stack Forms?</h2>
              <p className="text-muted leading-relaxed">Yes — and it&apos;s a common approach among people optimizing for multiple goals. A typical stack might use glycinate in the evening for sleep and a smaller L-threonate dose earlier in the day for cognitive support. Just be mindful of total elemental magnesium across all sources (including diet) — the tolerable upper limit for supplemental magnesium is generally cited around 350mg/day, though this is a conservative regulatory threshold and individual tolerance varies.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Our Recommendation</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Choose Glycinate if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Sleep or general repletion is the goal', 'You want the best value per dose', 'GI tolerance matters to you'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Choose L-Threonate if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Cognitive function is your primary goal', 'You want the form with brain-specific evidence', 'Budget allows the premium price'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-blue-500 mb-2">Choose Malate if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Daytime energy is the goal', 'You experience muscle aches or fatigue', 'You want an alternative to sedating glycinate'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/database/magnesium" className="flex items-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
              View Magnesium Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/database?category=Vitamins+%26+Minerals" className="flex items-center gap-2 px-5 py-3 bg-surface border border-border text-ink rounded-xl font-semibold text-sm hover:border-green/40 transition-colors cursor-pointer">
              Browse Supplement Database
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
