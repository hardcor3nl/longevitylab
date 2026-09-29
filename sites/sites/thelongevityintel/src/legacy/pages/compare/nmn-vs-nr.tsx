import { AnimatedSection } from '@/components/AnimatedSection'
import { FaqSection } from '@/components/FaqSection'
import Link from 'next/link'
import { ArrowLeft, Check, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { getCompareFaqs } from '@/lib/faqs'
import { absoluteUrl, SITE } from '@/lib/site'

const pageUrl = absoluteUrl('/compare/nmn-vs-nr')

export const metadata: Metadata = {
  title: 'NMN vs NR: Human Evidence, Limits & Safety',
  description:
    'A source-linked comparison of NMN and NR human trials, studied populations, outcomes, safety limits, and unanswered longevity questions.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'NMN vs NR: Human Evidence and Limitations',
    description: 'What human trials show—and do not show—about two NAD+ precursors.',
    url: pageUrl,
    type: 'article',
    siteName: SITE.name,
  },
}

export default function NMNvsNRPage() {
  const faqs = getCompareFaqs('nmn-vs-nr')
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
          <h1 className="font-display text-5xl text-ink mb-4 leading-tight">NMN vs NR:<br />What Human Trials Actually Show</h1>
          <p className="text-muted text-lg mb-10 leading-relaxed">Both compounds can affect NAD+ metabolism in humans. The available trials do not establish that either extends lifespan, prevents disease, or is broadly superior.</p>

          {/* Quick verdict */}
          <div className="bg-green/5 border border-green/20 rounded-2xl p-6 mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Evidence Summary</p>
            <p className="text-ink font-medium text-lg">There is no evidence-based winner for longevity. Small, short-duration trials show changes in NAD+ metabolites and selected secondary outcomes, but clinically meaningful long-term benefits remain uncertain.</p>
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
                  ['Example studied dose', '250 mg/day for 10–12 weeks', '1,000 mg/day for 6 weeks'],
                  ['Human evidence sampled here', 'Prediabetic women; older adults', 'Healthy middle-aged and older adults'],
                  ['Consistent finding', 'Can alter circulating NAD+ metabolites', 'Can alter circulating NAD+ metabolites'],
                  ['Clinical outcomes', 'Mixed, population-specific signals', 'Exploratory and not consistently significant'],
                  ['Lifespan or disease prevention', 'Not established', 'Not established'],
                  ['Direct head-to-head outcome trial', 'None cited', 'None cited'],
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
              <p className="text-muted leading-relaxed">NMN (nicotinamide mononucleotide) and NR (nicotinamide riboside) enter NAD+ metabolism through related pathways. A change in a blood metabolite is a biological finding, not proof of longer life or better health.</p>
              <p className="text-muted leading-relaxed mt-3">The difference is in the pathway and the step at which each compound enters the NAD+ biosynthesis cascade.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">The Pathway Difference</h2>
              <p className="text-muted leading-relaxed">NR is converted through the salvage pathway before NAD+ synthesis; NMN also requires cellular processing. Being “one step closer” does not demonstrate superior absorption or clinical benefit. The comparison therefore has to rest on human outcomes, not pathway diagrams alone.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Evidence Table</h2>
              <p className="text-muted leading-relaxed mb-4">Sources checked 5 September 2026. This is a focused evidence sample, not a complete systematic review.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border"><th className="text-left py-3">Study</th><th className="text-left py-3">Population and design</th><th className="text-left py-3">Observed result</th><th className="text-left py-3">Important limit</th></tr></thead>
                  <tbody>
                    <tr className="border-b border-border"><td className="py-3 pr-3"><a href="https://pubmed.ncbi.nlm.nih.gov/33888596/" rel="noopener noreferrer" target="_blank">Yoshino 2021 (NMN)</a></td><td className="py-3 pr-3">Postmenopausal women with prediabetes; randomized, placebo-controlled; 250 mg/day, 10 weeks</td><td className="py-3 pr-3">Improved muscle insulin sensitivity in this population</td><td className="py-3">Small, specific population; not a lifespan or disease-prevention endpoint</td></tr>
                    <tr className="border-b border-border"><td className="py-3 pr-3"><a href="https://pubmed.ncbi.nlm.nih.gov/35927255/" rel="noopener noreferrer" target="_blank">Igarashi 2022 (NMN)</a></td><td className="py-3 pr-3">Healthy older men; randomized, double-blind, placebo-controlled; 250 mg/day, 6–12 weeks</td><td className="py-3 pr-3">Raised NAD+ metabolites; nominal gait and left-grip signals</td><td className="py-3">Authors call for larger validation; no body-composition effect</td></tr>
                    <tr className="border-b border-border"><td className="py-3 pr-3"><a href="https://pubmed.ncbi.nlm.nih.gov/38789831/" rel="noopener noreferrer" target="_blank">Sakuri 2024 (NMN)</a></td><td className="py-3 pr-3">60 older adults; randomized, double-blind, placebo-controlled; 250 mg/day, 12 weeks</td><td className="py-3 pr-3">No significant difference in the primary stepping outcome; selected secondary signals</td><td className="py-3">Secondary outcomes should not be treated as proof of broad functional benefit</td></tr>
                    <tr className="border-b border-border"><td className="py-3 pr-3"><a href="https://pubmed.ncbi.nlm.nih.gov/29599478/" rel="noopener noreferrer" target="_blank">Martens 2018 (NR)</a></td><td className="py-3 pr-3">24 healthy middle-aged and older adults; randomized double-blind crossover; 1,000 mg/day, two 6-week periods</td><td className="py-3 pr-3">Raised NAD+ metabolism and was well tolerated during the trial</td><td className="py-3">Exploratory blood-pressure findings were not significant after multiple-comparison correction</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">What This Comparison Cannot Answer</h2>
              <p className="text-muted leading-relaxed">The trials above are short and use different populations, doses, and endpoints. They do not support a direct efficacy ranking, and current retail prices do not resolve the evidence gap. Long-term safety, hard clinical outcomes, and independent head-to-head trials remain important unknowns.</p>
            </div>

            <div>
              <h2 className="font-display text-3xl text-ink mb-4">Decision Questions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green/5 border border-green/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Before considering NMN</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Check whether the study population resembles you', 'Separate metabolite changes from clinical benefit', 'Review medication and condition-specific risks with a clinician', 'Avoid assuming a higher dose is better'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-bright mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
                  <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Before considering NR</p>
                  <ul className="space-y-1.5 text-sm text-ink">
                    {['Check trial duration and funding disclosures', 'Do not equate NAD+ elevation with a health outcome', 'Compare the tested dose with the actual label', 'Discuss uncertainty with a qualified clinician'].map(item => (
                      <li key={item} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-amber mt-0.5 shrink-0" />{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/database/nmn" className="flex items-center gap-2 px-5 py-3 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
              Explore the NMN evidence card <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/supplements/best-nmn-supplements-2024" className="flex items-center gap-2 px-5 py-3 bg-surface border border-border text-ink rounded-xl font-semibold text-sm hover:border-green/40 transition-colors cursor-pointer">
              Read Full NMN Review
            </Link>
          </div>

          <FaqSection faqs={faqs} title="NMN vs NR FAQ" />
        </AnimatedSection>
      </div>
    </div>
  )
}
