import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { BookOpen, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Biomarker Glossary — Longevity Terms Explained',
  description: 'Plain-English explanations of the biomarkers, tests, and scientific terms used in longevity medicine — HRV, ApoB, NAD+, VO2 max, and more.',
}

interface BiomarkerEntry {
  term: string
  category: string
  short: string
  optimal?: string
  why: string
  learnMore?: string
}

const biomarkers: BiomarkerEntry[] = [
  { term: 'ApoB', category: 'Cardiovascular', short: 'Apolipoprotein B — the best marker of cardiovascular risk', optimal: '<70 mg/dL (aggressive: <60)', why: 'Each LDL, VLDL, and Lp(a) particle carries exactly one ApoB protein. ApoB counts total atherogenic particle number, which predicts plaque formation far better than LDL-C alone. High LDL-C with low ApoB = relatively safe. Normal LDL-C with high ApoB = dangerous.', learnMore: '/diagnostics/best-at-home-blood-tests-2024' },
  { term: 'Lp(a)', category: 'Cardiovascular', short: 'Lipoprotein(a) — a genetically-determined cardiovascular risk factor', optimal: '<30 mg/dL or <75 nmol/L', why: "Lp(a) is largely genetic — you can't diet or exercise it away. It accelerates atherosclerosis and is found in ~20% of the population at elevated levels. Test once — it barely changes. High Lp(a) requires more aggressive LDL lowering as compensation." },
  { term: 'HRV', category: 'Recovery & Nervous System', short: 'Heart Rate Variability — a proxy for autonomic nervous system health', optimal: 'Highly individual — track your own trend', why: 'HRV measures the variation in time between heartbeats. Higher HRV = more adaptive ANS. It reflects recovery status, stress load, sleep quality, and training readiness. Declining HRV trend over weeks indicates cumulative stress or illness. Single values are less useful than 7-day rolling average.', learnMore: '/wearables/best-fitness-trackers-longevity' },
  { term: 'VO2 Max', category: 'Fitness & Longevity', short: 'Maximum oxygen uptake — the strongest single predictor of longevity', optimal: 'Top quartile for age/sex. Target: 50+ ml/kg/min for men, 45+ for women', why: 'VO2 max measures how efficiently your cardiorespiratory system delivers and uses oxygen. Each 1 MET increase in VO2 max reduces all-cause mortality by ~13%. Moving from "low" to "above average" VO2 max reduces mortality risk more than quitting smoking.', learnMore: '/protocols/longevity-exercise-protocol' },
  { term: 'NAD+', category: 'Cellular Health', short: 'Nicotinamide Adenine Dinucleotide — the cellular energy currency', why: 'NAD+ is required for mitochondrial energy production (ATP synthesis), DNA repair (via PARP), and sirtuin activation (longevity proteins). Levels decline ~50% by age 50. Supplementation with NMN or NR can restore levels.', learnMore: '/database/nmn' },
  { term: 'mTOR', category: 'Longevity Pathways', short: 'Mechanistic Target of Rapamycin — the growth vs. repair switch', why: 'mTOR activation = growth mode (build muscle, grow cells). mTOR inhibition = repair mode (autophagy, cellular maintenance). Rapamycin inhibits mTOR. Fasting inhibits mTOR. Caloric restriction inhibits mTOR. The longevity implication: chronic mTOR activation (excess calories, constant protein intake) may accelerate aging.' },
  { term: 'AMPK', category: 'Longevity Pathways', short: 'AMP-activated protein kinase — the cellular energy sensor', why: 'AMPK activates when energy is low (fasting, exercise). It inhibits mTOR, triggers autophagy, and improves insulin sensitivity. Metformin and berberine activate AMPK pharmacologically — it is one reason both are studied for longevity.' },
  { term: 'Autophagy', category: 'Cellular Health', short: 'Self-eating — cellular cleanup of damaged proteins and organelles', why: 'Autophagy is the process by which cells break down and recycle intracellular junk — damaged proteins, dysfunctional mitochondria, protein aggregates linked to neurodegeneration. It is activated by fasting, exercise, and caloric restriction. Declining autophagy with age is thought to contribute to neurodegenerative diseases.' },
  { term: 'Senescent Cells', category: 'Cellular Health', short: 'Zombie cells — old cells that stop dividing but refuse to die', why: 'Senescent cells secrete inflammatory cytokines (SASP — senescence-associated secretory phenotype) that damage surrounding tissue. They accumulate with age. Senolytics (quercetin, fisetin, dasatinib) selectively kill them. Clearance of senescent cells extends healthspan in mouse models dramatically.', learnMore: '/database/quercetin' },
  { term: 'Insulin Resistance', category: 'Metabolic Health', short: 'Reduced cellular response to insulin — a core driver of metabolic aging', optimal: 'Fasting insulin <6 µIU/mL; HOMA-IR <1.5', why: "Insulin resistance develops when cells stop responding normally to insulin, requiring ever-higher insulin levels to manage blood glucose. It underlies type 2 diabetes, cardiovascular disease, NAFLD, and is increasingly linked to Alzheimer's (sometimes called \"type 3 diabetes\")." },
  { term: 'hsCRP', category: 'Inflammation', short: 'High-sensitivity C-reactive protein — marker of systemic inflammation', optimal: '<0.5 mg/L (optimal); <1 mg/L (acceptable)', why: 'CRP is produced by the liver in response to inflammation. Chronic low-grade elevation — even within "normal" ranges — predicts cardiovascular events, cancer, and cognitive decline. Diet (Mediterranean pattern), exercise, and sleep are the strongest reducers.' },
  { term: 'Homocysteine', category: 'Cardiovascular', short: 'An amino acid marker linked to B-vitamin status and cardiovascular risk', optimal: '<7 µmol/L', why: 'Elevated homocysteine damages arterial walls and is an independent cardiovascular risk factor. It is elevated by B12, B6, and folate deficiency. Easily corrected with B-complex supplementation. Often overlooked on standard panels.' },
  { term: 'Zone 2', category: 'Exercise Physiology', short: 'Aerobic exercise at lactate threshold 1 — the foundation of longevity training', why: 'Zone 2 training (conversational pace, fat-burning zone) maximises mitochondrial biogenesis, builds the aerobic base, and improves metabolic flexibility. 3–4 hours/week is the target. It is the training zone most associated with longevity benefits in elite athletes and general populations.', learnMore: '/protocols/longevity-exercise-protocol' },
  { term: 'BDNF', category: 'Cognitive Health', short: "Brain-derived neurotrophic factor — the brain's growth hormone", why: 'BDNF promotes neuroplasticity, protects neurons from death, and is essential for learning and memory. Exercise (especially aerobic) is the most potent BDNF stimulator known. Low BDNF is associated with depression and neurodegeneration. Sauna and cold exposure also increase BDNF.' },
  { term: 'Telomeres', category: 'Cellular Health', short: 'Protective chromosome caps that shorten with age', why: 'Telomeres are repeated DNA sequences at chromosome ends that protect against degradation. They shorten with each cell division and with oxidative stress, chronic inflammation, and poor lifestyle. Short telomeres = accelerated cellular aging. Exercise, sleep, and stress management preserve telomere length.' },
  { term: 'Fasting Insulin', category: 'Metabolic Health', short: 'Insulin level after an overnight fast — an early marker of metabolic dysfunction', optimal: '<6 µIU/mL (ideally <4)', why: "Fasting insulin is the most sensitive early marker of insulin resistance — often elevated for decades before fasting glucose rises. Most standard panels don't include it. Chronically elevated insulin drives fat storage, inflammation, and metabolic disease." },
]

const categories = Array.from(new Set(biomarkers.map(b => b.category)))

const categoryColor: Record<string, string> = {
  'Cardiovascular': 'text-red-400 bg-red-500/10 border-red-500/20',
  'Recovery & Nervous System': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Fitness & Longevity': 'text-green-bright bg-green/10 border-green/20',
  'Cellular Health': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Longevity Pathways': 'text-amber bg-amber/10 border-amber/20',
  'Metabolic Health': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Inflammation': 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  'Exercise Physiology': 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  'Cognitive Health': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
}

export default function GlossaryPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-green-bright" />
            <span className="font-mono text-xs uppercase tracking-widest text-green-bright">Reference</span>
          </div>
          <h1 className="font-display text-5xl text-ink mb-4">Biomarker Glossary</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Plain-English explanations of {biomarkers.length} biomarkers, tests, and scientific terms used in longevity medicine.
            No jargon, no fluff — just what you need to know and why it matters.
          </p>
        </AnimatedSection>

        {/* Category index */}
        <AnimatedSection delay={0.1} className="mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <a key={cat} href={`#${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className={`font-mono text-[10px] uppercase tracking-wider border px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${categoryColor[cat] ?? 'text-muted bg-surface border-border'}`}>
                {cat}
              </a>
            ))}
          </div>
        </AnimatedSection>

        {/* Grouped entries */}
        {categories.map((cat, ci) => (
          <AnimatedSection key={cat} delay={ci * 0.05} className="mb-12">
            <div id={cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider border px-2.5 py-1 rounded-full mb-5 ${categoryColor[cat] ?? 'text-muted bg-surface border-border'}`}>
              {cat}
            </div>
            <div className="space-y-4">
              {biomarkers.filter(b => b.category === cat).map(entry => (
                <div key={entry.term} className="bg-surface border border-border rounded-2xl p-5 hover:border-green/25 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h2 className="font-display text-2xl text-ink">{entry.term}</h2>
                      <p className="text-sm text-muted italic mt-0.5">{entry.short}</p>
                    </div>
                    {entry.optimal && (
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-0.5">Optimal</p>
                        <p className="font-mono text-xs text-green-bright font-medium">{entry.optimal}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-ink text-sm leading-relaxed mt-3">{entry.why}</p>
                  {entry.learnMore && (
                    <Link href={entry.learnMore}
                      className="inline-flex items-center gap-1 mt-3 text-xs text-green-bright hover:text-green transition-colors font-medium cursor-pointer">
                      Deep dive <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
