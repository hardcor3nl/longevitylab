export type EvidenceLevel = 'Strong' | 'Moderate' | 'Emerging' | 'Weak'
export type Goal = 'Longevity' | 'Energy' | 'Sleep' | 'Cognitive' | 'Cardiovascular' | 'Recovery' | 'Inflammation'
export type Category = 'NAD+ Precursors' | 'Antioxidants' | 'Adaptogens' | 'Omega Fatty Acids' | 'Hormones' | 'Vitamins & Minerals' | 'Peptides' | 'Mitochondrial'

export interface Supplement {
  id: string
  name: string
  aliases: string[]
  category: Category
  goals: Goal[]
  evidenceLevel: EvidenceLevel
  evidenceScore: number // 0-100
  safetyScore: number // 0-100
  popularityScore: number // 0-100
  summary: string
  mechanism: string
  dosage: string
  timing: string
  stacksWith: string[]
  avoid: string[]
  studyCount: number
  affiliateUrl?: string
  reviewSlug?: string
  image?: string
}

export const supplements: Supplement[] = [
  {
    id: 'nmn',
    name: 'NMN',
    aliases: ['Nicotinamide Mononucleotide', 'Beta-NMN'],
    category: 'NAD+ Precursors',
    goals: ['Longevity', 'Energy', 'Cognitive'],
    evidenceLevel: 'Moderate',
    evidenceScore: 72,
    safetyScore: 92,
    popularityScore: 95,
    summary: 'A direct NAD+ precursor that restores declining NAD+ levels with age. Strong mechanistic data, growing human trial evidence.',
    mechanism: 'Converts to NAD+ via the Preiss-Handler pathway. NAD+ is essential for sirtuins, PARP DNA repair, and mitochondrial energy production.',
    dosage: '250–500mg/day',
    timing: 'Morning with or without food',
    stacksWith: ['resveratrol', 'tmg', 'coq10'],
    avoid: [],
    studyCount: 42,
    affiliateUrl: '/go/prohealth-nmn',
    reviewSlug: 'supplements/best-nmn-supplements-2024',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
  },
  {
    id: 'nr',
    name: 'NR',
    aliases: ['Nicotinamide Riboside', 'Niagen'],
    category: 'NAD+ Precursors',
    goals: ['Longevity', 'Energy'],
    evidenceLevel: 'Moderate',
    evidenceScore: 69,
    safetyScore: 95,
    popularityScore: 88,
    summary: 'An alternative NAD+ precursor with more human trial data than NMN. Well-tolerated with strong safety profile.',
    mechanism: 'Converts to NMN then NAD+ via the salvage pathway. Increases NAD+ in blood and tissues.',
    dosage: '300–600mg/day',
    timing: 'Morning',
    stacksWith: ['resveratrol', 'pterostilbene'],
    avoid: [],
    studyCount: 38,
    affiliateUrl: '/go/tru-niagen',
  },
  {
    id: 'resveratrol',
    name: 'Resveratrol',
    aliases: ['Trans-resveratrol', 'RSV'],
    category: 'Antioxidants',
    goals: ['Longevity', 'Cardiovascular', 'Inflammation'],
    evidenceLevel: 'Emerging',
    evidenceScore: 58,
    safetyScore: 88,
    popularityScore: 82,
    summary: 'A polyphenol that activates sirtuins (SIRT1). Famous from David Sinclair\'s research. Human data more mixed than animal studies.',
    mechanism: 'Activates SIRT1 and AMPK. Mimics some effects of caloric restriction. Anti-inflammatory via NF-κB inhibition.',
    dosage: '500mg–1g/day',
    timing: 'With a fatty meal for absorption',
    stacksWith: ['nmn', 'nr', 'quercetin'],
    avoid: ['blood-thinners'],
    studyCount: 127,
    affiliateUrl: '/go/resveratrol',
  },
  {
    id: 'omega3',
    name: 'Omega-3 (EPA/DHA)',
    aliases: ['Fish Oil', 'EPA', 'DHA', 'Marine Omega-3'],
    category: 'Omega Fatty Acids',
    goals: ['Cardiovascular', 'Inflammation', 'Cognitive', 'Longevity'],
    evidenceLevel: 'Strong',
    evidenceScore: 88,
    safetyScore: 95,
    popularityScore: 97,
    summary: 'The best-evidenced longevity supplement. Reduces cardiovascular mortality, systemic inflammation, and supports brain health.',
    mechanism: 'Incorporated into cell membranes, reduces pro-inflammatory eicosanoids (PGE2, LTB4), activates anti-inflammatory resolvins.',
    dosage: '1–4g EPA+DHA daily',
    timing: 'With meals',
    stacksWith: ['vitamin-d', 'magnesium'],
    avoid: [],
    studyCount: 843,
    affiliateUrl: '/go/carlson-omega3',
    reviewSlug: 'supplements/best-omega-3-fish-oil',
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D3',
    aliases: ['Cholecalciferol', 'Vitamin D', 'D3'],
    category: 'Vitamins & Minerals',
    goals: ['Longevity', 'Cardiovascular', 'Inflammation'],
    evidenceLevel: 'Strong',
    evidenceScore: 84,
    safetyScore: 90,
    popularityScore: 96,
    summary: 'Deficiency is endemic (>40% of Western adults) and associated with higher all-cause mortality. Supplementation corrects deficiency effectively.',
    mechanism: 'Nuclear receptor activation regulates 200+ genes. Regulates calcium metabolism, immune function, and cellular differentiation.',
    dosage: '2,000–5,000 IU/day (test first)',
    timing: 'With a fatty meal',
    stacksWith: ['vitamin-k2', 'omega3', 'magnesium'],
    avoid: [],
    studyCount: 612,
    affiliateUrl: '/go/thorne-d3k2',
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    aliases: ['Magnesium Glycinate', 'Magnesium L-Threonate', 'Magnesium Malate'],
    category: 'Vitamins & Minerals',
    goals: ['Sleep', 'Cardiovascular', 'Recovery', 'Cognitive'],
    evidenceLevel: 'Strong',
    evidenceScore: 82,
    safetyScore: 97,
    popularityScore: 91,
    summary: 'Required for 300+ enzymatic reactions. Deficiency is common and linked to poor sleep, muscle cramps, and cardiovascular risk.',
    mechanism: 'Cofactor for ATP production, DNA repair, protein synthesis. Modulates NMDA receptors (cognitive) and regulates circadian rhythms.',
    dosage: '200–400mg elemental magnesium',
    timing: 'Evening (supports sleep)',
    stacksWith: ['vitamin-d', 'zinc', 'taurine'],
    avoid: [],
    studyCount: 289,
    affiliateUrl: '/go/pure-mag-glycinate',
  },
  {
    id: 'coq10',
    name: 'CoQ10',
    aliases: ['Ubiquinol', 'Ubiquinone', 'Coenzyme Q10'],
    category: 'Mitochondrial',
    goals: ['Energy', 'Cardiovascular', 'Longevity'],
    evidenceLevel: 'Moderate',
    evidenceScore: 74,
    safetyScore: 96,
    popularityScore: 85,
    summary: 'Essential for mitochondrial electron transport chain. Levels decline with age and are depleted by statins. Ubiquinol form has better absorption.',
    mechanism: 'Electron carrier in complexes I-III of the mitochondrial respiratory chain. Also a potent lipid-soluble antioxidant.',
    dosage: '100–300mg/day (ubiquinol preferred)',
    timing: 'With a fatty meal',
    stacksWith: ['nmn', 'pqq', 'alpha-lipoic-acid'],
    avoid: [],
    studyCount: 156,
    affiliateUrl: '/go/jarrow-ubiquinol',
  },
  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    aliases: ['Withania somnifera', 'KSM-66', 'Sensoril'],
    category: 'Adaptogens',
    goals: ['Sleep', 'Recovery', 'Cognitive', 'Energy'],
    evidenceLevel: 'Moderate',
    evidenceScore: 71,
    safetyScore: 88,
    popularityScore: 90,
    summary: 'The best-evidenced adaptogen. Reduces cortisol, improves sleep quality, and supports thyroid function. KSM-66 extract has the best data.',
    mechanism: 'Withanolides modulate cortisol via HPA axis downregulation. GABA-mimetic effects on sleep. Possible thyroid hormone potentiation.',
    dosage: '300–600mg KSM-66 extract',
    timing: 'Evening (or split AM/PM)',
    stacksWith: ['magnesium', 'l-theanine'],
    avoid: ['thyroid-medication'],
    studyCount: 67,
    affiliateUrl: '/go/ksm66-ashwagandha',
  },
  {
    id: 'creatine',
    name: 'Creatine',
    aliases: ['Creatine Monohydrate'],
    category: 'Mitochondrial',
    goals: ['Energy', 'Cognitive', 'Recovery', 'Longevity'],
    evidenceLevel: 'Strong',
    evidenceScore: 91,
    safetyScore: 98,
    popularityScore: 93,
    summary: 'The most evidence-backed performance supplement. Increasingly recognised for cognitive benefits and longevity effects beyond muscle.',
    mechanism: 'Regenerates ATP via phosphocreatine system. Increases PCr stores in muscle and brain. Neuroprotective at multiple targets.',
    dosage: '3–5g/day (no loading needed)',
    timing: 'Anytime — consistency matters more than timing',
    stacksWith: ['vitamin-d', 'omega3'],
    avoid: [],
    studyCount: 500,
    affiliateUrl: '/go/thorne-creatine',
  },
  {
    id: 'berberine',
    name: 'Berberine',
    aliases: ['Berberine HCl'],
    category: 'Mitochondrial',
    goals: ['Longevity', 'Cardiovascular', 'Energy'],
    evidenceLevel: 'Moderate',
    evidenceScore: 76,
    safetyScore: 80,
    popularityScore: 84,
    summary: 'Often called "natural metformin". Activates AMPK, improves insulin sensitivity, and has demonstrated cardiovascular benefits in multiple RCTs.',
    mechanism: 'AMPK activator → mimics caloric restriction signalling. Modulates gut microbiome. Inhibits PTP1B (insulin sensitisation).',
    dosage: '500mg 2–3x/day with meals',
    timing: 'With meals (GI tolerance)',
    stacksWith: ['nmn', 'resveratrol'],
    avoid: ['metformin', 'blood-sugar-medications'],
    studyCount: 89,
    affiliateUrl: '/go/thorne-berberine',
  },
  {
    id: 'quercetin',
    name: 'Quercetin',
    aliases: ['Quercetin Phytosome', 'Quercetin + Bromelain'],
    category: 'Antioxidants',
    goals: ['Longevity', 'Inflammation', 'Cardiovascular'],
    evidenceLevel: 'Emerging',
    evidenceScore: 62,
    safetyScore: 92,
    popularityScore: 76,
    summary: 'A senolytic flavonoid that clears senescent ("zombie") cells. Typically used in pulsed protocols rather than daily. Often stacked with dasatinib (Rx).',
    mechanism: 'Inhibits anti-apoptotic pathways in senescent cells (BCL-2, PI3K). Reduces SASP (senescence-associated secretory phenotype).',
    dosage: '500–1000mg (pulsed: 2 days on, 2 weeks off)',
    timing: 'Pulsed protocol with food',
    stacksWith: ['fisetin', 'resveratrol'],
    avoid: [],
    studyCount: 34,
    affiliateUrl: '/go/thorne-quercetin',
  },
  {
    id: 'tmg',
    name: 'TMG',
    aliases: ['Trimethylglycine', 'Betaine'],
    category: 'Vitamins & Minerals',
    goals: ['Longevity', 'Cardiovascular', 'Energy'],
    evidenceLevel: 'Emerging',
    evidenceScore: 60,
    safetyScore: 90,
    popularityScore: 72,
    summary: 'A methyl donor that counteracts the methylation depletion caused by NMN/NR supplementation. Often recommended to stack with NAD+ precursors.',
    mechanism: 'Donates methyl groups via BHMT pathway → regenerates SAM (S-adenosylmethionine). Lowers homocysteine.',
    dosage: '500mg–2g/day',
    timing: 'Morning with NAD+ precursor',
    stacksWith: ['nmn', 'nr'],
    avoid: [],
    studyCount: 28,
    affiliateUrl: '/go/jarrow-tmg',
  },
]

export const evidenceBadge: Record<EvidenceLevel, string> = {
  Strong: 'bg-green/10 text-green-bright border-green/25',
  Moderate: 'bg-amber/10 text-amber border-amber/25',
  Emerging: 'bg-blue-500/10 text-blue-500 border-blue-500/25',
  Weak: 'bg-red-500/10 text-red-400 border-red-500/25',
}

export function getSupplementById(id: string) {
  return supplements.find(s => s.id === id) ?? null
}

export function getSupplementsByGoal(goal: Goal) {
  return supplements.filter(s => s.goals.includes(goal))
}

export function getSupplementsByCategory(cat: Category) {
  return supplements.filter(s => s.category === cat)
}
