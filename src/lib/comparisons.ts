export type Comparison = {
  slug: string
  title: string
  subtitle: string
  category: 'Supplements' | 'Wearables' | 'Recovery' | 'Training' | 'Stress'
  verdict: string
  description: string
  a: string
  b: string
  featured?: boolean
  related?: { href: string; label: string }[]
}

export const comparisons: Comparison[] = [
  {
    slug: 'nmn-vs-nr',
    title: 'NMN vs NR',
    subtitle: 'Which NAD+ precursor is better?',
    category: 'Supplements',
    verdict: 'NMN for direct pathway; NR for trial depth',
    description:
      'Both raise NAD+. We break down bioavailability, RCT count, safety history, dosing, and who should pick which.',
    a: 'NMN',
    b: 'NR',
    featured: true,
    related: [
      { href: '/supplements/best-nmn-supplements-2024', label: 'Best NMN' },
      { href: '/supplements/nad-boosters-complete-guide', label: 'NAD+ guide' },
    ],
  },
  {
    slug: 'whoop-vs-oura',
    title: 'WHOOP vs Oura',
    subtitle: 'Best longevity wearable?',
    category: 'Wearables',
    verdict: 'Oura for sleep; WHOOP for recovery',
    description:
      'Six months wearing both: HRV accuracy, sleep staging, form factor, battery, and real subscription cost.',
    a: 'WHOOP 4.0',
    b: 'Oura Gen 3',
    featured: true,
    related: [
      { href: '/best/best-wearables-longevity-2024', label: 'Best wearables' },
      { href: '/diagnostics/hrv-guide', label: 'HRV guide' },
    ],
  },
  {
    slug: 'sauna-types',
    title: 'Infrared vs Traditional Sauna',
    subtitle: 'Which heat therapy wins for longevity?',
    category: 'Recovery',
    verdict: 'Traditional data; IR for home fit',
    description:
      'Mortality evidence, temperature, cost, EMF, and installation trade-offs for home heat practice.',
    a: 'Infrared',
    b: 'Traditional',
    featured: true,
    related: [
      { href: '/recovery/best-home-saunas-infrared-2024', label: 'Best home saunas' },
      { href: '/protocols/sauna-protocol', label: 'Sauna protocol' },
    ],
  },
  {
    slug: 'magnesium-forms',
    title: 'Magnesium Forms Compared',
    subtitle: 'Glycinate vs L-Threonate vs Malate',
    category: 'Supplements',
    verdict: 'Glycinate default; threonate for brain',
    description:
      'Form determines use case. Sleep, cognition, energy, absorption, and what to avoid (oxide).',
    a: 'Glycinate',
    b: 'Threonate',
    related: [
      { href: '/supplements/best-magnesium-supplements', label: 'Best magnesium' },
      { href: '/protocols/sleep-hygiene-protocol', label: 'Sleep protocol' },
    ],
  },
  {
    slug: 'creatine-vs-hmb',
    title: 'Creatine vs HMB',
    subtitle: 'Best anti-sarcopenia supplement?',
    category: 'Supplements',
    verdict: 'Creatine',
    description:
      'Evidence base, muscle retention, cognitive angles, cost, and who might still consider HMB.',
    a: 'Creatine',
    b: 'HMB',
    related: [
      { href: '/supplements/best-creatine-supplements', label: 'Best creatine' },
      { href: '/protocols/strength-training-longevity', label: 'Strength protocol' },
    ],
  },
  {
    slug: 'cold-plunge-vs-ice-bath',
    title: 'Cold Plunge vs DIY Ice Bath',
    subtitle: 'Is a $5,000 plunge worth it?',
    category: 'Recovery',
    verdict: 'DIY for budget; plunge for convenience',
    description:
      'Temperature parity, filtration, maintenance, and when commercial hardware is rational.',
    a: 'Commercial plunge',
    b: 'DIY ice bath',
    related: [
      { href: '/recovery/cold-plunge-ice-bath-review', label: 'Best cold plunges' },
      { href: '/protocols/cold-exposure-protocol', label: 'Cold protocol' },
    ],
  },
  {
    slug: 'cardio-modalities',
    title: 'Cardio Modalities Compared',
    subtitle: 'Run vs bike vs row vs swim',
    category: 'Training',
    verdict: 'Stack modalities',
    description:
      'VO₂ max stimulus, injury risk, sustainability, and cost for longevity-oriented cardio.',
    a: 'Zone 2',
    b: 'VO₂ max work',
    related: [
      { href: '/cardio', label: 'Cardio hub' },
      { href: '/protocols/zone2-training-deep-dive', label: 'Zone 2 guide' },
    ],
  },
  {
    slug: 'meditation-apps',
    title: 'Meditation Apps Compared',
    subtitle: 'Insight Timer, Calm, Headspace & more',
    category: 'Stress',
    verdict: 'Insight Timer for value',
    description:
      'Pricing, free libraries, science framing, and best fit for stress-resilience practice.',
    a: 'Paid apps',
    b: 'Free libraries',
    related: [
      { href: '/stress-resilience', label: 'Stress hub' },
      { href: '/protocols/stress-longevity-protocol', label: 'Stress protocol' },
    ],
  },
]

export const compareCategories = [
  'All',
  'Supplements',
  'Wearables',
  'Recovery',
  'Training',
  'Stress',
] as const

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find(c => c.slug === slug)
}
