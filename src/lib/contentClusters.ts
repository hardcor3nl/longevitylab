/**
 * SEO internal-link map: topic hubs ↔ best lists ↔ database ↔ deep guides.
 * Used by ContentCluster + RelatedArticles to surface high-value paths.
 *
 * Priority clusters: NMN/NAD+, sauna, cold, sleep, stack, cardio, nutrition,
 * red light, wearables, creatine, magnesium, omega-3, vitamin D.
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
  {
    id: 'red-light',
    name: 'Red Light Therapy',
    match: [
      'red light',
      'photobiomodulation',
      'pbm',
      'joovv',
      'mito red',
      'biomax',
      'near infrared',
    ],
    slugs: [
      'best-red-light-therapy-panels-2024',
      'joovv-solo-3-review',
      'mito-red-light-mitopro-1500-review',
      'platinumled-biomax-300-review',
      'light-therapy-circadian-protocol',
    ],
    links: [
      {
        href: '/recovery/best-red-light-therapy-panels-2024',
        label: 'Best Red Light Panels 2026',
        desc: 'Irradiance, wavelengths, and value ranked',
        kind: 'best',
      },
      {
        href: '/recovery/mito-red-light-mitopro-1500-review',
        label: 'MitoPRO 1500 Review',
        desc: 'Our top value full-body panel',
        kind: 'guide',
      },
      {
        href: '/recovery/joovv-solo-3-review',
        label: 'Joovv Solo 3.0 Review',
        desc: 'Premium ecosystem trade-offs',
        kind: 'guide',
      },
      {
        href: '/database/mito-red-1500',
        label: 'MitoPRO Database Card',
        desc: 'Evidence score and specs',
        kind: 'database',
      },
      {
        href: '/protocols/light-therapy-circadian-protocol',
        label: 'Circadian Light Protocol',
        desc: 'Morning sun vs evening red/NIR',
        kind: 'protocol',
      },
      {
        href: '/category/recovery',
        label: 'Recovery Devices Hub',
        desc: 'Red light, sauna, cold, and more',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'wearables',
    name: 'Longevity Wearables',
    match: [
      'whoop',
      'oura',
      'wearable',
      'hrv',
      'garmin',
      'cgm',
      'sleep tracking',
      'recovery tracker',
    ],
    slugs: [
      'best-wearables-longevity-2024',
      'whoop-4-review',
      'oura-ring-gen3-review',
      'whoop-vs-oura-comparison',
      'garmin-fenix-7-review',
      'garmin-vs-whoop-comparison',
      'dexcom-stelo-review',
      'best-fitness-trackers-longevity',
      'best-continuous-glucose-monitors',
      'hrv-guide',
    ],
    links: [
      {
        href: '/best/best-wearables-longevity-2024',
        label: 'Best Longevity Wearables 2026',
        desc: 'WHOOP, Oura, Garmin, CGM ranked',
        kind: 'best',
      },
      {
        href: '/wearables/whoop-vs-oura-comparison',
        label: 'WHOOP vs Oura',
        desc: '6-month head-to-head for longevity',
        kind: 'compare',
      },
      {
        href: '/wearables/whoop-4-review',
        label: 'WHOOP 4.0 Review',
        desc: 'HRV and recovery deep dive',
        kind: 'guide',
      },
      {
        href: '/wearables/oura-ring-gen3-review',
        label: 'Oura Ring Gen 3 Review',
        desc: 'Best consumer sleep staging',
        kind: 'guide',
      },
      {
        href: '/diagnostics/hrv-guide',
        label: 'HRV Guide',
        desc: 'What the number actually means',
        kind: 'guide',
      },
      {
        href: '/category/wearables',
        label: 'Wearables Hub',
        desc: 'All tracker and CGM reviews',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'creatine',
    name: 'Creatine',
    match: ['creatine', 'monohydrate', 'muscle preservation', 'sarcopenia'],
    slugs: ['best-creatine-supplements', 'creatine-vs-hmb', 'strength-training-longevity'],
    links: [
      {
        href: '/supplements/best-creatine-supplements',
        label: 'Best Creatine for Longevity',
        desc: 'Forms, dose, brain + muscle evidence',
        kind: 'best',
      },
      {
        href: '/compare/creatine-vs-hmb',
        label: 'Creatine vs HMB',
        desc: 'When each compound makes sense',
        kind: 'compare',
      },
      {
        href: '/database/creatine-mono',
        label: 'Creatine Database Card',
        desc: 'Evidence score and stack partners',
        kind: 'database',
      },
      {
        href: '/protocols/strength-training-longevity',
        label: 'Strength Training Protocol',
        desc: 'Creatine only works with training stimulus',
        kind: 'protocol',
      },
      {
        href: '/best/complete-longevity-stack',
        label: 'Complete Longevity Stack',
        desc: 'Creatine sits in Tier 1 universals',
        kind: 'best',
      },
      {
        href: '/best/best-longevity-supplements',
        label: 'Best Longevity Supplements',
        desc: 'Where creatine ranks overall',
        kind: 'best',
      },
    ],
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    match: ['magnesium', 'glycinate', 'threonate', 'magtein', 'malate'],
    slugs: ['best-magnesium-supplements', 'magnesium-forms', 'sleep-hygiene-protocol'],
    links: [
      {
        href: '/supplements/best-magnesium-supplements',
        label: 'Best Magnesium Supplements',
        desc: 'Glycinate vs threonate vs malate',
        kind: 'best',
      },
      {
        href: '/compare/magnesium-forms',
        label: 'Magnesium Forms Compared',
        desc: 'Pick the right form for your goal',
        kind: 'compare',
      },
      {
        href: '/database/magnesium-glycinate',
        label: 'Glycinate Database Card',
        desc: 'Our default sleep-friendly form',
        kind: 'database',
      },
      {
        href: '/protocols/sleep-hygiene-protocol',
        label: 'Sleep Hygiene Protocol',
        desc: 'Magnesium is support, not the foundation',
        kind: 'protocol',
      },
      {
        href: '/supplements/best-vitamin-d3-k2',
        label: 'Vitamin D3 + K2',
        desc: 'Mg is required for D activation',
        kind: 'guide',
      },
      {
        href: '/best/complete-longevity-stack',
        label: 'Complete Longevity Stack',
        desc: 'Tier 1 dosing and timing',
        kind: 'best',
      },
    ],
  },
  {
    id: 'omega3',
    name: 'Omega-3',
    match: ['omega-3', 'omega 3', 'fish oil', 'epa', 'dha', 'triglyceride'],
    slugs: ['best-omega-3-fish-oil'],
    links: [
      {
        href: '/supplements/best-omega-3-fish-oil',
        label: 'Best Omega-3 Fish Oil',
        desc: 'Purity, potency, and IFOS picks',
        kind: 'best',
      },
      {
        href: '/database/omega3-carlson',
        label: 'Carlson Omega-3 Card',
        desc: 'Top pick evidence profile',
        kind: 'database',
      },
      {
        href: '/best/complete-longevity-stack',
        label: 'Complete Longevity Stack',
        desc: 'EPA+DHA dose in Tier 1',
        kind: 'best',
      },
      {
        href: '/diagnostics/longevity-biomarkers-guide',
        label: 'Biomarker Guide',
        desc: 'Omega-3 index testing',
        kind: 'guide',
      },
      {
        href: '/best/best-longevity-supplements',
        label: 'Best Longevity Supplements',
        desc: 'Where omega-3 ranks overall',
        kind: 'best',
      },
      {
        href: '/category/supplements',
        label: 'Supplement Reviews Hub',
        desc: 'Full evidence library',
        kind: 'hub',
      },
    ],
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D + K2',
    match: ['vitamin d', 'vitamin d3', 'k2', 'mk-7', '25-oh', '25(oh)d'],
    slugs: ['best-vitamin-d3-k2'],
    links: [
      {
        href: '/supplements/best-vitamin-d3-k2',
        label: 'Best Vitamin D3 + K2',
        desc: 'Dose, forms, and testing targets',
        kind: 'best',
      },
      {
        href: '/database/vitamin-d3-k2',
        label: 'D3+K2 Database Card',
        desc: 'Evidence score and stack partners',
        kind: 'database',
      },
      {
        href: '/supplements/best-magnesium-supplements',
        label: 'Best Magnesium',
        desc: 'Required cofactor for D metabolism',
        kind: 'guide',
      },
      {
        href: '/best/best-longevity-labs',
        label: 'Best Longevity Labs',
        desc: 'Test 25-OH D before high dosing',
        kind: 'best',
      },
      {
        href: '/best/complete-longevity-stack',
        label: 'Complete Longevity Stack',
        desc: 'Tier 1 placement and timing',
        kind: 'best',
      },
      {
        href: '/best/best-longevity-supplements',
        label: 'Best Longevity Supplements',
        desc: 'Overall ranking context',
        kind: 'best',
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
