import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creatine vs HMB: Which Anti-Sarcopenic Supplement Wins? (2026)',
  description: 'A complete evidence-based comparison of creatine monohydrate and HMB for preserving muscle mass with age. Study counts, mechanisms, pricing, and our verdict.',
}

export default function CreatineVsHMBPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Supplements · Sarcopenia</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">Creatine vs HMB:<br />Best for Muscle Longevity?</h1>
          <p className="text-muted text-lg mb-10 leading-relaxed">Sarcopenia — age-related muscle loss — is one of the strongest predictors of mortality and frailty in older adults. Creatine and HMB are the two most-studied supplements for preserving muscle mass with age. Here&apos;s how the evidence actually compares.</p>

          {/* Quick verdict */}
          <div className="bg-green/5 border border-green/20 rounded-2xl p-6 mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Our Verdict</p>
            <p className="text-ink font-medium text-lg">Creatine. It has an overwhelmingly larger and more consistent evidence base (500+ studies vs a few dozen for HMB), works synergistically with resistance training, costs a fraction of HMB per effective dose, and has additional cognitive and bone-density benefits HMB doesn&apos;t show. HMB has a real but narrower niche — primarily in clinical populations already experiencing significant muscle wasting.</p>
          </div>

          {/* Head-to-head table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-widest text-muted">Factor</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-green-bright">Creatine</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-amber">HMB</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Total published studies', '500+', '~40–60'],
                  ['Mechanism', 'ATP/phosphocreatine energy buffering', 'Inhibits muscle protein breakdown (anti-catabolic)'],
                  ['Best evidence in', 'Healthy adults + resistance training', 'Bed rest, illness, clinical muscle wasting'],
                  ['Effect without exercise', 'Minimal', 'Modest — can reduce muscle loss during inactivity'],
                  ['Typical dose', '3–5g/day', '3g/day (as CaHMB)'],
                  ['Monthly cost', '$8–15', '$25–40'],
                  ['Cognitive benefits', 'Emerging evidence (working memory, fatigue resistance)', 'None established'],
                  ['Bone density evidence', 'Some positive signal', 'None established'],
                  ['Water retention side effect', 'Common, intracellular (not bloating)', 'None'],
                  ['Best for', 'Anyone strength training — the default choice', 'Bedridden, post-surgical, or severely deconditioned individuals'],
                ].map(([factor, creatine, hmb]) => (
                  <tr key={factor} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-muted">{factor}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{creatine}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{hmb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Why Muscle Mass Matters for Longevity</h2>
              <p className="text-muted leading-relaxed">Sarcopenia — the progressive loss of skeletal muscle mass and strength with age — begins as early as your 30s and accelerates after 60. It&apos;s not a cosmetic concern: low muscle mass is independently associated with higher all-cause mortality, increased fall risk, longer hospital stays, and reduced metabolic health, since skeletal muscle is the body&apos;s largest glucose disposal site.</p>
              <p className="text-muted leading-relaxed mt-3">Creatine and HMB (beta-hydroxy beta-methylbutyrate, a leucine metabolite) are the two supplements with the most research specifically targeting muscle preservation with age — but they work through different mechanisms and have very different evidence depths.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Creatine: The Deepest Evidence Base in Sports Science</h2>
              <p className="text-muted leading-relaxed">Creatine monohydrate is arguably the single most well-studied supplement in existence, with over 500 published trials spanning strength, power, cognitive function, and — increasingly — healthy aging. It works by replenishing phosphocreatine stores in muscle, which buffers ATP availability during high-intensity effort, allowing for more total training volume and faster recovery between sets.</p>
              <p className="text-muted leading-relaxed mt-3">For older adults specifically, meta-analyses combining creatine supplementation with resistance training show meaningfully greater gains in lean mass and strength than resistance training alone. Critically, creatine&apos;s benefit for muscle is contingent on training — it is not a passive muscle-preservation compound the way HMB can be in bedridden populations.</p>
              <p className="text-muted leading-relaxed mt-3">Emerging research also points to cognitive benefits (particularly under conditions of sleep deprivation or mental fatigue) and preliminary signal for bone mineral density — benefits with no HMB equivalent.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">HMB: Narrower But Real Clinical Niche</h2>
              <p className="text-muted leading-relaxed">HMB is a metabolite of the amino acid leucine, and its primary mechanism is anti-catabolic — it appears to inhibit the breakdown of muscle protein rather than stimulating new muscle synthesis the way creatine indirectly does via improved training capacity.</p>
              <p className="text-muted leading-relaxed mt-3">This mechanism makes HMB particularly interesting in situations where resistance training isn&apos;t possible: bed rest, post-surgical recovery, illness-related muscle wasting, or severe deconditioning in frail older adults. Several trials in these clinical populations show HMB meaningfully slows muscle loss during forced inactivity — a scenario where creatine, which depends on training stimulus to show its main benefits, offers less.</p>
              <p className="text-muted leading-relaxed mt-3">Outside of these clinical contexts — i.e., for a healthy, training adult — HMB&apos;s evidence for adding benefit on top of resistance training and adequate protein intake is much weaker and less consistent than creatine&apos;s.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Cost & Practical Considerations</h2>
              <p className="text-muted leading-relaxed">Creatine is remarkably inexpensive for its effect size — generic creatine monohydrate costs $8–15/month at the standard 5g daily dose. HMB runs $25–40/month at typical clinical doses (3g/day as calcium HMB), roughly 2–4x the cost for a narrower evidence base in a healthy population.</p>
              <p className="text-muted leading-relaxed mt-3">Creatine also has a decades-long safety record with no evidence of kidney harm in healthy individuals — a myth that continues to circulate despite being repeatedly debunked in the literature. The main side effect is a small amount of intracellular water retention, not the &quot;bloating&quot; often assumed.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Our Recommendation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Choose creatine if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['You are resistance training regularly', 'You want the most evidence-backed option', 'Budget matters', 'You want potential cognitive benefits too'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Choose HMB if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['You are bedridden, post-surgical, or unable to train', 'You are a frail older adult at high sarcopenia risk', 'A physician has recommended it clinically', 'You want it alongside — not instead of — creatine'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-muted leading-relaxed mt-4">For most healthy adults focused on longevity, creatine is the clear default — and the two aren&apos;t mutually exclusive if you want to stack HMB during a period of forced inactivity (illness, injury recovery).</p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/database/creatine" className="flex items-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
              View Creatine Products <ArrowRight className="w-4 h-4" />
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
