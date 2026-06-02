'use client'

import { useState } from 'react'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft, Heart, AlertTriangle, Check } from 'lucide-react'
import Link from 'next/link'

export default function CardioProtocol() {
  const [age, setAge] = useState(40)
  const [restingHR, setRestingHR] = useState(60)
  const [maxHR, setMaxHR] = useState(220 - age)

  const zone2_lower = Math.round(restingHR + (maxHR - restingHR) * 0.6)
  const zone2_upper = Math.round(restingHR + (maxHR - restingHR) * 0.75)

  return (
    <div className="pt-24 pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-red-900/20 via-orange-800/10 to-transparent border-b border-border mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/protocols" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Protocols
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-red-500/30 px-2.5 py-1 rounded-full bg-red-500/5 text-red-400 mb-3">Lifestyle Protocol</span>
              <h1 className="font-display text-5xl text-ink mb-2">Cardio Optimization</h1>
              <p className="text-muted max-w-2xl text-lg">Zone 2 aerobic training for cardiovascular longevity: maximize mitochondrial density, VO₂ max, and fat oxidation with periodized protocols.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Main Content */}
          <div>
            <AnimatedSection>
              {/* Why Cardio Matters */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Why Cardiovascular Fitness Predicts Longevity</h2>
                <p className="text-muted text-lg leading-relaxed mb-6">
                  Cardiovascular fitness (measured as VO₂ max) is one of the strongest predictors of lifespan. High aerobic capacity means:
                </p>
                <ul className="space-y-2 text-muted mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-bright shrink-0 mt-0.5" />
                    <span><strong>Mitochondrial density</strong>: More mitochondria = better energy production, reduced cellular stress</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-bright shrink-0 mt-0.5" />
                    <span><strong>Metabolic flexibility</strong>: Ability to switch between glucose and fat oxidation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-bright shrink-0 mt-0.5" />
                    <span><strong>Endothelial function</strong>: Healthy blood vessel lining = lower heart disease risk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-bright shrink-0 mt-0.5" />
                    <span><strong>Cardiac efficiency</strong>: Lower resting heart rate, better HRV recovery</span>
                  </li>
                </ul>
                <p className="text-muted italic border-l-2 border-border pl-4">
                  Studies show: <strong>Each 1 METs increase in VO₂ max = 15% reduction in mortality risk.</strong>
                </p>
              </div>

              {/* Zone 2 Explained */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Zone 2: The Longevity Zone</h2>
                <p className="text-muted mb-6">
                  Zone 2 is the sweet spot for building mitochondria and aerobic base without glycogen depletion. It&apos;s the intensity where you can maintain a conversation but not sing.
                </p>

                <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                  <h3 className="font-display text-lg text-ink mb-4">Heart Rate Zones (Karvonen Formula)</h3>
                  <p className="text-sm text-muted mb-4">
                    Calculated using: <code className="bg-surface-2 px-2 py-1 rounded text-xs">Target HR = Resting HR + (Max HR − Resting HR) × Intensity %</code>
                  </p>

                  <div className="space-y-2">
                    {[
                      { zone: 'Zone 1 (Recovery)', range: '50–60%', benefit: 'Very easy, builds aerobic base', color: 'bg-blue-500/10 border-blue-500/25' },
                      { zone: 'Zone 2 (Aerobic)', range: '60–75%', benefit: 'Moderate, maximal mitochondrial adaptation', color: 'bg-green-500/10 border-green-500/25' },
                      { zone: 'Zone 3 (Tempo)', range: '75–85%', benefit: 'Hard, lactate threshold', color: 'bg-yellow-500/10 border-yellow-500/25' },
                      { zone: 'Zone 4 (Threshold)', range: '85–95%', benefit: 'Very hard, anaerobic', color: 'bg-orange-500/10 border-orange-500/25' },
                      { zone: 'Zone 5 (VO₂ Max)', range: '95–100%', benefit: 'All-out, peak effort', color: 'bg-red-500/10 border-red-500/25' },
                    ].map((item, i) => (
                      <div key={i} className={`${item.color} border rounded-lg p-3`}>
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h4 className="font-display text-ink">{item.zone}</h4>
                          <span className="font-mono text-sm text-ink font-semibold">{item.range}</span>
                        </div>
                        <p className="text-muted text-sm">{item.benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4">
                  <p className="text-sm text-ink">
                    <strong>Why Zone 2?</strong> Below the lactate threshold (~75% max HR), your body oxidizes fat efficiently and maximizes AMPK activation (cellular energy sensor that triggers mitochondrial biogenesis).
                  </p>
                </div>
              </div>

              {/* Zone 2 Calculator */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Your Zone 2 Heart Rate Range</h2>

                <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Age (years)</label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={age}
                        onChange={(e) => {
                          const newAge = parseInt(e.target.value)
                          setAge(newAge)
                          setMaxHR(220 - newAge)
                        }}
                        className="w-full px-4 py-2 bg-ink/5 border border-border rounded-lg text-ink font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">Resting Heart Rate (bpm)</label>
                      <input
                        type="number"
                        min="30"
                        max="120"
                        value={restingHR}
                        onChange={(e) => setRestingHR(parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-ink/5 border border-border rounded-lg text-ink font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-green/5 border border-green/25 rounded-lg p-6 text-center">
                    <p className="text-muted text-sm mb-2">Your Zone 2 Range</p>
                    <div className="font-display text-4xl text-green-bright mb-2">{zone2_lower}–{zone2_upper} bpm</div>
                    <p className="text-muted text-sm">Aim for 60–75% max HR. Maintain for 150+ min/week.</p>
                  </div>

                  <p className="text-xs text-muted mt-4">
                    <strong>Resting HR tip:</strong> Measure first thing in the morning before getting up. Lower RHR (under 60) = better cardiovascular fitness.
                  </p>
                </div>
              </div>

              {/* Training Modalities */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Zone 2 Training Modalities</h2>
                <p className="text-muted mb-6">
                  The best Zone 2 activity is the one you&apos;ll do consistently. Pick 2–3 and alternate.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      activity: 'Zone 2 Running',
                      how: 'Steady-pace run at conversation speed (easy 5–6/10 effort)',
                      duration: '45–90 min, 3–4x/week',
                      pros: 'Free, anywhere, weight-bearing',
                      cons: 'Joint stress if overweight or form is poor',
                    },
                    {
                      activity: 'Zone 2 Cycling',
                      how: 'Moderate cadence, low resistance (steady spinning)',
                      duration: '60–120 min, 2–3x/week',
                      pros: 'Low impact, scalable duration, outdoor option',
                      cons: 'Requires bike, less upper body engagement',
                    },
                    {
                      activity: 'Zone 2 Swimming',
                      how: 'Steady pace, continuous strokes (not sprinting)',
                      duration: '45–60 min, 2x/week',
                      pros: 'Full body, zero impact, great for joint health',
                      cons: 'Requires pool access, harder to measure HR',
                    },
                    {
                      activity: 'Zone 2 Rowing',
                      how: 'Steady 1:45–2:00 split (moderate resistance, controlled)',
                      duration: '45–60 min, 2–3x/week',
                      pros: 'Balanced cardio + strength, excellent for posture',
                      cons: 'Requires Concept2 or similar; learning curve',
                    },
                    {
                      activity: 'Zone 2 Elliptical / Treadmill',
                      how: 'Incline + moderate speed (no sprinting)',
                      duration: '45–75 min, 2–3x/week',
                      pros: 'Controlled environment, joint-friendly',
                      cons: 'Boring, less engaging than outdoor',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-3">{item.activity}</h3>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>How:</strong> {item.how}</p>
                        <p><strong>Duration:</strong> {item.duration}</p>
                        <p><strong>Pros:</strong> {item.pros}</p>
                        <p><strong>Cons:</strong> {item.cons}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Periodization */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Periodized Cardio Protocol</h2>
                <p className="text-muted mb-6">
                  Vary intensity across weeks and months to avoid plateaus and burnout.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      phase: 'Base Building (Weeks 1–4)',
                      focus: '70% Zone 2, 30% Zone 1 (recovery)',
                      volume: '150–200 min/week',
                      goal: 'Aerobic foundation, mitochondrial base',
                    },
                    {
                      phase: 'Build Phase (Weeks 5–8)',
                      focus: '60% Zone 2, 20% Zone 3 (tempo), 20% Zone 1',
                      volume: '200–250 min/week',
                      goal: 'Increase lactate threshold, VO₂ max',
                    },
                    {
                      phase: 'Peak Phase (Weeks 9–12)',
                      focus: '50% Zone 2, 20% Zone 3, 10% Zone 4–5 (VO₂ work), 20% Zone 1',
                      volume: '200–250 min/week',
                      goal: 'Peak fitness, race or max HR testing',
                    },
                    {
                      phase: 'Recovery (Week 13)',
                      focus: '100% Zone 1–2 (very easy)',
                      volume: '75–100 min/week',
                      goal: 'Deload, repair, adapt',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-display text-lg text-ink">{item.phase}</h3>
                      </div>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>Focus:</strong> {item.focus}</p>
                        <p><strong>Volume:</strong> {item.volume}</p>
                        <p><strong>Goal:</strong> {item.goal}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Rule:</strong> Increase volume by no more than 10% per week. Include a deload week every 3–4 weeks to avoid overtraining.
                </p>
              </div>

              {/* Tracking & Testing */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Testing & Tracking Progress</h2>

                <div className="space-y-4">
                  {[
                    {
                      test: 'VO₂ Max Test (Lab)',
                      method: 'Treadmill or bike with gas exchange analysis',
                      frequency: 'Every 12 weeks',
                      why: 'Gold standard. Expensive but precise.',
                    },
                    {
                      test: 'Functional Threshold Power (FTP) Test',
                      method: '20-min all-out on bike; FTP ≈ 95% of avg power',
                      frequency: 'Every 8 weeks',
                      why: 'Free, repeatable. Wearable tracks.',
                    },
                    {
                      test: 'Resting Heart Rate Trend',
                      method: 'Measure RHR every morning',
                      frequency: 'Daily',
                      why: 'Declining RHR = improving fitness. Spike = overtraining.',
                    },
                    {
                      test: 'Heart Rate Recovery',
                      method: 'Max HR − HR at 1 min post-effort',
                      frequency: 'Monthly test runs',
                      why: 'Drop of 20+ bpm/min = good fitness. Slow recovery = fatigue.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-2">{item.test}</h3>
                      <div className="space-y-2 text-sm text-muted">
                        <p><strong>Method:</strong> {item.method}</p>
                        <p><strong>Frequency:</strong> {item.frequency}</p>
                        <p><strong>Why:</strong> {item.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplements for Cardio */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Supplements for Endurance & Recovery</h2>

                <div className="space-y-4">
                  {[
                    { name: 'Beta-Alanine', dose: '3–5 g/day', timing: 'Any time', why: 'Buffers lactate; may improve Zone 4 performance. Takes 4+ weeks to work.' },
                    { name: 'Beetroot Juice', dose: '500 ml (~5–9 mmol nitrate)', timing: '2–3 hrs before', why: 'NO booster; improves oxygen efficiency and time to exhaustion.' },
                    { name: 'Sodium Bicarbonate', dose: '0.3 g/kg BW', timing: '60 min before', why: 'Buffers lactate; helps high-intensity only (not Zone 2).' },
                    { name: 'Creatine Monohydrate', dose: '5 g/day', timing: 'Any time', why: 'Improves ATP resynthesis; better for strength but helps recovery.' },
                    { name: 'Tart Cherry Extract', dose: '500–1000 mg', timing: 'Post-exercise', why: 'Reduces inflammation, speeds recovery, improves sleep.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-display text-ink">{item.name}</h3>
                        <span className="font-mono text-xs text-green-bright bg-green/5 px-2 py-1 rounded">{item.dose}</span>
                      </div>
                      <p className="text-muted text-sm mb-1"><strong>Timing:</strong> {item.timing}</p>
                      <p className="text-muted text-sm">{item.why}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Note:</strong> Zone 2 training is aerobic and fat-burning. Supplement priority is recovery (tart cherry, magnesium) over performance.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber/5 border border-amber/20 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Important Disclaimer</p>
                    <p className="text-sm text-ink leading-relaxed">
                      This is educational content, not medical advice. Before starting a new training program, consult a physician or cardiologist—especially if you have heart disease risk factors, hypertension, or take medications. High-intensity exercise can be risky without medical clearance. Listen to your body; overtraining increases injury and illness risk.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28 space-y-5">
              <AnimatedSection delay={0.1}>
                <div className="bg-surface border border-border rounded-lg p-5">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Quick Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted">Weekly Volume</span>
                      <p className="text-ink font-semibold">150–250 min</p>
                    </div>
                    <div>
                      <span className="text-muted">Zone 2 Focus</span>
                      <p className="text-ink font-semibold">60–75% max HR</p>
                    </div>
                    <div>
                      <span className="text-muted">Best Activities</span>
                      <p className="text-ink font-semibold">Running, cycling, rowing</p>
                    </div>
                    <div>
                      <span className="text-muted">Key Metric</span>
                      <p className="text-ink font-semibold">Resting HR ↓</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <Link href="/database?category=cardio"
                  className="block w-full text-center px-4 py-3 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors cursor-pointer">
                  Cardio Gear →
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <Link href="/get-started"
                  className="block w-full text-center px-4 py-3 border border-border text-ink rounded-lg font-semibold text-sm hover:border-red-500/30 hover:bg-surface transition-colors cursor-pointer">
                  Personalized Training Plan
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
