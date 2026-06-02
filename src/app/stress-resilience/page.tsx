import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft, Brain, AlertTriangle, Check, Wind } from 'lucide-react'
import Link from 'next/link'

export default function StressResilienceProtocol() {
  return (
    <div className="pt-24 pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-purple-900/20 via-pink-800/10 to-transparent border-b border-border mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/protocols" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Protocols
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-purple-500/30 px-2.5 py-1 rounded-full bg-purple-500/5 text-purple-400 mb-3">Lifestyle Protocol</span>
              <h1 className="font-display text-5xl text-ink mb-2">Stress & Resilience</h1>
              <p className="text-muted max-w-2xl text-lg">Meditation, breathwork, adaptogens, psychedelics, and grounding techniques for nervous system optimization.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Main Content */}
          <div>
            <AnimatedSection>
              {/* Why Stress Matters */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Why Stress Management is Longevity</h2>
                <p className="text-muted text-lg leading-relaxed mb-6">
                  Chronic stress (elevated cortisol, HPA axis dysregulation) accelerates aging, impairs immunity, disrupts sleep, increases inflammation, and raises cardiovascular disease risk. Resilience—the ability to recover quickly from stress—is trainable.
                </p>
                <ul className="space-y-3">
                  {[
                    'Chronic stress increases cortisol → accelerates telomere shortening → premature cellular aging',
                    'Elevated stress hormones suppress immune function (fewer T cells, reduced NK cell activity)',
                    'Dysregulated cortisol disrupts circadian rhythm → poor sleep → metabolic dysfunction',
                    'Stress-induced inflammation (IL-6, TNF-α) underlies cardiovascular disease and dementia',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meditation */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Meditation: Types & Mechanisms</h2>
                <p className="text-muted mb-6">
                  Different meditation styles activate different neural pathways. Pick the one that resonates with you—consistency matters more than type.
                </p>

                <div className="space-y-4">
                  {[
                    { style: 'Zen/Vipassana (Insight)', mechanism: 'Strengthens prefrontal cortex (executive control), weakens default mode network (rumination)', time: '10–30 min daily', best: 'Anxiety, overthinking, emotional regulation' },
                    { style: 'Loving-Kindness (Metta)', mechanism: 'Activates insula + anterior cingulate (empathy, emotional resilience). Increases activation of brain regions linked to wellbeing.', time: '10–20 min daily', best: 'Depression, loneliness, self-criticism' },
                    { style: 'Breathwork-Focused', mechanism: 'Vagus nerve stimulation → parasympathetic activation. Lowers cortisol, HRV improves. Fast recovery from stress.', time: '5–10 min, 2–3x daily', best: 'Acute stress, panic, sleep onset' },
                    { style: 'Body Scan (Progressive Relaxation)', mechanism: 'Proprioceptive awareness + relaxation response. Reduces muscle tension, interoceptive accuracy.', time: '15–30 min daily', best: 'Chronic pain, tension, insomnia' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-2">{item.style}</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted"><strong>Mechanism:</strong> {item.mechanism}</p>
                        <p className="text-muted"><strong>Duration:</strong> {item.time}</p>
                        <p className="text-muted"><strong>Best for:</strong> {item.best}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>App recommendations:</strong> Insight Timer (free + premium, 100k+ courses), Wim Hof (breathwork), Calm (sleep-focused), 10% Happier (science-based).
                </p>
              </div>

              {/* Breathwork Protocols */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Breathwork: Science-Backed Protocols</h2>
                <p className="text-muted mb-6">
                  Breathing directly modulates nervous system state. These protocols are evidence-backed and immediately effective.
                </p>

                <div className="space-y-4">
                  {[
                    { protocol: '4–7–8 Breathing', technique: 'Inhale 4 sec → Hold 7 sec → Exhale 8 sec. Repeat 4 cycles.', timing: 'Pre-sleep or during anxiety', effect: 'Vagal activation, immediate calm. Great sleep onset.' },
                    { protocol: 'Box Breathing', technique: 'Inhale 4 sec → Hold 4 sec → Exhale 4 sec → Hold 4 sec. Repeat 5–10 cycles.', timing: 'Acute stress/panic', effect: 'Balances parasympathetic and sympathetic. Used by Navy SEALS.' },
                    { protocol: 'Wim Hof Method', technique: '30–40 deep breaths, hold after final exhale for as long as possible, breathe normally 15 sec, repeat 3 rounds', timing: 'Morning or pre-exercise', effect: 'Breath holds train O2 efficiency, immune tolerance (↑IL-10, ↓TNF-α in studies).' },
                    { protocol: 'Coherent Breathing', technique: '5–6 sec inhale, 5–6 sec exhale (~5.5 breaths/min)', timing: 'Any time, ideal 20 min daily', effect: 'Vagal tone improvement, HRV increase, stress resilience.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display text-lg text-ink">{item.protocol}</h3>
                        <Wind className="w-5 h-5 text-purple-400 shrink-0" />
                      </div>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>How:</strong> {item.technique}</p>
                        <p><strong>When:</strong> {item.timing}</p>
                        <p><strong>Effect:</strong> {item.effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adaptogens & Mushrooms */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Adaptogens: Herbs for Stress Resilience</h2>
                <p className="text-muted mb-6">
                  Adaptogens help your body maintain homeostasis under stress. Evidence quality varies; these have the strongest data.
                </p>

                <div className="space-y-4">
                  {[
                    { adapt: 'Ashwagandha', dose: '300–600 mg/day (standardized to 5% withanolides)', timing: 'Morning with meal', why: 'Reduces cortisol 20–30%, anxiety, improves sleep quality. Best for chronic stress.', caution: 'Not with thyroid meds (can inhibit iodine uptake)' },
                    { adapt: 'Rhodiola Rosea', dose: '400–600 mg/day', timing: 'Morning', why: 'Improves mood, mental clarity, fatigue resistance. ↑Dopamine, ↓Cortisol.', caution: 'Can be stimulating; avoid if anxious' },
                    { adapt: 'Lion\'s Mane', dose: '500–1000 mg/day (fruiting body)', timing: 'Morning', why: 'NGF stimulation → neuroplasticity, mood, cognitive resilience. Mild anxiolytic.', caution: 'Generally very safe' },
                    { adapt: 'Reishi Mushroom', dose: '1–2 g dried or 300–500 mg extract/day', timing: 'Evening', why: 'GABA-like activity, immune modulation (β-glucans). Sleep-promoting.', caution: 'Can be sedating; test first' },
                    { adapt: 'Cordyceps', dose: '500–1000 mg/day', timing: 'Morning pre-exercise', why: 'Energy, stamina, cortisol buffering during endurance. Not sleep-promoting.', caution: 'Stimulating; avoid near bedtime' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-display text-ink">{item.adapt}</h3>
                        <span className="font-mono text-xs text-purple-400 bg-purple-500/5 px-2 py-1 rounded">{item.dose}</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted">
                        <p><strong>Timing:</strong> {item.timing}</p>
                        <p><strong>Why:</strong> {item.why}</p>
                        <p className="text-amber"><strong>⚠️ Note:</strong> {item.caution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychedelics */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Psychedelics for Resilience (Legal & Emerging)</h2>
                <p className="text-muted mb-6">
                  Psilocybin and ketamine show promise in research for treatment-resistant depression and existential anxiety. Status varies by region; always consult local laws.
                </p>

                <div className="space-y-4">
                  {[
                    { substance: 'Psilocybin Microdosing', dose: '0.1–0.3 g (~1–2 days on, 2 days off pattern)', legality: 'Illegal in most countries; decriminalized in some cities (Denver, OR)', evidence: 'Improves mood, neuroplasticity, creative thinking. 2–3 month cycles common.', integration: 'Therapy/journaling critical post-use' },
                    { substance: 'Ketamine-Assisted Therapy', dose: 'Professional setting: 0.5–1 mg/kg IM/IV', legality: 'Legal in clinic settings; some therapists offer "ketamine-assisted psychotherapy"', evidence: 'Rapid antidepressant effect. Dissociation breaks rumination cycles. Studies show 50–70% remission in resistant depression.', integration: 'Requires professional supervision and therapy' },
                    { substance: 'Legal Alternatives: 5-MeO-DMT Retreats', dose: 'Varies (retreat-based)', legality: 'Legal in some retreat centers (Peru, Ecuador); grey in others', evidence: 'Anecdotal reports of profound meaning, reduced death anxiety, perspective shift. Limited RCT data.', integration: 'Retreat centers provide integration coaching' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-3">{item.substance}</h3>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>Dose:</strong> {item.dose}</p>
                        <p><strong>Legal Status:</strong> <span className="text-amber">{item.legality}</span></p>
                        <p><strong>Evidence:</strong> {item.evidence}</p>
                        <p><strong>Integration:</strong> {item.integration}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink">
                    <strong>⚠️ Critical caveat:</strong> Psychedelics are not magic cures. Pre-existing conditions (HPPD, schizophrenia family history, active mania) increase risk. Professional guidance is non-negotiable.
                  </p>
                </div>
              </div>

              {/* Grounding & Nature */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Grounding: Earth Connection</h2>
                <p className="text-muted mb-6">
                  Grounding (earthing) is direct skin contact with soil/ocean. Evidence is mixed, but mechanisms are plausible and cost is zero.
                </p>

                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-ink mb-4">Grounding Methods</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      '15–30 min barefoot on grass, sand, or soil daily',
                      'Ocean swimming (saltwater contact)',
                      'Grounding mats (under desk or bed; mixed evidence but low risk)',
                      'Forest bathing (Shinrin-yoku) — 20+ min in nature, slow walking',
                    ].map((method, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-ink">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4 mt-6">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  <p className="text-sm text-ink">
                    <strong>Evidence note:</strong> RCTs on grounding mats are mixed (some show inflammatory markers ↓, others don't). However, nature exposure + grounding combination reliably ↓cortisol and ↑HRV.
                  </p>
                </div>
              </div>

              {/* Daily Protocol */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Sample Daily Stress Resilience Protocol</h2>

                <div className="bg-surface border border-border rounded-xl p-6">
                  <div className="space-y-4 text-sm">
                    {[
                      { time: '6:00–7:00 AM', action: 'Sun exposure + 5 min Wim Hof breathing', why: 'Cortisol reset, sympathetic activation for morning' },
                      { time: '12:00 PM', action: '10 min meditation (Vipassana or Metta)', why: 'Mid-day stress management' },
                      { time: '14:30 PM', action: 'Rhodiola + Ashwagandha with lunch', why: 'Afternoon fatigue resistance' },
                      { time: '17:00 PM', action: 'Barefoot grounding or walk in nature (15 min)', why: 'Cortisol reduction, transition to evening' },
                      { time: '20:00 PM', action: 'Reishi tea + 4–7–8 breathing (4 cycles)', why: 'Sleep onset, nervous system downshift' },
                      { time: '20:30 PM', action: 'Body scan meditation or breathwork (15 min)', why: 'Deep relaxation, HRV improvement' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 pb-4 border-b border-border last:border-b-0">
                        <div className="font-mono text-purple-400 font-semibold min-w-fit">{item.time}</div>
                        <div className="flex-1">
                          <p className="text-ink font-semibold">{item.action}</p>
                          <p className="text-xs text-muted mt-1">{item.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber/5 border border-amber/20 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Mental Health Disclaimer</p>
                    <p className="text-sm text-ink leading-relaxed">
                      This is educational content, not medical advice. Clinical depression, anxiety disorders, and PTSD require professional treatment. Psychedelics are contraindicated in schizophrenia, bipolar disorder (during manic phases), and certain medications. Consult a psychiatrist or therapist before major changes.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28 space-y-5">
              <div className="bg-surface border border-border rounded-lg p-5">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Quick Protocol</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted">Daily Meditation</span>
                    <p className="text-ink font-semibold">10–30 min</p>
                  </div>
                  <div>
                    <span className="text-muted">Breathwork</span>
                    <p className="text-ink font-semibold">5–10 min, 2–3x</p>
                  </div>
                  <div>
                    <span className="text-muted">Adaptogens</span>
                    <p className="text-ink font-semibold">Ashwagandha + Lion&apos;s Mane</p>
                  </div>
                  <div>
                    <span className="text-muted">Grounding</span>
                    <p className="text-ink font-semibold">15–30 min daily</p>
                  </div>
                </div>
              </div>

              <Link href="/database?category=supplements"
                className="block w-full text-center px-4 py-3 bg-purple-500 text-white rounded-lg font-semibold text-sm hover:bg-purple-600 transition-colors cursor-pointer">
                Stress Supplements →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
