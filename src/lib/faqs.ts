export type FaqItem = { question: string; answer: string }

/** FAQs keyed by article slug or compare slug for FAQPage rich results. */
export const articleFaqs: Record<string, FaqItem[]> = {
  'best-nmn-supplements-2024': [
    {
      question: 'What is the best NMN supplement in 2026?',
      answer:
        'ProHealth Longevity NMN Pro is our top pick for purity testing, transparent dosing, and a usable 500mg serving. Tru Niagen (NR) is the best alternative if you prefer the NAD+ precursor with the longest clinical trial record.',
    },
    {
      question: 'Is NMN better than NR?',
      answer:
        'Both raise NAD+ in humans. NMN is one enzymatic step closer to NAD+; NR has more published RCTs and a longer safety record. The practical difference is modest for most healthy adults.',
    },
    {
      question: 'What dose of NMN should I take?',
      answer:
        'Most human trials used 250–500mg daily. Longevity protocols often use 500–1,000mg. Start lower for 8–12 weeks, track subjective recovery and training, and prioritise sleep and Tier 1 supplements first.',
    },
    {
      question: 'Is NMN safe?',
      answer:
        'Human trials up to roughly 1,000–1,200mg/day report good short-term safety. People with active cancer or high oncologic risk should discuss NAD+ precursors with a specialist. High-dose users sometimes add TMG as a methyl donor.',
    },
  ],
  'complete-longevity-stack': [
    {
      question: 'What supplements should I take for longevity first?',
      answer:
        'Start with Tier 1 foundations: vitamin D3+K2 (if deficient), magnesium glycinate, omega-3 EPA+DHA, creatine monohydrate, and taurine. Only add NMN/NR and specialty compounds after sleep, training, and protein are solid.',
    },
    {
      question: 'How much does a longevity stack cost per month?',
      answer:
        'A realistic Tier 1 stack is roughly $60–100/month. Adding Tier 2 compounds like NMN can bring total spend to about $180–300/month depending on brands and doses.',
    },
    {
      question: 'Should I test bloodwork before building a stack?',
      answer:
        'Yes. Test 25-OH vitamin D, metabolic markers, lipids (including ApoB if available), and other personal risk markers before high-dose stacking. Supplements work best when they fill a real gap.',
    },
  ],
  'sleep-hygiene-protocol': [
    {
      question: 'What is the highest-leverage sleep change for longevity?',
      answer:
        'A fixed wake time every day (including weekends), morning outdoor light within 30–60 minutes of waking, and a cool dark bedroom (about 18–20°C). Those three changes deliver most of the available benefit.',
    },
    {
      question: 'Do sleep supplements work better than sleep hygiene?',
      answer:
        'No. Magnesium, L-theanine, or melatonin can help some people, but they do not replace consistent circadian timing, light exposure, and temperature control.',
    },
    {
      question: 'How many hours of sleep do I need for longevity?',
      answer:
        'Most adults do best with 7–9 hours of consolidated sleep. Consistently under 6 hours is associated with higher cardiovascular and neurodegenerative risk in observational research.',
    },
  ],
  'best-home-saunas-infrared-2024': [
    {
      question: 'What is the best home infrared sauna for longevity?',
      answer:
        'Sunlighten mPulse Believe is our top full-spectrum pick. Clearlight Sanctuary 2 is strong for far-infrared and low EMF. SereneLife portable is the best budget entry to test consistency before buying a cabin.',
    },
    {
      question: 'How often should I use a sauna for healthspan benefits?',
      answer:
        'Finnish cohort data on traditional sauna suggests higher frequency (about 4–7 sessions/week) associates with lower cardiovascular mortality. Start gradually and get medical clearance if you have cardiovascular disease.',
    },
    {
      question: 'Is infrared as good as traditional sauna?',
      answer:
        'The strongest mortality data is from traditional Finnish saunas. Infrared can deliver useful heat stress at lower ambient temperatures and may suit home installation better. Protocol consistency matters more than perfect hardware.',
    },
  ],
  'cold-plunge-ice-bath-review': [
    {
      question: 'Is a $5,000 cold plunge worth it versus a DIY ice bath?',
      answer:
        'A chest-freezer DIY setup can reach similar temperatures for a few hundred dollars. Commercial units win on filtration, convenience, aesthetics, and maintenance. Budget users should start DIY or cold showers; heavy users may prefer a filtered plunge.',
    },
    {
      question: 'Should I cold plunge after strength training?',
      answer:
        'Avoid cold immersion immediately after hypertrophy training — it can blunt muscle adaptation. Prefer mornings, rest days, or after cardio if recovery is the goal.',
    },
    {
      question: 'How cold and how long should cold exposure be?',
      answer:
        'Many practical protocols use roughly 10–15°C for beginners and colder for advanced users, for 1–5 minutes depending on tolerance. Consistency and safe exit criteria matter more than extreme temperatures.',
    },
  ],
  'best-wearables-longevity-2024': [
    {
      question: 'What is the best wearable for longevity?',
      answer:
        'Oura Ring Gen 3 is our default for sleep-first users. WHOOP 4.0 is best for recovery and training load. Garmin Fenix 7 fits athletes who need GPS. Wear a CGM for at least one cycle to understand metabolic responses.',
    },
    {
      question: 'WHOOP or Oura for healthspan tracking?',
      answer:
        'WHOOP wins HRV and recovery coaching; Oura wins sleep staging, comfort, and lower subscription cost. Most people should pick one based on primary goal rather than owning both.',
    },
  ],
  'best-red-light-therapy-panels-2024': [
    {
      question: 'What is the best red light therapy panel for home use?',
      answer:
        'Mito Red Light MitoPRO 1500 is our best value full-body panel based on measured irradiance and dual-chip 660/850nm output. Joovv Solo 3.0 is the premium ecosystem choice. BioMax 300 suits targeted face/joint use.',
    },
    {
      question: 'How long should I use red light therapy?',
      answer:
        'Typical home protocols are 10–20 minutes per area at 6–12 inches, 3–5 times per week. More is not always better because of biphasic dose responses.',
    },
  ],
  'best-creatine-supplements': [
    {
      question: 'What is the best creatine for longevity?',
      answer:
        'Creatine monohydrate is the gold standard: cheapest, best studied, and effective for muscle and emerging cognitive endpoints. Premium forms like HCl rarely beat monohydrate in head-to-head evidence.',
    },
    {
      question: 'How much creatine should adults take daily?',
      answer:
        '3–5g monohydrate daily is the standard maintenance dose. Loading (20g/day for 5–7 days) is optional. Timing is less important than consistency.',
    },
  ],
  'best-magnesium-supplements': [
    {
      question: 'Which magnesium form is best for sleep?',
      answer:
        'Magnesium glycinate is our default for sleep and relaxation. L-threonate is better studied for cognitive endpoints; malate suits daytime energy. Avoid oxide for absorption.',
    },
    {
      question: 'How much magnesium should I supplement?',
      answer:
        'Many adults benefit from about 200–400mg elemental magnesium from supplements, depending on diet and form. People with kidney disease need medical guidance first.',
    },
  ],
  'best-omega-3-fish-oil': [
    {
      question: 'What is the best fish oil for longevity?',
      answer:
        'Carlson Elite Omega-3 is our best overall pick for EPA+DHA density and testing value. Nordic Naturals Ultimate Omega is our premium pick for triglyceride form and taste.',
    },
    {
      question: 'How much EPA and DHA do I need per day?',
      answer:
        'A practical longevity target is roughly 1–2g combined EPA+DHA daily for people who eat little fatty fish. Higher doses for triglycerides should be clinician-guided.',
    },
  ],
  'best-vitamin-d3-k2': [
    {
      question: 'Should I take vitamin K2 with vitamin D3?',
      answer:
        'Yes for most people using higher-dose D3. K2 (preferably MK-7) helps direct calcium toward bone rather than soft tissue. Take both with a fat-containing meal.',
    },
    {
      question: 'What blood level of vitamin D should I target?',
      answer:
        'Many longevity-oriented clinicians target roughly 40–60 ng/mL 25-OH vitamin D (some aim up to ~80). Test rather than guessing dose, especially above 5,000 IU/day.',
    },
  ],
  'nad-boosters-complete-guide': [
    {
      question: 'What is the best way to raise NAD+ levels?',
      answer:
        'NMN and NR are the best-studied oral precursors. Exercise, sleep, and metabolic health also support NAD+ biology. Niacin raises NAD+ cheaply but causes flushing.',
    },
    {
      question: 'Do I need TMG with NMN?',
      answer:
        'Some researchers recommend trimethylglycine (TMG) alongside high-dose NAD+ precursors to support methylation. Evidence is more theoretical than definitive, but it is a common low-risk addition.',
    },
  ],
  'best-longevity-supplements': [
    {
      question: 'What are the most evidence-backed longevity supplements?',
      answer:
        'Foundations first: omega-3, creatine, vitamin D3+K2, and magnesium. NAD+ precursors, taurine, ashwagandha, urolithin A, and berberine are secondary based on goals and labs.',
    },
  ],
}

export const compareFaqs: Record<string, FaqItem[]> = {
  'nmn-vs-nr': [
    {
      question: 'Should I take NMN or NR?',
      answer:
        'Take NMN if you want the more direct precursor with strong recent human data. Take NR if you prioritise the longer clinical safety record. Both raise NAD+; pick based on budget, tolerance, and brand testing quality.',
    },
    {
      question: 'Can I take NMN and NR together?',
      answer:
        'Some people alternate or combine, but most do not need both. Pick one evidence-backed product at a studied dose before stacking precursors.',
    },
  ],
  'whoop-vs-oura': [
    {
      question: 'Is WHOOP or Oura better for longevity?',
      answer:
        'Oura is usually better as a daily driver for sleep and comfort. WHOOP is better for recovery coaching and training load. Choose based on your primary metric, not marketing.',
    },
  ],
  'magnesium-forms': [
    {
      question: 'Glycinate, threonate, or malate — which magnesium should I buy?',
      answer:
        'Glycinate for sleep and general deficiency, L-threonate for cognitive focus, malate for daytime energy. Many people start with glycinate at night.',
    },
  ],
  'creatine-vs-hmb': [
    {
      question: 'Is creatine or HMB better for muscle and longevity?',
      answer:
        'Creatine monohydrate has a far larger evidence base for strength, muscle, and emerging cognitive outcomes. HMB may help in specific catabolic contexts but is not the default first buy.',
    },
  ],
  'cold-plunge-vs-ice-bath': [
    {
      question: 'Do I need a commercial cold plunge?',
      answer:
        'Not to get the physiology. DIY ice baths or chest freezers can reach similar temperatures. Commercial plunges buy convenience, filtration, and consistency.',
    },
  ],
  'sauna-types': [
    {
      question: 'Infrared or traditional sauna for longevity?',
      answer:
        'Traditional sauna has the strongest population mortality data. Infrared is often easier at home and still provides useful heat stress. Consistency of use beats perfection of modality.',
    },
  ],
}

export function getArticleFaqs(slug: string): FaqItem[] {
  return articleFaqs[slug] ?? []
}

export function getCompareFaqs(slug: string): FaqItem[] {
  return compareFaqs[slug] ?? []
}

export function faqJsonLd(faqs: FaqItem[]) {
  if (faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}
