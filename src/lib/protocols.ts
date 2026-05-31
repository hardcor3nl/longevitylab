export interface ProtocolSupplement {
  name: string
  dose: string
  timing: string
  purpose: string
  evidenceNote?: string
  supplementId?: string // links to /database/[id]
}

export interface ProtocolSection {
  title: string
  description: string
  items: ProtocolSupplement[]
}

export interface Protocol {
  id: string
  expert: string
  title: string
  slug: string
  description: string
  longDescription: string
  image: string
  expertImage: string
  role: string
  website: string
  approach: string
  keyPhilosophy: string[]
  sections: ProtocolSection[]
  totalSupplements: number
  estimatedCost: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  lastUpdated: string
  disclaimer: string
  affiliateDisclosure: string
}

export const protocols: Protocol[] = [
  {
    id: 'peter-attia',
    expert: 'Peter Attia, MD',
    title: "Dr. Peter Attia's Longevity Protocol",
    slug: 'peter-attia-longevity-protocol',
    description: "The complete supplement stack, exercise framework, and dietary approach from Peter Attia's Medicine 3.0 longevity practice.",
    longDescription: "Dr. Peter Attia is a physician focused on the science of longevity. His podcast 'The Drive' and book 'Outlive' have made him one of the most influential voices in preventive medicine. His protocol emphasises what he calls 'Medicine 3.0' — proactive, personalised health optimisation rather than reactive disease treatment.",
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85',
    expertImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    role: 'Physician, longevity researcher, author of Outlive',
    website: 'peterattiamd.com',
    approach: 'Medicine 3.0 — proactive, data-driven health optimisation',
    keyPhilosophy: [
      'Maximise "healthspan" (quality of life) alongside lifespan',
      'The four horsemen of disease: cardiovascular, cancer, neurodegeneration, metabolic — address all proactively',
      'Exercise is the most potent longevity drug: VO2 max and muscle mass are the strongest predictors of longevity',
      'Sleep is non-negotiable: 7–9 hours with quality tracking',
      'Bloodwork every 6 months minimum — you cannot optimise what you do not measure',
    ],
    sections: [
      {
        title: 'Foundation Stack',
        description: 'Supplements Attia takes daily as a nutritional foundation, filling gaps that diet alone rarely covers.',
        items: [
          { name: 'Omega-3 (EPA/DHA)', dose: '2–4g EPA+DHA', timing: 'With meals', purpose: 'Cardiovascular protection, anti-inflammatory, brain health', evidenceNote: 'Strong — one of his highest-confidence supplements', supplementId: 'omega3' },
          { name: 'Vitamin D3 + K2', dose: '5,000 IU D3 + 180mcg K2', timing: 'Morning with fat', purpose: 'Immune function, bone health, cardiovascular; K2 directs calcium appropriately', evidenceNote: 'Tests levels quarterly — targets 40–60 ng/mL', supplementId: 'vitamin-d' },
          { name: 'Magnesium L-Threonate', dose: '2g (144mg elemental)', timing: 'Evening', purpose: 'Sleep quality, cognitive function, cardiovascular', supplementId: 'magnesium' },
          { name: 'Zinc', dose: '25–45mg', timing: 'With dinner', purpose: 'Immune function, testosterone, protein synthesis', evidenceNote: 'Especially during high training loads' },
        ],
      },
      {
        title: 'Metabolic & Longevity',
        description: "Attia's most discussed longevity interventions — with nuanced context on each.",
        items: [
          { name: 'Rapamycin', dose: '6mg weekly (Rx only)', timing: 'Once weekly', purpose: 'mTOR inhibition — the strongest longevity intervention in animal models', evidenceNote: 'Prescription only. Attia takes this personally but emphasises individual decision with a physician' },
          { name: 'Metformin', dose: 'Was 1–1.5g/day, now paused', timing: 'With meals', purpose: 'AMPK activation, glucose control, possible longevity effects', evidenceNote: 'Attia paused after MILES trial showed blunted muscle adaptation from exercise. Now uses berberine instead on training days', supplementId: 'berberine' },
          { name: 'Berberine', dose: '500mg 2x/day', timing: 'With meals', purpose: 'AMPK activator — used on training days instead of metformin', supplementId: 'berberine' },
        ],
      },
      {
        title: 'Cognitive & Sleep',
        description: 'Attia prioritises sleep above almost everything. These support his sleep and cognitive performance goals.',
        items: [
          { name: 'Ashwagandha (KSM-66)', dose: '600mg', timing: 'Evening', purpose: 'Cortisol reduction, sleep quality', supplementId: 'ashwagandha' },
          { name: 'Trazodone', dose: '50–100mg (Rx)', timing: 'Before bed', purpose: 'Sleep continuity — used sparingly on high-stress periods', evidenceNote: 'Prescription only. Attia prefers sleep hygiene first; medication is a last resort' },
          { name: 'Glycine', dose: '3g', timing: 'Before bed', purpose: 'Sleep quality, collagen synthesis, anti-aging', evidenceNote: 'Strong safety profile, modest sleep data' },
        ],
      },
      {
        title: 'Exercise Support',
        description: 'Attia trains extensively — these support his high training volumes.',
        items: [
          { name: 'Creatine Monohydrate', dose: '5g/day', timing: 'Anytime, consistent', purpose: 'Muscle strength, power output, cognitive neuroprotection', evidenceNote: 'One of his highest-confidence supplements', supplementId: 'creatine' },
          { name: 'Protein (whole food + whey)', dose: '1g per lb bodyweight', timing: 'Distributed across meals', purpose: 'Muscle protein synthesis — the foundation of anti-sarcopenic strategy', evidenceNote: 'Attia considers protein the most important nutritional intervention for longevity after age 40' },
        ],
      },
    ],
    totalSupplements: 11,
    estimatedCost: '$150–250/month',
    difficulty: 'Advanced',
    lastUpdated: '2024-11',
    disclaimer: "This protocol is for educational purposes. Dr. Attia's personal stack evolves based on his own data and new research. Several items (rapamycin, metformin, trazodone) require prescriptions and physician oversight.",
    affiliateDisclosure: 'LongevityLab earns a commission on affiliate links. This never influences our coverage.',
  },
  {
    id: 'andrew-huberman',
    expert: 'Andrew Huberman, PhD',
    title: "Dr. Andrew Huberman's Supplement Protocol",
    slug: 'andrew-huberman-supplement-protocol',
    description: "The full supplement stack, sleep protocol, and morning routine from Stanford neuroscientist Andrew Huberman.",
    longDescription: "Dr. Andrew Huberman is a Professor of Neurobiology and Ophthalmology at Stanford School of Medicine. His podcast 'Huberman Lab' reaches millions monthly and has made neuroscience-based health protocols mainstream. He is known for his emphasis on foundational behaviours — light, sleep, exercise — before supplements.",
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85',
    expertImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    role: 'Professor of Neurobiology at Stanford, host of Huberman Lab podcast',
    website: 'hubermanlab.com',
    approach: 'Neuroscience-based protocols for performance, sleep, and cognitive health',
    keyPhilosophy: [
      'Foundational behaviours come first: light, sleep, exercise, nutrition, stress management',
      'Morning sunlight exposure within 30 minutes of waking — resets the circadian clock',
      'Non-sleep deep rest (NSDR/Yoga Nidra) as a recovery tool',
      '"Tools" over supplements — behavioural protocols often outperform pills',
      'Supplements fill gaps that behaviour cannot cover alone',
    ],
    sections: [
      {
        title: 'Daily Foundation',
        description: "Huberman's consistent daily supplements, taken year-round.",
        items: [
          { name: 'Athletic Greens (AG1)', dose: '1 serving', timing: 'Morning, fasted', purpose: 'Broad micronutrient coverage, digestive enzymes, adaptogens', evidenceNote: 'Huberman is a paid partner of AG1 — this is a disclosed sponsorship. Independently: useful for micronutrient insurance, not magic' },
          { name: 'Omega-3 (EPA/DHA)', dose: '2–3g EPA+DHA', timing: 'With food', purpose: 'Mood, cognition, cardiovascular health, inflammation', supplementId: 'omega3' },
          { name: 'Vitamin D3', dose: '5,000 IU', timing: 'Morning with fat', purpose: 'Immune function, mood, testosterone, bone health', supplementId: 'vitamin-d' },
          { name: 'NMN or NR', dose: '500mg NMN', timing: 'Morning', purpose: 'NAD+ restoration, cellular energy, DNA repair', supplementId: 'nmn' },
        ],
      },
      {
        title: 'Sleep Protocol',
        description: "Huberman's sleep stack — one of his most requested protocols.",
        items: [
          { name: 'Magnesium Threonate or Bisglycinate', dose: '300–400mg', timing: '30–60 min before bed', purpose: 'Sleep onset, GABA modulation, cognitive protection', supplementId: 'magnesium' },
          { name: 'Apigenin', dose: '50mg', timing: '30–60 min before bed', purpose: 'Anti-anxiety, sleep onset — binds GABA receptors', evidenceNote: 'Found naturally in chamomile. Modest but consistent sleep data' },
          { name: 'L-Theanine', dose: '100–200mg', timing: '30–60 min before bed', purpose: 'Calming without sedation, improves sleep quality', evidenceNote: 'Huberman does NOT recommend if prone to vivid dreams — can intensify them' },
          { name: 'Glycine', dose: '2g', timing: '30 min before bed', purpose: 'Sleep quality, reduces core body temperature', evidenceNote: 'His occasional add-on — not every night' },
        ],
      },
      {
        title: 'Focus & Cognition',
        description: 'Huberman uses these for deep work and cognitive performance sessions.',
        items: [
          { name: 'Alpha-GPC', dose: '300mg', timing: '30 min before cognitive work', purpose: 'Acetylcholine precursor — focus, learning, memory encoding', evidenceNote: 'Huberman cycles this — not every day' },
          { name: 'L-Tyrosine', dose: '500mg', timing: '30 min before demanding tasks', purpose: 'Dopamine precursor — motivation, focus under stress', evidenceNote: 'Context-dependent use — not for relaxed days' },
          { name: 'Caffeine', dose: '100–200mg', timing: '90 min after waking (not immediately)', purpose: 'Alertness, performance — delayed to avoid adenosine rebound crash', evidenceNote: 'Critical timing: Huberman emphasises delaying caffeine 90 min to let adenosine clear naturally first' },
        ],
      },
      {
        title: 'Hormone & Vitality',
        description: "Huberman's protocol for testosterone, hormone health, and overall vitality.",
        items: [
          { name: 'Zinc', dose: '25mg', timing: 'Evening', purpose: 'Testosterone support, immune function', evidenceNote: 'Only if zinc-deficient — test first' },
          { name: 'Ashwagandha', dose: '600mg KSM-66', timing: 'Evening', purpose: 'Cortisol reduction, testosterone support', evidenceNote: 'Huberman cycles — 4 weeks on, 1–2 weeks off', supplementId: 'ashwagandha' },
          { name: 'Tongkat Ali', dose: '400mg', timing: 'Morning', purpose: 'LH stimulation → testosterone increase. Cortisol reduction', evidenceNote: '3+ human RCTs. Huberman considers this one of the better-evidenced testosterone-supporting supplements' },
        ],
      },
    ],
    totalSupplements: 15,
    estimatedCost: '$120–200/month',
    difficulty: 'Intermediate',
    lastUpdated: '2024-10',
    disclaimer: "Huberman's protocol evolves frequently as new research emerges. AG1 is a paid sponsorship. Some recommendations (like Alpha-GPC and Tongkat Ali) have moderate evidence — verify with your physician.",
    affiliateDisclosure: 'LongevityLab earns a commission on affiliate links. This never influences our coverage.',
  },
  {
    id: 'bryan-johnson',
    expert: 'Bryan Johnson',
    title: "Bryan Johnson's Blueprint Protocol",
    slug: 'bryan-johnson-blueprint-protocol',
    description: "The most extreme and quantified longevity protocol in the world — Blueprint — from tech entrepreneur Bryan Johnson who spends $2M/year on anti-aging.",
    longDescription: "Bryan Johnson is a tech entrepreneur (sold Braintree/Venmo to PayPal for $800M) who now spends an estimated $2 million per year attempting to reverse his biological age. His 'Blueprint' protocol is the most comprehensive, quantified, and extreme longevity intervention ever publicly documented. He employs a team of 30+ doctors and measures 100+ biomarkers monthly.",
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85',
    expertImage: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
    role: 'Tech entrepreneur, founder of Blueprint, anti-aging pioneer',
    website: 'blueprint.bryanjohnson.co',
    approach: 'Algorithmic self-optimisation — remove human decision-making, follow data exclusively',
    keyPhilosophy: [
      '"Don\'t die" — death prevention as the primary life goal',
      'Algorithms, not willpower — remove subjective choices from health decisions',
      'Measure everything: 100+ biomarkers monthly, continuous glucose monitoring, sleep tracking',
      'All behaviours serve the body\'s long-term interest, not short-term pleasure',
      'Evening cutoff: no food after 11am — 23-hour fasting window (one meal in the morning)',
    ],
    sections: [
      {
        title: 'Morning Stack (post-workout)',
        description: 'Johnson takes 50+ pills per day. This is his morning protocol taken with his primary meal.',
        items: [
          { name: 'Vitamin C', dose: '500mg', timing: 'Morning', purpose: 'Antioxidant, collagen synthesis, immune function' },
          { name: 'Vitamin D3 + K2', dose: '2,000 IU + 90mcg', timing: 'Morning', purpose: 'Bone health, immune function, calcium regulation', supplementId: 'vitamin-d' },
          { name: 'Omega-3 (EPA/DHA)', dose: '1g EPA + 500mg DHA', timing: 'With meal', purpose: 'Cardiovascular, brain, anti-inflammatory', supplementId: 'omega3' },
          { name: 'NMN', dose: '500mg', timing: 'Morning', purpose: 'NAD+ precursor, cellular energy, DNA repair', supplementId: 'nmn' },
          { name: 'Creatine', dose: '5g', timing: 'Post-workout', purpose: 'Muscle, cognition, mitochondrial health', supplementId: 'creatine' },
          { name: 'CoQ10 (Ubiquinol)', dose: '100mg', timing: 'With fat', purpose: 'Mitochondrial electron transport, antioxidant', supplementId: 'coq10' },
        ],
      },
      {
        title: 'Anti-Aging Core',
        description: "Johnson's most aggressive anti-aging interventions — some experimental.",
        items: [
          { name: 'Rapamycin', dose: '13mg biweekly (Rx)', timing: 'Every 2 weeks', purpose: 'mTOR inhibition — strongest longevity drug in animal models', evidenceNote: 'Prescription only. Experimental in healthy humans. Johnson is one of the most documented users.' },
          { name: 'Acarbose', dose: '200mg (Rx)', timing: 'With meals', purpose: 'Glucose spike blunting. Extended lifespan in ITP mouse studies.', evidenceNote: 'Prescription. One of 3 drugs that extended lifespan in the Interventions Testing Program.' },
          { name: 'Metformin', dose: '1.5g (Rx)', timing: 'With meals', purpose: 'AMPK activation, glucose control, longevity signalling', evidenceNote: 'Prescription. Johnson continues unlike Attia — different philosophy on exercise interference.' },
          { name: 'Lithium (low dose)', dose: '1mg', timing: 'Daily', purpose: 'Neuroprotection, mood stabilisation, possible longevity effects', evidenceNote: 'Epidemiological data shows areas with higher lithium in water have lower dementia rates. Very low dose.' },
        ],
      },
      {
        title: 'Gut & Microbiome',
        description: 'Johnson measures his gut microbiome monthly and intervenes specifically.',
        items: [
          { name: 'Probiotics (spore-based)', dose: '4 strains', timing: 'Morning', purpose: 'Microbiome diversity, immune function, gut barrier integrity' },
          { name: 'Prebiotic fibre', dose: '30g+ daily', timing: 'Via food (broccoli, flaxseed)', purpose: 'Feed beneficial bacteria, reduce inflammation, metabolic health' },
          { name: 'Pea protein', dose: '29g', timing: 'Morning meal', purpose: 'Primary protein source — 15% caloric restriction overall diet' },
        ],
      },
      {
        title: 'Sleep Optimisation',
        description: 'Johnson considers sleep the highest-leverage intervention and optimises it obsessively.',
        items: [
          { name: 'Melatonin', dose: '0.25–0.5mg (low dose)', timing: '30 min before bed (9pm)', purpose: 'Circadian signal — Johnson uses far lower than typical OTC doses', evidenceNote: 'Research suggests 0.3–0.5mg is optimal — most OTC doses are 10–20x too high' },
          { name: 'Magnesium', dose: '500mg glycinate', timing: 'Before bed', purpose: 'Sleep quality, nervous system relaxation', supplementId: 'magnesium' },
        ],
      },
    ],
    totalSupplements: 50,
    estimatedCost: '$1,000–2,000/month (full protocol)',
    difficulty: 'Advanced',
    lastUpdated: '2024-11',
    disclaimer: "Bryan Johnson's protocol is extreme and expensive. Several interventions (rapamycin, metformin, acarbose) require prescriptions. This page is for educational purposes only — do not replicate without physician oversight.",
    affiliateDisclosure: 'LongevityLab earns a commission on some affiliate links.',
  },
  {
    id: 'david-sinclair',
    expert: 'David Sinclair, PhD',
    title: "David Sinclair's Longevity Protocol",
    slug: 'david-sinclair-longevity-protocol',
    description: "The supplement stack and lifestyle practices of Harvard longevity professor David Sinclair, author of Lifespan.",
    longDescription: "Dr. David Sinclair is a Professor of Genetics at Harvard Medical School and co-director of the Paul F. Glenn Center for Biology of Aging Research. His 2019 book 'Lifespan' and his Information Theory of Aging made him one of the most widely read longevity scientists. He is known for popularising NMN and resveratrol.",
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85',
    expertImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    role: 'Professor of Genetics, Harvard Medical School. Author of Lifespan.',
    website: 'sinclair.hms.harvard.edu',
    approach: 'Information Theory of Aging — restore the epigenetic information that drives youthful gene expression',
    keyPhilosophy: [
      'Aging is a disease — and like all diseases, it can be treated',
      'The epigenome loses information with age; restoring it is the key to longevity',
      'Sirtuins are the longevity genes — NAD+ activates them, xenohormesis activates them',
      'Intermittent fasting triggers longevity pathways — Sinclair skips breakfast daily',
      'Intense exercise, especially HIIT, activates sirtuins and mitochondrial biogenesis',
    ],
    sections: [
      {
        title: 'Signature Stack',
        description: "Sinclair's personally reported daily protocol — centred on NAD+ restoration and sirtuin activation.",
        items: [
          { name: 'NMN', dose: '1g/day', timing: 'Morning with yogurt (for absorption)', purpose: "NAD+ precursor — core of Sinclair's stack", evidenceNote: 'Sinclair was instrumental in popularising NMN. Takes higher dose than most trials — 1g vs typical 250–500mg', supplementId: 'nmn' },
          { name: 'Resveratrol', dose: '1g/day', timing: 'Morning with olive oil (fat required)', purpose: 'SIRT1 activator — synergistic with NMN for NAD+/sirtuin pathway', evidenceNote: "Controversial: animal data strong, human data mixed. Sinclair continues to take it.", supplementId: 'resveratrol' },
          { name: 'Metformin', dose: '1g/day (Rx)', timing: 'Evening', purpose: 'AMPK activator, glucose control, longevity signalling', evidenceNote: 'Takes it in the evening to avoid blunting exercise adaptation (unlike daytime dosing)' },
          { name: 'Vitamin D3 + K2', dose: '5,000 IU D3', timing: 'Morning', purpose: 'Immune function, bone health, cancer prevention', supplementId: 'vitamin-d' },
        ],
      },
      {
        title: 'Antioxidants & Senolytics',
        description: 'Targeting oxidative stress and senescent cell clearance.',
        items: [
          { name: 'Quercetin', dose: '500mg (pulsed)', timing: 'Pulsed protocol', purpose: 'Senolytic — clears senescent ("zombie") cells', supplementId: 'quercetin' },
          { name: 'Fisetin', dose: '100mg daily or 1g pulsed', timing: 'With fat', purpose: 'Potent senolytic flavonoid — stronger than quercetin in animal studies', evidenceNote: 'Early human data. Sinclair favours pulsed high-dose approach.' },
          { name: 'Spermidine', dose: '1mg/day', timing: 'Morning', purpose: 'Autophagy inducer — triggers cellular self-cleaning', evidenceNote: 'Found in aged cheese, wheat germ. Supplemental form under study.' },
        ],
      },
      {
        title: 'Lifestyle Practices',
        description: "Sinclair's non-supplement longevity practices — which he argues matter as much as pills.",
        items: [
          { name: 'Intermittent Fasting', dose: 'Skip breakfast — 16:8 or longer', timing: 'Daily', purpose: 'Activate AMPK, autophagy, sirtuin pathways via mild metabolic stress', evidenceNote: 'Sinclair has skipped breakfast for years. Uses hunger as a positive signal.' },
          { name: 'Cold exposure', dose: '2–3x/week cold shower or ice bath', timing: 'Post-exercise or morning', purpose: 'Norepinephrine release, mitochondrial biogenesis, brown fat activation', evidenceNote: 'Xenohormesis — mild stress that activates longevity pathways' },
          { name: 'Plant-heavy, low-meat diet', dose: 'Mostly plants, minimal red meat', timing: 'Daily', purpose: 'Reduce IGF-1 signalling, reduce mTOR activation — longevity-associated dietary pattern', evidenceNote: "Sinclair avoids excess protein — counter to Attia's approach. Key scientific debate." },
        ],
      },
    ],
    totalSupplements: 10,
    estimatedCost: '$80–150/month',
    difficulty: 'Intermediate',
    lastUpdated: '2024-10',
    disclaimer: "Sinclair's protocol includes metformin (prescription required) and supplements whose human evidence is still emerging. His own data is anecdotal. The scientific community has healthy debate about resveratrol's effects in humans.",
    affiliateDisclosure: 'LongevityLab earns a commission on some affiliate links.',
  },
]

export function getProtocolById(id: string) {
  return protocols.find(p => p.id === id) ?? null
}
