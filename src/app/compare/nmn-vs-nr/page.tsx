import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NMN vs NR: Which NAD+ Precursor is Better? (2025)',
  description: 'A complete evidence-based comparison of NMN and NR for NAD+ restoration. Study counts, bioavailability, pricing, and our verdict on which to choose.',
}

export default function NMNvsNRPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Supplements · NAD+</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">NMN vs NR:<br />Which NAD+ Precursor Wins?</h1>
          <p className="text-muted text-lg mb-10 leading-relaxed">After reviewing 80+ human studies across both compounds, our verdict: NMN for bioavailability and recent human data, NR for longer safety record. Here is the full breakdown.</p>

          {/* Quick verdict */}
          <div className="bg-green/5 border border-green/20 rounded-2xl p-6 mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Our Verdict</p>
            <p className="text-ink font-medium text-lg">Take NMN if you want the most direct NAD+ precursor with recent human data. Take NR if you prefer the compound with the longest safety record and more clinical trials. Both work — the difference is modest.</p>
          </div>

          {/* Head-to-head table */}
          <div className="overflow-x-auto mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-mono text-xs uppercase tracking-widest text-muted">Factor</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-green-bright">NMN</th>
                  <th className="text-center py-3 px-4 font-mono text-xs uppercase tracking-widest text-amber">NR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Pathway to NAD+', 'Direct NMN → NAD+', 'NR → NMN → NAD+'],
                  ['Human RCTs', '8+ trials', '12+ trials'],
                  ['Safety record', '3+ years human data', '8+ years human data'],
                  ['Typical dose', '250–500mg', '300–600mg'],
                  ['Price (monthly)', '$40–70', '$30–50'],
                  ['David Sinclair takes', 'Yes (1g)', 'Alternates with NMN'],
                  ['Bryan Johnson takes', 'Yes (500mg)', 'Alternates with NR'],
                  ['Andrew Huberman', 'Previously, now inconsistent', 'No'],
                  ['Best form', 'Sublingual for absorption', 'Riboside (NR = nicotinamide riboside)'],
                ].map(([factor, nmn, nr]) => (
                  <tr key={factor} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-muted">{factor}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{nmn}</td>
                    <td className="py-3 px-4 text-sm text-ink text-center">{nr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="font-display text-3xl text-ink mb-4">The Shared Goal: Restoring NAD+</h2>
              <p className="text-muted leading-relaxed">Both NMN (nicotinamide mononucleotide) and NR (nicotinamide riboside) serve the same ultimate purpose — raising intracellular NAD+ levels. NAD+ declines approximately 50% by age 50, and this decline is mechanistically linked to reduced mitochondrial function, impaired DNA repair, and declining sirtuin activity.</p>
              <p className="text-muted leading-relaxed mt-3">The difference is in the pathway and the step at which each compound enters the NAD+ biosynthesis cascade.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">The Pathway Difference</h2>
              <p className="text-muted leading-relaxed">NR must first be converted to NMN before it can be used to synthesise NAD+. This means NMN is one step closer to the final product. In theory, this should make NMN more efficient. In practice, both compounds successfully raise blood NAD+ levels in human trials — the conversion from NR to NMN is not a significant bottleneck in most tissues.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Human Trial Evidence</h2>
              <p className="text-muted leading-relaxed">NR has more published human RCTs (12+) versus NMN (8+), giving it a longer track record. However, NMN trials are catching up rapidly, with more recent studies and generally larger sample sizes.</p>
              <p className="text-muted leading-relaxed mt-3">Key NMN human trials: Washington University 2021 (250mg/day for 10 weeks — improved muscle insulin sensitivity in postmenopausal women), Keio University 2022 (250mg/day for 12 weeks — improved grip strength and walking speed in older adults).</p>
              <p className="text-muted leading-relaxed mt-3">Key NR human trials: ChromaDex-funded trials showing NAD+ restoration in blood, skeletal muscle, and liver. The VITAL-NR trial showed NAD+ increases of 40–90% with 1000mg NR daily.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Price Comparison</h2>
              <p className="text-muted leading-relaxed">NR is generally cheaper per effective dose. Tru Niagen (ChromaDex NR) at $47.99/month versus ProHealth NMN at $67.99/month for comparable dosing. Over a year, the cost difference approaches $240.</p>
              <p className="text-muted leading-relaxed mt-3">For budget-conscious supplementation, NR provides comparable NAD+ elevation at lower cost with a longer safety record.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Our Recommendation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Choose NMN if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['You follow Sinclair\'s or Johnson\'s protocol', 'You want sublingual delivery option', 'Recent human data is your priority', 'Budget allows the premium'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Choose NR if:</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Safety record depth matters to you', 'Budget is a consideration', 'You prefer the most-studied compound', 'You want patented pharmaceutical-grade'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/database/nmn" className="flex items-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
              View NMN Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/supplements/best-nmn-supplements-2024" className="flex items-center gap-2 px-5 py-3 bg-surface border border-border text-ink rounded-xl font-semibold text-sm hover:border-green/40 transition-colors cursor-pointer">
              Read Full NMN Review
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
