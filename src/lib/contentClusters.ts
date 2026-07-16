/**
 * SEO internal-link map: topic hubs ↔ best lists ↔ database ↔ deep guides.
 * Used by ContentCluster + RelatedArticles to surface high-value paths.
 *
 * Priority clusters target commercial + informational money keywords:
 * NMN/NAD+, sauna, cold plunge, sleep, longevity stack.
 */

export type ClusterLink = {
  href: string
  label: string
  desc: string
  kind: 'hub' | 'guide' | 'best' | 'database' | 'compare' | 'protocol'
}

export type ContentCluster = {
  id: string
  name: string
  /** Tags / keywords that map an article into this cluster */
  match: string[]
  /** Category slugs that belong here */
  categories?: string[]
  /** Explicit article slug matches */
  slugs?: string[]
  links: ClusterLink[]
}

export const contentClusters: ContentCluster[] = [
  {
    id: 'nmn-nad',
    name: 'NAD+ & NMN',
    match: ['nmn', 'nad+', 'nr', 'nicotinamide', 'nad boosters', 'sirtuins'],
    slugs: [
      'best-nmn-supplements-2024',
      'nad-boosters-complete-guide',
      'best-resveratrol-pterostilbene',
      'lithium-orotate-ndga-2026',
    ],
    links: [
      {
        href: '/supplements/best-nmn-supplements-2024',
        label: 'Best NMN Supplements 2026',
        desc: 'Ranked picks with purity and dose checks',
        kind: 'best',
      },
      {
        href: '/supplements/nad-boosters-complete-guide',
        label: 'NAD+ Boosters Complete Guide',
        desc: 'NMN vs NR vs niacin — what actually raises NAD+',
        kind: 'guide',
      },
      {
        href: '/compare/nmn-vs-nr',
        label: 'NMN vs NR Comparison',
        desc: 'Head-to-head for dose, cost, and evidence',
        kind: 'compare',
      },
      {
        href: '/database/nmn',
        label: 'NMN Evidence Card',
        desc: 'Scores, mechanism, and stack partners',
        kind: 'database',
      },
      {
        href: '/best/complete-longevity-stack',
        label: 'Complete Longevity Stack',
        desc: 'Where NMN sits in a full protocol',
        kind: 'best',
      },
      {
        href: '/category/supplements',
        label: 'All Supplement Reviews',
        desc: 'Browse the full supplement library',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'sauna',
    name: 'Sauna & Heat Therapy',
    match: ['sauna', 'infrared sauna', 'heat therapy', 'heat exposure'],
    slugs: [
      'best-home-saunas-infrared-2024',
      'sauna-protocol',
      'sunlighten-mpulse-sauna-review',
      'clearlight-sanctuary-2-review',
      'sauna-types',
    ],
    links: [
      {
        href: '/recovery/best-home-saunas-infrared-2024',
        label: 'Best Home Saunas 2026',
        desc: 'Infrared vs traditional — tested and ranked',
        kind: 'best',
      },
      {
        href: '/protocols/sauna-protocol',
        label: 'Sauna Protocol',
        desc: 'Temperature, duration, frequency for longevity',
        kind: 'protocol',
      },
      {
        href: '/compare/sauna-types',
        label: 'Sauna Types Compared',
        desc: 'Infrared, traditional, and hybrid trade-offs',
        kind: 'compare',
      },
      {
        href: '/recovery/sunlighten-mpulse-sauna-review',
        label: 'Sunlighten mPulse Review',
        desc: 'Our top full-spectrum pick, deep dive',
        kind: 'guide',
      },
      {
        href: '/database/sunlighten-mpulse',
        label: 'mPulse Database Entry',
        desc: 'Evidence score and product specs',
        kind: 'database',
      },
      {
        href: '/category/recovery',
        label: 'Recovery Devices Hub',
        desc: 'Sauna, cold, red light, and more',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'cold',
    name: 'Cold Exposure',
    match: ['cold plunge', 'ice bath', 'cold water', 'cold exposure', 'cold shower', 'hormesis'],
    slugs: [
      'cold-plunge-ice-bath-review',
      'cold-exposure-protocol',
      'cold-shower-protocol',
      'the-plunge-pro-review',
      'morozko-forge-review',
      'cold-plunge-vs-ice-bath',
    ],
    links: [
      {
        href: '/recovery/cold-plunge-ice-bath-review',
        label: 'Best Cold Plunges 2026',
        desc: 'DIY to pro pods — ranked by temp and value',
        kind: 'best',
      },
      {
        href: '/protocols/cold-exposure-protocol',
        label: 'Cold Exposure Protocol',
        desc: 'How long, how cold, how often',
        kind: 'protocol',
      },
      {
        href: '/compare/cold-plunge-vs-ice-bath',
        label: 'Cold Plunge vs Ice Bath',
        desc: 'Which modality fits your setup',
        kind: 'compare',
      },
      {
        href: '/protocols/cold-shower-protocol',
        label: 'Cold Shower Protocol',
        desc: 'Zero-equipment starting point',
        kind: 'protocol',
      },
      {
        href: '/database/the-plunge-pro',
        label: 'The Plunge Pro Card',
        desc: 'Our top commercial plunge pick',
        kind: 'database',
      },
      {
        href: '/category/recovery',
        label: 'Recovery Devices Hub',
        desc: 'All recovery gear reviews',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'sleep',
    name: 'Sleep Optimization',
    match: ['sleep', 'circadian', 'sleep hygiene', 'melatonin', 'insomnia'],
    slugs: [
      'sleep-hygiene-protocol',
      'best-sleep-tools',
      'light-therapy-circadian-protocol',
      'best-magnesium-supplements',
    ],
    links: [
      {
        href: '/sleep',
        label: 'Sleep Optimization Hub',
        desc: 'Architecture, circadian, and stack overview',
        kind: 'hub',
      },
      {
        href: '/protocols/sleep-hygiene-protocol',
        label: 'Sleep Hygiene Protocol',
        desc: '20 changes ranked by impact',
        kind: 'protocol',
      },
      {
        href: '/best/best-sleep-tools',
        label: 'Best Sleep Tools',
        desc: 'Trackers, masks, cooling, and light',
        kind: 'best',
      },
      {
        href: '/protocols/light-therapy-circadian-protocol',
        label: 'Circadian Light Protocol',
        desc: 'Morning and evening light timing',
        kind: 'protocol',
      },
      {
        href: '/supplements/best-magnesium-supplements',
        label: 'Best Magnesium for Sleep',
        desc: 'Glycinate and threonate ranked',
        kind: 'guide',
      },
      {
        href: '/get-started',
        label: 'Beginner Longevity Path',
        desc: 'Sleep is step 2 in our 5-step plan',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'stack',
    name: 'Longevity Stack',
    match: [
      'supplement stack',
      'longevity stack',
      'stack',
      'creatine',
      'omega-3',
      'vitamin d',
      'magnesium',
    ],
    slugs: [
      'complete-longevity-stack',
      'best-longevity-supplements',
      'best-creatine-supplements',
      'best-omega-3-fish-oil',
      'best-vitamin-d3-k2',
      'best-magnesium-supplements',
    ],
    links: [
      {
        href: '/best/complete-longevity-stack',
        label: 'Complete Longevity Stack',
        desc: 'Tiered what / when / why framework',
        kind: 'best',
      },
      {
        href: '/best/best-longevity-supplements',
        label: 'Best Longevity Supplements',
        desc: 'Top-ranked compounds overall',
        kind: 'best',
      },
      {
        href: '/category/supplements',
        label: 'Supplement Reviews Hub',
        desc: 'Full category of evidence reviews',
        kind: 'hub',
      },
      {
        href: '/database',
        label: 'Research Database',
        desc: '68+ compounds scored by evidence',
        kind: 'database',
      },
      {
        href: '/get-started',
        label: 'Build My Plan',
        desc: 'Personalised path to your first stack',
        kind: 'hub',
      },
      {
        href: '/best/best-longevity-labs',
        label: 'Best Longevity Labs',
        desc: 'Test before you stack',
        kind: 'best',
      },
    ],
  },
  {
    id: 'cardio',
    name: 'Zone 2 & VO₂ Max',
    match: ['zone 2', 'vo2', 'cardio', 'aerobic', 'zone2'],
    slugs: ['zone2-training-deep-dive', 'longevity-exercise-protocol', 'vo2-max-testing-guide'],
    links: [
      {
        href: '/cardio',
        label: 'Cardio Optimization Hub',
        desc: 'Zone 2 calculator and protocol',
        kind: 'hub',
      },
      {
        href: '/protocols/zone2-training-deep-dive',
        label: 'Zone 2 Deep Dive',
        desc: '12-week programme and science',
        kind: 'protocol',
      },
      {
        href: '/diagnostics/vo2-max-testing-guide',
        label: 'VO₂ Max Testing Guide',
        desc: 'How to measure and improve it',
        kind: 'guide',
      },
      {
        href: '/protocols/longevity-exercise-protocol',
        label: 'Longevity Exercise Protocol',
        desc: 'Strength + Zone 2 + VO₂ max together',
        kind: 'protocol',
      },
      {
        href: '/compare/cardio-modalities',
        label: 'Cardio Modalities Compared',
        desc: 'Row, bike, run, swim trade-offs',
        kind: 'compare',
      },
      {
        href: '/get-started',
        label: 'Beginner Path',
        desc: 'Cardio is step 3 after sleep',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'nutrition',
    name: 'Longevity Nutrition',
    match: ['nutrition', 'protein', 'fasting', 'diet', 'leucine'],
    slugs: [
      'longevity-nutrition-framework',
      'protein-timing-leucine-threshold',
      'intermittent-fasting-longevity-guide',
      'longevity-cooking-guide',
    ],
    links: [
      {
        href: '/nutrition',
        label: 'Nutrition Hub',
        desc: 'Evidence-first eating frameworks',
        kind: 'hub',
      },
      {
        href: '/protocols/longevity-nutrition-framework',
        label: 'Nutrition Framework',
        desc: 'No ideology — just the data',
        kind: 'protocol',
      },
      {
        href: '/protocols/protein-timing-leucine-threshold',
        label: 'Protein Timing Guide',
        desc: 'Why 30g × 3 beats one big meal',
        kind: 'guide',
      },
      {
        href: '/protocols/intermittent-fasting-longevity-guide',
        label: 'IF for Longevity',
        desc: 'What the fasting evidence supports',
        kind: 'protocol',
      },
      {
        href: '/best/complete-longevity-stack',
        label: 'Supplement Stack',
        desc: 'Fill gaps after food is dialled in',
        kind: 'best',
      },
      {
        href: '/get-started',
        label: 'Beginner Path',
        desc: 'Nutrition is step 4 in the plan',
        kind: 'hub',
      },
    ],
  },
]

/** Match an article (or free-text) to its best content cluster. */
export function matchCluster(input: {
  slug?: string
  category?: string
  tags?: string[]
  title?: string
}): ContentCluster | null {
  const hay = [
    input.slug ?? '',
    input.category ?? '',
    input.title ?? '',
    ...(input.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()

  let best: { cluster: ContentCluster; score: number } | null = null

  for (const cluster of contentClusters) {
    let score = 0
    if (input.slug && cluster.slugs?.includes(input.slug)) score += 10
    for (const m of cluster.match) {
      if (hay.includes(m.toLowerCase())) score += 2
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { cluster, score }
    }
  }

  return best?.cluster ?? null
}

/** Links for a page, excluding the current path. */
export function clusterLinksFor(
  input: { slug?: string; category?: string; tags?: string[]; title?: string; path?: string },
  limit = 5
): { cluster: ContentCluster; links: ClusterLink[] } | null {
  const cluster = matchCluster(input)
  if (!cluster) return null
  const current = input.path ?? (input.slug && input.category ? `/${input.category}/${input.slug}` : '')
  const links = cluster.links.filter(l => l.href !== current).slice(0, limit)
  if (links.length === 0) return null
  return { cluster, links }
}
