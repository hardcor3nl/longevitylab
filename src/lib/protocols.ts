export interface ProtocolSupplement {
  name: string
  dose: string
  timing: string
  purpose: string
  evidenceNote?: string
  supplementId?: string
  isRx?: boolean
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
  // ─── BRYAN JOHNSON ────────────────────────────────────────────────────
  {
    id: 'bryan-johnson',
    expert: 'Bryan Johnson',
    title: "Bryan Johnson's Blueprint Protocol (2025)",
    slug: 'bryan-johnson-blueprint-protocol',
    description: "The most extensively documented longevity protocol in history. Bryan Johnson spends ~$2M/year attempting to reverse biological aging with a 100+ compound daily stack, strict noon cutoff diet, and a team of 30+ physicians.",
    longDescription: "Bryan Johnson sold Braintree/Venmo to PayPal for $800M and redirected his life and fortune toward a single goal: don't die. His Blueprint protocol is publicly documented at protocol.bryanjohnson.com and updated monthly. It includes daily blood draws, continuous glucose monitoring, nightly MRI sleep tracking, quarterly full-body imaging, and over 100 biomarker tests. The protocol is managed algorithmically — Johnson removed human willpower from the equation entirely.",
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=85',
    expertImage: '/experts/bryan-johnson.jpg',
    role: 'Tech entrepreneur, founder of Blueprint, CEO of OS Fund',
    website: 'protocol.bryanjohnson.com',
    approach: 'Algorithmic self-optimisation — remove human decision-making, follow biomarker data exclusively',
    keyPhilosophy: [
      '"Don\'t die" — death prevention as the singular life mission',
      'Algorithms over willpower: all health decisions made by data, not cravings or mood',
      'Eating window closes at noon — 23-hour fast daily, all calories consumed in the morning',
      'Measure everything: 100+ biomarkers monthly, continuous glucose, nightly sleep staging, quarterly full-body MRI',
      'Blueprint Stack: 74 compounds in one system — the world\'s most documented supplement protocol',
      'Exercise 1 hour every single day without exception',
      'Sleep is the highest priority: 8:30pm bedtime, blackout room, temperature controlled',
    ],
    sections: [
      {
        title: 'Pre-Workout & Morning Nutrition (5:25–5:35 AM)',
        description: 'Johnson begins every day the same way. Pre-workout comes first, then the primary meal immediately after training. All food is consumed by noon.',
        items: [
          { name: 'Blueprint Longevity Mix', dose: '1 scoop', timing: '5:25 AM pre-workout', purpose: 'Comprehensive micronutrient foundation — 74 compounds including vitamins, minerals, polyphenols, and longevity compounds', evidenceNote: 'Johnson\'s proprietary formulation. Contains CA-AKG, glucosamine sulfate, hyaluronic acid, and numerous compounds not found in standard multivitamins' },
          { name: 'Creatine Monohydrate', dose: '7.5g total (5g + 2.5g in mix)', timing: 'Pre-workout', purpose: 'Muscle strength, cognitive neuroprotection, mitochondrial health', evidenceNote: 'One of the most evidence-backed supplements — 500+ studies', supplementId: 'creatine' },
          { name: 'Prebiotic Fibre Stack', dose: 'GOS 0.5 tsp + Inulin 1 tsp + Arabinogalactan 1 tsp', timing: 'Morning', purpose: 'Microbiome diversity, gut barrier integrity, SCFA production', evidenceNote: 'Johnson measures his gut microbiome monthly via stool testing — the most quantified microbiome protocol in existence' },
          { name: 'Blueprint Collagen Peptides', dose: '11g', timing: 'Post-workout breakfast', purpose: 'Connective tissue, joint health, skin structure', evidenceNote: 'Vitamin C cofactor required for collagen synthesis — also included in the mix' },
          { name: 'Extra Virgin Olive Oil (Snake Oil)', dose: '30mL (2 tablespoons)', timing: 'With breakfast', purpose: 'Oleocanthal (anti-inflammatory), polyphenols, fat-soluble nutrient absorption', evidenceNote: 'Johnson launched his own EVOO brand "Snake Oil" — cold-pressed, third-party polyphenol tested' },
          { name: 'NMN or NR (alternating)', dose: 'NMN 500mg OR NR 450mg', timing: 'With breakfast', purpose: 'NAD+ precursor — restores declining NAD+ with age', evidenceNote: 'Johnson alternates between NMN and NR 6 days per week. Recent data suggests cycling may prevent adaptation.', supplementId: 'nmn' },
          { name: 'EPA/DHA Omega-3', dose: '800mg EPA/DHA/DPA', timing: 'With breakfast', purpose: 'Cardiovascular protection, neurological health, anti-inflammation', supplementId: 'omega3' },
          { name: 'Ashwagandha + Rhodiola', dose: 'KSM-66 Ashwagandha 120mg + Rhodiola 120mg', timing: 'Morning', purpose: 'Cortisol regulation, adaptogenic stress response, cognitive clarity', supplementId: 'ashwagandha' },
        ],
      },
      {
        title: 'Prescription Medications (Noon)',
        description: 'Johnson takes all prescription medications at noon with his final calorie intake of the day. Several are among the most investigated longevity drugs in science.',
        items: [
          { name: 'Metformin', dose: '500mg (6-week on/off cycles)', timing: 'Noon with food', purpose: 'AMPK activation, glucose regulation, longevity signalling via AMPK pathway', evidenceNote: 'Rx only. Johnson cycles metformin 6 weeks on, 6 weeks off to prevent adaptation. Unlike Attia, he has not abandoned metformin.', isRx: true },
          { name: 'Acarbose', dose: '200mg', timing: 'With meals', purpose: 'Blunts post-meal glucose spikes by inhibiting alpha-glucosidase enzyme. Extended ITP mouse lifespan.', evidenceNote: 'Rx only. One of only 3 drugs to extend lifespan in the Interventions Testing Program (ITP). Johnson wears a CGM and tracks glucose responses in real time.', isRx: true },
          { name: 'Jardiance (Empagliflozin)', dose: '10mg', timing: 'Morning', purpose: 'SGLT2 inhibitor — reduces cardiovascular mortality, renal protection, metabolic benefits', evidenceNote: 'Rx only. Originally a diabetes drug with extraordinary cardiovascular mortality data (EMPA-REG trial: 38% reduction in CV death). Attia also uses SGLT2i for high-risk patients.', isRx: true },
          { name: 'Candesartan', dose: '8mg', timing: 'Daily', purpose: 'ARB blood pressure agent with emerging neuroprotective and longevity data', evidenceNote: 'Rx only. ARBs (angiotensin receptor blockers) have epidemiological associations with reduced dementia risk beyond blood pressure effects.', isRx: true },
          { name: 'Repatha (Evolocumab)', dose: '140mg injection every 2 weeks', timing: 'Biweekly injection', purpose: 'PCSK9 inhibitor — aggressively lowers LDL-C and ApoB to near-zero cardiovascular risk range', evidenceNote: 'Rx only. Johnson targets ApoB under 60 mg/dL — the most aggressive cardiovascular prevention stance available outside clinical trials.', isRx: true },
          { name: 'Armour Thyroid + Levothyroxine', dose: '60mg + 100mcg', timing: 'Daily', purpose: 'Thyroid hormone replacement and optimisation', evidenceNote: 'Rx only. Johnson discovered suboptimal thyroid function via comprehensive testing. Many people have subclinical thyroid dysfunction that goes undetected.', isRx: true },
          { name: 'Tadalafil (Cialis)', dose: '2.5–5mg', timing: 'Daily', purpose: 'PDE5 inhibitor — vasodilation, erectile function, potential cardiovascular and neuroprotective benefits', evidenceNote: 'Rx only. Low-dose daily tadalafil improves endothelial function. Emerging data on longevity and neurological protection.', isRx: true },
          { name: 'Oral Minoxidil', dose: '3.75mg', timing: 'Daily', purpose: 'Hair retention — systemic vasodilator at low doses', evidenceNote: 'Rx only. Johnson developed significant hair thinning. Oral minoxidil at low dose is effective and increasingly prescribed off-label.', isRx: true },
        ],
      },
      {
        title: 'Diet: The Super Veggie & Noon Cutoff',
        description: 'Food is medicine in the Blueprint protocol. Johnson eats the same meals daily — removing decision fatigue and optimising every calorie for longevity nutrients.',
        items: [
          { name: 'Super Veggie Bowl', dose: '1 bowl', timing: 'Post-workout breakfast (primary meal)', purpose: 'Lentils + broccoli + cauliflower + mushrooms + garlic + ginger + lime + hemp seeds + olive oil. Designed to maximise polyphenols, fibre, and plant protein.', evidenceNote: 'Broccoli sprouts (sulforaphane), garlic (allicin), mushrooms (beta-glucans), and hemp seeds (complete protein) all have individual longevity evidence bases.' },
          { name: 'Noon Food Cutoff', dose: 'All food consumed by 12:00 PM', timing: 'Daily protocol', purpose: 'AMPK activation, autophagy induction, metabolic flexibility, growth hormone release during fasting period', evidenceNote: 'Johnson\'s 23-hour fasting window is the most aggressive time-restriction protocol among longevity experts. He reports fasting IGF-1 at levels 40% below population average.' },
          { name: 'Caloric Restriction 10%', dose: '2,250 kcal/day (~10% below calculated TDEE)', timing: 'Daily', purpose: 'Mild CR activates longevity pathways (AMPK, sirtuins) without sarcopenia risk', evidenceNote: 'Johnson tracks macros precisely: 130g protein (25%), 206g carbs (35%), 101g fat (40%). Macros optimised per his regular body composition testing.' },
        ],
      },
      {
        title: 'Brain Protection — 2026 Additions',
        description: 'Johnson updated his stack significantly in early 2026: he dropped rapamycin entirely after concluding the immunosuppression tradeoff wasn\'t justified by his biomarkers, cut NMN/NR from daily to 6 days a week, and added two new compounds focused specifically on neuroprotection.',
        items: [
          { name: 'Lithium Orotate', dose: 'Microdose (sub-clinical, well below bipolar treatment range)', timing: 'Included in Blueprint Essential Capsules', purpose: 'Neuroprotection — trace lithium is associated with lower dementia rates in population studies of municipal water supplies', evidenceNote: 'Not the high-dose lithium carbonate used for bipolar disorder. Epidemiological data (not RCTs) links higher trace lithium in drinking water to reduced all-cause and dementia mortality. Consult a physician before supplementing — lithium has a narrow safety margin and requires blood monitoring at any meaningful dose.', supplementId: 'lithium-orotate' },
          { name: 'NDGA (Nordihydroguaiaretic Acid)', dose: '50mg', timing: 'Daily', purpose: 'One of only a handful of compounds with replicated lifespan extension in the NIA Interventions Testing Program (ITP) — extended median lifespan in male mice', evidenceNote: 'ITP data is the gold standard for mouse longevity compounds (multi-site, genetically diverse mice). Human data is essentially nonexistent — Johnson is testing this entirely on ITP mouse evidence plus his own biomarker tracking.', supplementId: 'ndga' },
        ],
      },
      {
        title: 'Exercise Protocol (6 Hours/Week)',
        description: 'Johnson trains 60–90 minutes every single morning, combining strength, cardio, flexibility, and balance work — treating the daily session as a non-negotiable habit rather than a decision made fresh each day.',
        items: [
          { name: 'Daily Combined Session', dose: '60–90 minutes', timing: '6:00–7:30 AM, every day', purpose: 'Strength, cardio, flexibility, and balance combined into a single session to remove decision fatigue around "what workout today"', evidenceNote: 'Weekly target is 6 hours total: 3 strength sessions, 3 cardio sessions. Johnson\'s stated principle is "do it every day, no matter what" — automating exercise as identity rather than choice.' },
          { name: 'Zone 2 Cardio', dose: '150 min/week moderate intensity', timing: 'Within daily sessions', purpose: 'Conversation-maintainable aerobic base — mitochondrial density, metabolic flexibility, cardiovascular longevity', evidenceNote: 'Matches the Zone 2 volume most longevity physicians (including Attia) recommend as a baseline aerobic foundation.' },
          { name: 'HIIT / Vigorous Cardio', dose: '75 min/week vigorous intensity', timing: 'Within daily sessions', purpose: 'VO₂ max development — the cardio metric with the single strongest association with all-cause mortality reduction in observational data', evidenceNote: 'Vigorous = unable to hold a conversation. Combined with Zone 2 volume, matches current exercise-longevity literature recommending both zones rather than either alone.' },
          { name: 'Micro-Movement Breaks', dose: '2–3 minutes', timing: 'Every 30 minutes throughout the day', purpose: 'Counters the metabolic and vascular harm of prolonged sitting independent of total exercise volume', evidenceNote: 'Light movement (walking, stretching, bodyweight exercises) every 30 minutes — plus 5–10 minutes of activity after each meal to blunt post-meal glucose spikes.' },
        ],
      },
      {
        title: 'Advanced Recovery — Sauna, HBOT & Shockwave',
        description: 'Johnson\'s morning routine includes a stack of recovery therapies most people never encounter outside elite sports medicine. The measured before/after biomarker data from these sessions is unusually well documented for a self-experimenter.',
        items: [
          { name: 'Dry Sauna', dose: '175°F (93°C), 20 minutes', timing: '7:30 AM, daily', purpose: 'Cardiovascular conditioning, heat shock protein activation, toxin clearance', evidenceNote: 'After 15–23 sessions, Johnson documented undetectable levels of several urinary toxins (MEP, MEHP, perchlorate all reduced to zero) plus a 12.6% reduction in central blood pressure. Uses ice pack on groin for testicular protection — critical detail: 15 sessions WITHOUT ice protection caused a 54–57% decline in his sperm motility and concentration, which recovered with ice protection over subsequent sessions.', isRx: false },
          { name: 'Red & Near-Infrared Light Therapy', dose: '6 minutes', timing: '8:00 AM and evening, 2x daily', purpose: 'Photobiomodulation — mitochondrial ATP production, skin and hair follicle stimulation' },
          { name: 'Hyperbaric Oxygen Therapy (HBOT)', dose: '60–90 minutes at 2 atmospheres, 100% oxygen', timing: '9:00 AM, most weekdays (alternates with IHHT)', purpose: 'Increases tissue oxygenation, stimulates angiogenesis and stem cell mobilisation', evidenceNote: 'After 60 sessions, Johnson documented a 2.6% increase in telomere length and telomerase activity consistent with a 12-year-younger biological age by that specific marker, plus a 300% increase in VEGF (vascular growth factor) and a 28.6% reduction in pTAU217, a blood biomarker associated with dementia risk. These are self-reported single-subject results, not a controlled trial — read as hypothesis-generating, not proof.', isRx: false },
          { name: 'Shockwave Therapy', dose: '4,500 shocks per session, intensity level 14', timing: '8:15 AM, 3x per week', purpose: 'Applied to spine, shoulders, hips, knees and other joints — stimulates blood vessel formation and tissue regeneration in tendons and connective tissue' },
        ],
      },
      {
        title: 'Sleep & Evening Protocol',
        description: 'Johnson treats sleep as the highest-priority health intervention. His evening protocol is as rigid as his morning one.',
        items: [
          { name: 'Sleep Timing', dose: '8:30 PM bedtime, 5:00 AM wake', timing: 'Every night without exception', purpose: '8.5 hours in bed. Johnson tracks sleep with Oura Ring and nightly EEG headband. Deep sleep percentage is a primary optimisation target.', evidenceNote: 'No food after noon, no liquids after 4 PM — reduces nocturnal digestion and bathroom interruptions. Johnson\'s deep sleep is documented at levels significantly above population average.' },
          { name: 'Melatonin', dose: '0.25–0.5mg (very low dose)', timing: '30 min before 8:30 PM bedtime', purpose: 'Circadian signal — Johnson uses pharmacologically accurate dose, not the 5–10mg commonly sold OTC', evidenceNote: 'Research shows 0.3mg is the dose that matches endogenous melatonin levels. Most OTC doses (5–10mg) are 10–30x higher than needed — causing receptor downregulation over time.' },
          { name: 'Blueprint Skin Protocol', dose: 'Cleanser + Serum + Moisturiser + Tretinoin 0.025%', timing: '8:00 PM', purpose: 'Skin biological age reduction — Johnson has documented facial age reversal via VISIA skin analysis', evidenceNote: 'Tretinoin is the only topical ingredient with RCT evidence for reversing photoaging. Prescription only. Johnson\'s skin biological age is documented as significantly younger than chronological age.' },
        ],
      },
    ],
    totalSupplements: 100,
    estimatedCost: '$1,000–2,000/month (supplements only). Full protocol ~$2M/year with physician team.',
    difficulty: 'Advanced',
    lastUpdated: '2026-06',
    disclaimer: "Bryan Johnson's protocol is the most extreme documented longevity intervention in existence. Most items require prescriptions (metformin, acarbose, Jardiance, Repatha, Candesartan, thyroid medications, tadalafil, minoxidil). Note: Johnson discontinued rapamycin in 2024 after concluding the immunosuppression tradeoff wasn't justified by his biomarkers — it is no longer part of his protocol despite frequent claims otherwise. This page is strictly educational. Do not replicate prescription or lithium elements without physician oversight and blood monitoring. Johnson is testing himself as an experiment of one — not as a clinical trial.",
    affiliateDisclosure: 'Longevity Intel earns a commission on some affiliate links. This never influences our coverage.',
  },

  // ─── PETER ATTIA ──────────────────────────────────────────────────────
  {
    id: 'peter-attia',
    expert: 'Peter Attia, MD',
    title: "Dr. Peter Attia's Longevity Protocol (2025)",
    slug: 'peter-attia-longevity-protocol',
    description: "The complete Medicine 3.0 longevity framework — exercise as the primary drug, aggressive lipid management, and targeted supplementation from one of the world's leading longevity physicians.",
    longDescription: "Dr. Peter Attia is a physician who trained at Johns Hopkins and Stanford. His podcast The Drive and book Outlive have made him the most influential voice in preventive longevity medicine. His framework, Medicine 3.0, advocates for proactive health optimisation decades before disease onset — the opposite of conventional medicine's reactive model. Attia has publicly updated his protocol significantly: he dropped metformin after concluding it blunts exercise adaptation, doubled down on rapamycin, and increasingly emphasises exercise above all supplements.",
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85',
    expertImage: '/experts/peter-attia.jpg',
    role: 'Physician (MD, Johns Hopkins/Stanford), host of The Drive podcast, author of Outlive',
    website: 'peterattiamd.com',
    approach: 'Medicine 3.0 — proactive, personalised health optimisation. Exercise is the most potent longevity drug.',
    keyPhilosophy: [
      'Exercise is the single most potent longevity intervention — VO2 max and muscle mass are the strongest predictors of lifespan',
      'The four horsemen: cardiovascular disease, cancer, neurodegeneration, metabolic dysfunction — address all proactively before symptoms',
      '"Outlive" thinking: optimise not just for lifespan but for healthspan — functioning at 85 like most 65-year-olds',
      'Dropped metformin: publicly concluded exercise benefits outweigh metformin benefits for non-diabetics',
      'Bloodwork every 6 months minimum, targets ApoB under 60 mg/dL — the most aggressive lipid target in clinical practice',
      'Emotional health is the sixth pillar of longevity — often the most neglected and most impactful',
    ],
    sections: [
      {
        title: 'Exercise: The Primary Drug',
        description: 'Attia considers exercise his most important longevity intervention — more impactful than any supplement or drug. He targets specific performance benchmarks for his age.',
        items: [
          { name: 'Zone 2 Cardio', dose: '4+ hours per week', timing: 'Distributed across week, never back-to-back days', purpose: 'Mitochondrial biogenesis, metabolic flexibility, cardiovascular efficiency. Attia targets lactate under 2 mmol/L — true Zone 2.', evidenceNote: 'Attia uses a Wahoo trainer with lactate meter to confirm true Zone 2. He considers this the foundation of all other training.' },
          { name: 'VO2 Max Intervals', dose: '2 sessions per week, 4x4 Norwegian protocol', timing: 'Separate from Zone 2 days', purpose: 'VO2 max is the single strongest predictor of longevity. Each 1 MET improvement reduces all-cause mortality ~13%.', evidenceNote: 'Attia targets top 2% VO2 max for his age — approximately 55+ ml/kg/min at 50. He considers moving from low to above-average VO2 max more impactful than quitting smoking.' },
          { name: 'Strength Training', dose: '3 sessions per week', timing: 'Non-consecutive days', purpose: 'Anti-sarcopenic intervention. Muscle mass is independently predictive of longevity. Attia targets 1g protein per lb bodyweight daily.', evidenceNote: 'Focuses on dead hangs, farmer carries, and functional movements that preserve independence into old age.' },
          { name: 'Stability and Mobility', dose: 'Daily, 15–30 min', timing: 'Morning or pre-workout', purpose: 'Injury prevention, fall prevention — falls are a leading cause of death in the elderly. Attia works with ATC (Attia Training Company) protocols.', evidenceNote: 'Attia integrates DNS (Dynamic Neuromuscular Stabilisation) and specific stability work around every training session.' },
        ],
      },
      {
        title: 'Foundation Supplements',
        description: "Supplements Attia takes daily regardless of biomarker status — his nutritional insurance policy.",
        items: [
          { name: 'Omega-3 (EPA/DHA)', dose: '2–4g EPA+DHA', timing: 'With meals', purpose: 'Cardiovascular risk reduction, anti-inflammatory, cognitive protection. Attia considers this one of his highest-confidence supplements.', supplementId: 'omega3' },
          { name: 'Vitamin D3 + K2', dose: '5,000 IU D3 + 180mcg MK-7 K2', timing: 'Morning with fat', purpose: 'Immune function, bone health, cardiovascular. Tests 25-OH-D quarterly, targets 40–60 ng/mL.' },
          { name: 'Magnesium L-Threonate', dose: '2g (144mg elemental Mg)', timing: 'Evening', purpose: 'Sleep quality, cognitive function, cardiovascular. L-Threonate crosses the blood-brain barrier more effectively than other forms.' },
          { name: 'Creatine Monohydrate', dose: '5g/day', timing: 'Anytime — consistency over timing', purpose: 'Muscle, cognitive neuroprotection. Attia calls it one of his highest-confidence supplements alongside omega-3.', supplementId: 'creatine' },
          { name: 'Zinc', dose: '25–45mg', timing: 'With dinner', purpose: 'Immune function, testosterone support, protein synthesis. Higher end during training blocks.', evidenceNote: 'Attia tests zinc status — supplementation only if borderline deficient.' },
          { name: 'Glycine', dose: '3g', timing: 'Before bed', purpose: 'Sleep quality, core body temperature reduction, collagen synthesis, anti-aging via methylation support', evidenceNote: 'Low safety risk, modest evidence for sleep quality improvement. Attia considers it a reasonable add-on.' },
        ],
      },
      {
        title: 'Metabolic & Longevity Interventions',
        description: "Attia's most discussed longevity pharmacology — including his public decisions to drop metformin and add rapamycin.",
        items: [
          { name: 'Rapamycin', dose: '8mg/week (takes breaks for mouth sores)', timing: 'Once weekly', purpose: 'mTOR inhibition — the most evidence-backed longevity drug in animal models. Extends lifespan in every species tested.', evidenceNote: 'Rx only. Attia considers this the most compelling pharmacological longevity intervention. Takes breaks when mouth sores (common side effect) occur. Not for everyone — requires physician monitoring.', isRx: true },
          { name: 'Berberine', dose: '500mg 2x/day with meals', timing: 'With meals', purpose: 'AMPK activator — replaced metformin for training days. Improves insulin sensitivity without blunting exercise adaptation.', evidenceNote: 'Attia publicly dropped metformin after the MILES trial showed blunted muscle adaptation with exercise. Berberine provides similar AMPK activation without this effect.', supplementId: 'berberine' },
          { name: 'PCSK9 Inhibitor or Statin', dose: 'Individualised to Rx', timing: 'As prescribed', purpose: 'Attia targets ApoB under 60 mg/dL — one of the most aggressive cardiovascular prevention stances in mainstream medicine', evidenceNote: 'Rx only. Attia is explicit: he considers ApoB the most important modifiable longevity biomarker. Most people need pharmacological support to reach under 60 mg/dL.', isRx: true },
        ],
      },
      {
        title: 'Sleep Optimisation',
        description: 'Attia calls sleep "the single most powerful anti-aging tool we have that does not require a prescription."',
        items: [
          { name: 'Sleep Tracking', dose: 'WHOOP or Oura nightly', timing: 'Continuous', purpose: 'HRV, sleep staging, respiratory rate — data to guide recovery decisions. Attia tracks sleep data alongside bloodwork to understand cumulative load.', evidenceNote: 'Attia is explicit that sleep quality is more important than most supplements combined. He targets 7–9 hours consistently.' },
          { name: 'Ashwagandha KSM-66', dose: '600mg', timing: 'Evening during high-stress periods', purpose: 'Cortisol reduction, sleep quality support during high-stress periods', supplementId: 'ashwagandha' },
          { name: 'Trazodone (situational)', dose: '50–100mg', timing: 'As needed', purpose: 'Sleep continuity during travel or high-stress periods', evidenceNote: 'Rx only. Attia uses this sparingly — sleep hygiene and behavioural interventions are the foundation. Medication is a last resort.', isRx: true },
        ],
      },
    ],
    totalSupplements: 12,
    estimatedCost: '$150–300/month (excluding Rx)',
    difficulty: 'Advanced',
    lastUpdated: '2025-01',
    disclaimer: "Attia's protocol is personalised to his specific bloodwork, genetics, and health history. Rapamycin, statins/PCSK9 inhibitors, and trazodone require physician prescriptions. His public position on many interventions has evolved — always check his current podcast for updates.",
    affiliateDisclosure: 'Longevity Intel earns a commission on some affiliate links. This never influences our coverage.',
  },

  // ─── ANDREW HUBERMAN ──────────────────────────────────────────────────
  {
    id: 'andrew-huberman',
    expert: 'Andrew Huberman, PhD',
    title: "Dr. Andrew Huberman's Supplement Protocol (2025)",
    slug: 'andrew-huberman-supplement-protocol',
    description: "Stanford neuroscientist Andrew Huberman's complete supplement stack — from his AG1 morning foundation and sleep stack to his testosterone support protocol and cognitive performance compounds.",
    longDescription: "Dr. Andrew Huberman is a Professor of Neurobiology and Ophthalmology at Stanford School of Medicine. His Huberman Lab podcast reaches 50+ million monthly listeners and has done more to popularise evidence-based health tools than perhaps any media platform in history. His philosophy is behaviour-first: morning sunlight, cold exposure, NSDR, and sleep quality precede any supplement recommendation. Huberman has updated his stack significantly in 2024–2025 — adding grape seed extract and boron, cycling out consistent NMN use, and refining his testosterone support protocol.",
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85',
    expertImage: '/experts/andrew-huberman.jpg',
    role: 'Professor of Neurobiology, Stanford School of Medicine. Host of Huberman Lab podcast.',
    website: 'hubermanlab.com',
    approach: 'Behaviour-first neuroscience — foundational behaviours (light, sleep, exercise, stress) before supplements',
    keyPhilosophy: [
      'Foundational behaviours first: morning sunlight, quality sleep, Zone 2 exercise, breathwork',
      'Delay caffeine 90–120 minutes after waking to allow adenosine clearance — avoids afternoon energy crash',
      'Non-sleep deep rest (NSDR / Yoga Nidra) for 10–20 min daily — as effective as sleep for dopamine restoration',
      'Supplements are "tools for the specific job" — not a foundation, not magic',
      'Cold exposure 3–5x/week as a deliberate stress inoculation practice',
      'Testosterone is modifiable: sleep, training, stress management, and targeted supplementation all move the needle',
    ],
    sections: [
      {
        title: 'Daily Foundation',
        description: "Huberman's consistent daily stack — taken year-round regardless of circumstances.",
        items: [
          { name: 'AG1 (Athletic Greens)', dose: '1 scoop in water', timing: 'Morning, fasted before eating', purpose: 'Comprehensive micronutrient foundation — greens, probiotics, adaptogens, enzymes. Huberman has been a paid partner since 2021.', evidenceNote: 'AG1 is a disclosed sponsorship. Independently: useful as a micronutrient insurance policy, particularly for those with inconsistent vegetable intake. Not a substitute for whole food nutrition.' },
          { name: 'Omega-3 (EPA/DHA)', dose: '2,000mg EPA/DHA', timing: 'With food', purpose: 'Mood, cognition, cardiovascular health, anti-inflammation. Huberman calls this the supplement he would take if he could only take one.', supplementId: 'omega3' },
          { name: 'Vitamin D3', dose: '5,000–10,000 IU', timing: 'Morning with fat', purpose: 'Immune function, mood, testosterone support, bone health. Huberman tests his levels and adjusts dose to maintain 50–70 ng/mL.' },
          { name: 'Creatine Monohydrate', dose: '5g/day', timing: 'Anytime — consistency matters', purpose: 'Muscle performance, cognitive function, brain protection. Huberman added creatine to his daily stack in 2023 after reviewing the cognitive evidence.', supplementId: 'creatine' },
          { name: 'Grape Seed Extract', dose: '400–800mg', timing: 'With food', purpose: 'Vascular function — OPCs in grape seed extract support endothelial health and nitric oxide production', evidenceNote: 'Huberman added this in 2024. Moderately evidenced for blood pressure and vascular function.' },
          { name: 'Opti-Men Multivitamin', dose: '2–3 tablets', timing: 'With food', purpose: 'Micronutrient insurance — covers gaps in B vitamins, minerals, and trace elements', evidenceNote: 'Huberman uses a high-potency multivitamin on days when AG1 is not available, or in combination.' },
        ],
      },
      {
        title: 'Sleep Stack',
        description: "Huberman's most requested protocol — the sleep stack he takes nightly. Emphasis: these supplements improve sleep onset and quality, not quantity. Sleep hygiene comes first.",
        items: [
          { name: 'Magnesium L-Threonate or Bisglycinate', dose: '300–400mg', timing: '30–60 min before bed', purpose: 'GABA modulation, sleep onset, cognitive protection. L-Threonate crosses the blood-brain barrier; bisglycinate provides better GI tolerance.' },
          { name: 'Apigenin', dose: '50mg', timing: '30–60 min before bed', purpose: 'Mild anxiolytic — binds GABA-A receptors. Found naturally in chamomile. Reduces anxiety without sedation.', evidenceNote: 'Huberman considers this a "subtle but real" sleep-onset aid. Modest clinical evidence but very safe. Not recommended if prone to vivid dreams.' },
          { name: 'L-Theanine', dose: '100–200mg', timing: '30–60 min before bed', purpose: 'Alpha wave induction — calming without sedation. Synergistic with magnesium for sleep onset.', evidenceNote: 'Huberman cautions: do NOT take L-Theanine if prone to vivid or intense dreams — it significantly amplifies dream vividness in some people. Start at 100mg to test.' },
          { name: 'Glycine', dose: '2–3g', timing: '30 min before bed', purpose: 'Core body temperature reduction, sleep quality, collagen synthesis', evidenceNote: 'Occasional addition for Huberman — not every night. Glycine lowers core body temperature which facilitates sleep onset. Safe, low cost.' },
          { name: 'GABA (occasional)', dose: '100mg', timing: 'Before bed when stressed', purpose: 'GABAergic calming — Huberman uses rarely, primarily during high-stress periods', evidenceNote: 'Huberman is cautious about GABA supplementation becoming habitual. Uses situationally.' },
        ],
      },
      {
        title: 'Testosterone & Hormone Support',
        description: "Huberman's testosterone optimisation protocol — focusing on evidence-based compounds that support the HPG axis without testosterone replacement.",
        items: [
          { name: 'Tongkat Ali (Longjack)', dose: '400mg', timing: 'Morning', purpose: 'Stimulates LH (luteinising hormone) release → increases endogenous testosterone production. Reduces SHBG.', evidenceNote: 'Huberman considers this the most evidence-backed natural testosterone support supplement. 3+ human RCTs showing meaningful T increases in deficient men.' },
          { name: 'Fadogia Agrestis', dose: '600mg', timing: 'Morning', purpose: 'LH stimulation through different mechanism than Tongkat Ali — potentially additive effect', evidenceNote: 'Huberman cycles: 8 weeks on, 2 weeks off. Fewer human studies than Tongkat Ali. Huberman advocates cycling to prevent LH receptor desensitisation.' },
          { name: 'Zinc', dose: '15–25mg', timing: 'Evening with food', purpose: 'Essential cofactor for testosterone synthesis and immune function. Deficiency directly suppresses testosterone.', evidenceNote: 'Huberman recommends testing zinc status. Only supplement if deficient or borderline. Essential during high training loads when zinc losses increase via sweat.' },
          { name: 'Boron', dose: '2–4mg', timing: 'Daily with food', purpose: 'Reduces SHBG, increases free testosterone, supports bone density and joint health', evidenceNote: 'Added to Huberman\'s protocol in 2024. Small human studies show boron supplementation reduces SHBG by 20–25%, meaningfully increasing free testosterone.' },
        ],
      },
      {
        title: 'Focus & Cognitive Performance',
        description: 'Situational supplements for demanding cognitive work — not taken daily.',
        items: [
          { name: 'Alpha-GPC', dose: '300mg', timing: '30 min before cognitive work sessions', purpose: 'Acetylcholine precursor — enhances focus, working memory, and learning consolidation', evidenceNote: 'Huberman cycles this — not daily. Excessive acetylcholine can cause brain fog in some. 300mg is conservative. Used on high-output creative or analytical work days.' },
          { name: 'L-Tyrosine', dose: '500mg', timing: '30 min before demanding or stressful tasks', purpose: 'Dopamine and norepinephrine precursor — motivation, focus under pressure, stress resilience', evidenceNote: 'Context-dependent. Huberman notes L-Tyrosine is most effective for maintaining performance under stress — not for baseline performance in low-stress conditions.' },
          { name: 'Caffeine', dose: '100–200mg', timing: '90–120 min after waking (NOT immediately)', purpose: 'Adenosine antagonist — enhanced alertness, physical performance', evidenceNote: 'Critical timing note: Huberman delays caffeine 90 min to allow natural adenosine clearance. Immediate caffeine just delays the adenosine crash — delaying it eliminates the crash entirely. This is one of his most popularised "tools".' },
          { name: 'Ashwagandha KSM-66', dose: '600mg', timing: 'Evening during high-stress periods', purpose: 'Cortisol reduction, HPG axis support, sleep quality', evidenceNote: 'Huberman cycles ashwagandha — uses during stressful periods, takes breaks. Cycles prevent HPA axis adaptation.', supplementId: 'ashwagandha' },
        ],
      },
    ],
    totalSupplements: 15,
    estimatedCost: '$120–200/month',
    difficulty: 'Intermediate',
    lastUpdated: '2025-01',
    disclaimer: "Huberman's protocol evolves frequently — always check his current podcast episodes for updates. AG1 is a paid sponsorship. Fadogia Agrestis has limited human safety data — Huberman himself recommends cycling and monitoring.",
    affiliateDisclosure: 'Longevity Intel earns a commission on some affiliate links. This never influences our coverage.',
  },

  // ─── DAVID SINCLAIR ───────────────────────────────────────────────────
  {
    id: 'david-sinclair',
    expert: 'David Sinclair, PhD',
    title: "David Sinclair's Longevity Protocol (2025)",
    slug: 'david-sinclair-longevity-protocol',
    description: "Harvard genetics professor David Sinclair's evolving supplement stack — updated with his June 2025 interview data. NMN, resveratrol, fisetin (kept), quercetin (dropped), berberine replacing metformin, and new additions.",
    longDescription: "Dr. David Sinclair is Professor of Genetics at Harvard Medical School and co-director of the Paul F. Glenn Center for Biology of Aging Research. His 2019 book Lifespan and his Information Theory of Aging established him as the most widely read longevity scientist in the world. His protocol has evolved significantly from the one described in Lifespan: he dropped quercetin in 2023 (new research suggested SIRT6/NRF2 interference), largely replaced metformin with berberine (GI tolerance), added rapamycin quarterly, and added nattokinase and spermidine to his stack.",
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85',
    expertImage: '/experts/david-sinclair.jpg',
    role: 'Professor of Genetics, Harvard Medical School. Author of Lifespan.',
    website: 'sinclair.hms.harvard.edu',
    approach: 'Information Theory of Aging — restore epigenetic information that drives youthful gene expression via sirtuins, NAD+, and senolytics',
    keyPhilosophy: [
      'Aging is a disease — and like all diseases, it can be treated and reversed',
      'The Information Theory of Aging: cells lose epigenetic information over time; restoring it is the key to reversing aging',
      'NAD+ is the master regulator — sirtuins require it; restoring declining NAD+ (via NMN) is central to his longevity strategy',
      'Xenohormesis: compounds made by stressed plants (resveratrol, fisetin, quercetin) activate our own survival pathways',
      'Skips breakfast daily — fasting activates AMPK, sirtuins, and autophagy that food shuts down',
      'Dropped quercetin (2023), dropped metformin (largely), added rapamycin quarterly — the protocol evolves with evidence',
    ],
    sections: [
      {
        title: 'Core Morning Stack',
        description: "Sinclair's primary daily supplements — unchanged for years at their core, though doses and additions have evolved.",
        items: [
          { name: 'NMN', dose: '1g', timing: 'Morning with yogurt (fat improves absorption)', purpose: 'NAD+ restoration — Sinclair was instrumental in popularising NMN as the primary NAD+ precursor', evidenceNote: 'Sinclair takes 1g — twice to four times higher than typical clinical trial doses (250–500mg). He argues higher doses are warranted given the steep NAD+ decline with age.', supplementId: 'nmn' },
          { name: 'Resveratrol', dose: '1g', timing: 'Morning with olive oil or yogurt — fat required for absorption', purpose: 'SIRT1 activator — core of Sinclair\'s sirtuin activation strategy. Synergistic with NMN.', evidenceNote: 'Resveratrol\'s human evidence is more contested than Sinclair\'s own enthusiasm suggests. He acknowledges the human RCT data is mixed — but continues based on mechanistic plausibility and his own biomarkers.' },
          { name: 'Berberine', dose: '1g/day', timing: 'With food', purpose: 'AMPK activator — largely replaced metformin. Similar mechanism, better GI tolerance, no prescription required.', evidenceNote: 'Sinclair switched from metformin primarily due to GI side effects. Berberine activates AMPK through a slightly different mechanism (mitochondrial complex I inhibition vs. metformin\'s direct AMPK activation).', supplementId: 'berberine' },
          { name: 'Vitamin D3 + K2', dose: '5,000 IU D3', timing: 'Morning', purpose: 'Immune function, bone health, cancer risk reduction — Sinclair considers vitamin D deficiency a significant longevity risk' },
          { name: 'Omega-3', dose: 'Daily (dose not publicly specified)', timing: 'With food', purpose: 'Cardiovascular protection, anti-inflammatory, brain health', supplementId: 'omega3' },
          { name: 'Alpha-Lipoic Acid', dose: '500mg', timing: 'Morning', purpose: 'Mitochondrial antioxidant, glucose disposal, heavy metal chelation', evidenceNote: 'Part of Sinclair\'s antioxidant stack. R-ALA form is significantly better absorbed than racemic ALA.' },
          { name: 'CoQ10', dose: 'Daily (dose not specified)', timing: 'With fat', purpose: 'Mitochondrial electron transport, lipid-soluble antioxidant' },
        ],
      },
      {
        title: 'Senolytics & Autophagy',
        description: "Sinclair's updated senolytic protocol — quercetin dropped in 2023, fisetin retained, spermidine added for autophagy.",
        items: [
          { name: 'Fisetin', dose: '500mg daily', timing: 'With fat', purpose: 'Senolytic — clears senescent cells. Retained after dropping quercetin in 2023. More potent senolytic than quercetin in mouse studies.', evidenceNote: 'Sinclair dropped quercetin in 2023 after research suggested possible SIRT6 and NRF2 pathway interference. Fisetin does not have this concern and shows stronger senolytic activity in animal models.' },
          { name: 'Spermidine', dose: '1–2mg', timing: 'Morning', purpose: 'Autophagy inducer — triggers cellular self-cleaning. Found in aged cheese, wheat germ, mushrooms.', evidenceNote: 'Sinclair added spermidine after 2022 human studies showed cognitive protection and cardiovascular benefits. The mechanistic case (autophagy induction) is strong; long-term human RCTs are emerging.' },
          { name: 'Nattokinase', dose: 'Daily (standard dose)', timing: 'Away from food (best absorbed on empty stomach)', purpose: 'Fibrinolytic enzyme from fermented soybeans — reduces fibrin and clot formation. Emerging cardiovascular data.', evidenceNote: 'Sinclair added nattokinase in 2023. Mechanistically interesting for cardiovascular risk. Human trial data growing but not yet conclusive.' },
        ],
      },
      {
        title: 'Prescription & Quarterly Interventions',
        description: "Sinclair's pharmacological longevity interventions — some quarterly pulsed, some daily.",
        items: [
          { name: 'Rapamycin', dose: '~6mg quarterly (pulsed)', timing: 'Every 3 months', purpose: 'mTOR inhibition — Sinclair uses a quarterly pulsed protocol rather than Attia\'s weekly continuous approach', evidenceNote: 'Rx only. Sinclair argues that intermittent rapamycin may capture mTOR inhibition benefits while minimising immunosuppression. This is a contentious area — the optimal dosing frequency is genuinely unknown.', isRx: true },
          { name: 'Low-dose Aspirin', dose: '81mg', timing: 'Daily', purpose: 'Anti-inflammatory, cardiovascular protection — Sinclair continues despite updated cardiology guidance against routine aspirin in healthy adults', evidenceNote: 'Rx-free but contested. Updated AHA/ACC guidelines (2022) no longer recommend aspirin for primary prevention in most adults. Sinclair continues based on his personal risk assessment.' },
          { name: 'Statin', dose: '80mg (high-intensity)', timing: 'Evening', purpose: 'Aggressive ApoB/LDL-C lowering for cardiovascular risk reduction', evidenceNote: 'Rx only. Sinclair is explicit about treating cholesterol aggressively. He views cardiovascular disease as the most preventable of the "four horsemen" of aging.', isRx: true },
          { name: 'Metformin (occasional)', dose: '1g when taken', timing: 'Evening', purpose: 'AMPK activation — Sinclair reduced metformin use due to GI side effects but has not entirely eliminated it', evidenceNote: 'Rx only. Unlike Attia, Sinclair has not publicly abandoned metformin — he uses it more sporadically than previously. The berberine switch is largely pragmatic (GI tolerance) rather than philosophical.', isRx: true },
        ],
      },
      {
        title: 'Lifestyle & Fasting',
        description: "Sinclair's non-supplement longevity practices — which he argues are equal in importance to his pill protocol.",
        items: [
          { name: 'Intermittent Fasting (skip breakfast)', dose: 'First meal at 1–2 PM, last meal 8–9 PM', timing: 'Daily', purpose: 'AMPK activation, sirtuin activation, autophagy induction, IGF-1 reduction. Sinclair has skipped breakfast for a decade.', evidenceNote: 'Sinclair\'s IGF-1 is reported at 40% below population average — consistent with reduced mTOR/IGF-1 signalling that animal longevity models associate with extended lifespan.' },
          { name: 'Cold Exposure', dose: '2–3x/week cold shower or brief outdoor cold', timing: 'Post-exercise or morning', purpose: 'Xenohormesis — mild stress activates survival pathways. Norepinephrine release, mitochondrial biogenesis.', evidenceNote: 'Sinclair frames cold exposure as a form of xenohormesis — the same concept as plant polyphenols activating human survival pathways.' },
          { name: 'Plant-heavy, Low Red Meat Diet', dose: 'Predominantly plants, minimal red meat', timing: 'Daily', purpose: 'Reduce IGF-1 signalling (mTOR inhibition via lower amino acid load), increase polyphenol intake, gut microbiome diversity', evidenceNote: 'Sinclair\'s dietary approach conflicts with Attia\'s high-protein strategy. The core tension: Attia prioritises anti-sarcopenic protein intake; Sinclair prioritises mTOR inhibition. Both have valid mechanistic cases.' },
        ],
      },
    ],
    totalSupplements: 14,
    estimatedCost: '$80–150/month (excluding Rx)',
    difficulty: 'Intermediate',
    lastUpdated: '2025-01',
    disclaimer: "Sinclair's protocol has changed significantly since Lifespan was published in 2019 — always use current interview data, not the book. Rapamycin, statins, and metformin require prescriptions. The scientific community has ongoing debates about several of Sinclair's claims, particularly resveratrol's human efficacy.",
    affiliateDisclosure: 'Longevity Intel earns a commission on some affiliate links.',
  },
]

export function getProtocolById(id: string) {
  return protocols.find(p => p.id === id) ?? null
}
