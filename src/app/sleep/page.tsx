import { AnimatedSection } from '@/components/AnimatedSection'
import { HubClusterStrip } from '@/components/ContentCluster'
import { ArrowLeft, Moon, Clock, AlertTriangle, Check } from 'lucide-react'
import Link from 'next/link'

export default function SleepProtocol() {
  return (
    <div className="pt-24 pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-transparent border-b border-border mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/protocols" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Protocols
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-blue-500/30 px-2.5 py-1 rounded-full bg-blue-500/5 text-blue-400 mb-3">Lifestyle Protocol</span>
              <h1 className="font-display text-5xl text-ink mb-2">Sleep Optimization</h1>
              <p className="text-muted max-w-2xl text-lg">Master your circadian rhythm with science-backed sleep architecture, environmental optimization, supplement timing, and recovery protocols.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <HubClusterStrip clusterId="sleep" title="Priority sleep guides" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Main Content */}
          <div>
            <AnimatedSection>
              {/* Why Sleep Matters */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Why Sleep is Your Longevity Superpower</h2>
                <p className="text-muted text-lg leading-relaxed mb-6">
                  Sleep isn&apos;t just rest—it&apos;s when your brain clears metabolic waste via the glymphatic system, muscles repair, hormones rebalance, and memories consolidate. Poor sleep accelerates aging, impairs cognition, disrupts metabolism, and increases disease risk. The goal: 7-9 hours of deep, consolidated sleep with consistent timing.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-sm text-muted mb-2">Target Duration</div>
                    <div className="font-display text-2xl text-ink">7–9 hrs</div>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-sm text-muted mb-2">Ideal Bedtime</div>
                    <div className="font-display text-2xl text-ink">22:00–23:30</div>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-4">
                    <div className="text-sm text-muted mb-2">Consistency Window</div>
                    <div className="font-display text-2xl text-ink">±30 min</div>
                  </div>
                </div>
              </div>

              {/* Sleep Architecture */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Sleep Architecture 101</h2>
                <p className="text-muted mb-6">A complete sleep cycle is ~90 minutes and progresses through 5 stages:</p>

                <div className="space-y-4 mb-8">
                  {[
                    { stage: 'N1 (Light Sleep)', duration: '5–10 min', function: 'Transition from wake. Heart rate slows, brain waves slow.' },
                    { stage: 'N2 (Light Sleep)', duration: '45–55 min', function: 'Core light sleep. Sleep spindles (brief bursts) consolidate learning.' },
                    { stage: 'N3 (Deep Sleep)', duration: '15–30 min', function: 'Restorative deep sleep. Glymphatic clearance, growth hormone surge, muscle repair.' },
                    { stage: 'REM (Rapid Eye Movement)', duration: '20–25 min', function: 'Dream sleep. Memory consolidation, emotional processing, brain plasticity.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-1">
                        <div className="w-6 h-6 rounded-full bg-green/10 border border-green/20 flex items-center justify-center shrink-0 text-xs text-green-bright font-semibold">{i + 1}</div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg text-ink">{item.stage}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted mt-1">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {item.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted text-sm pl-9">{item.function}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4">
                  <strong>Key insight:</strong> Most deep sleep happens in cycles 1–3. Most REM happens in cycles 4–5. Waking during REM leaves you groggy; waking during N2 is gentler. Sleep trackers estimate these stages via movement + heart rate variability.
                </p>
              </div>

              {/* Circadian Rhythm */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Circadian Rhythm Mastery</h2>
                <p className="text-muted mb-6">
                  Your circadian rhythm is a ~24-hour internal clock regulated by light, temperature, food timing, and exercise. Syncing it amplifies energy, sleep depth, and metabolic health.
                </p>

                <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                  <h3 className="font-display text-lg text-ink mb-4">The Circadian Timeline</h3>
                  <div className="space-y-4">
                    {[
                      { time: '6:00–7:00 AM', action: 'Sunlight exposure (10–30 min). Stops melatonin, sets circadian anchor.' },
                      { time: '7:00–9:00 AM', action: 'First meal within 1–2 hrs of wake. Resets food-timing clock.' },
                      { time: '12:00–14:00 PM', action: 'Bright light exposure & exercise. Peak cortisol window.' },
                      { time: '15:00–17:00 PM', action: 'Last caffeine (4+ hrs before bed). Caffeine half-life ~5–6 hrs.' },
                      { time: '18:00–20:00 PM', action: 'Dim lights, reduce blue light. Begin melatonin rise.' },
                      { time: '22:00–23:30 PM', action: 'Bedtime. Cool dark room (65–68°F / 18–20°C).' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="font-mono text-sm text-green-bright font-semibold min-w-fit">{item.time}</div>
                        <div className="text-muted text-sm">{item.action}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted italic">
                  <strong>Rule:</strong> Keep sleep/wake times within ±30 minutes every day, including weekends. Consistency beats duration.
                </p>
              </div>

              {/* Environment */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Sleep Environment Optimization</h2>

                <div className="grid gap-4 mb-6">
                  {[
                    { factor: 'Temperature', target: '65–68°F (18–20°C)', why: 'Facilitates heat dissipation; core temp drop triggers deep sleep.' },
                    { factor: 'Light', target: '0–5 lux (complete darkness)', why: 'Blocks melatonin suppression. Use blackout curtains or eye mask.' },
                    { factor: 'Sound', target: '30–40 dB (quiet)', why: 'Noise fragments sleep. White noise or earplugs help if unavoidable.' },
                    { factor: 'Humidity', target: '40–60%', why: 'Prevents airway drying; reduces sleep disruption.' },
                    { factor: 'Blue Light', target: 'Zero after 20:00 (8 PM)', why: 'Blue light suppresses melatonin ~2–3 hrs. Use blue-light glasses if needed.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-display text-ink">{item.factor}</h3>
                        <span className="font-mono text-sm text-green-bright bg-green/5 px-2 py-1 rounded">{item.target}</span>
                      </div>
                      <p className="text-muted text-sm">{item.why}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4">
                  <strong>Pro tip:</strong> Test one variable at a time. Track sleep quality for 2 weeks before making changes. Use wearables (WHOOP, Oura, Garmin) to measure deep sleep %, REM %, and efficiency.
                </p>
              </div>

              {/* Sleep Supplements */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Sleep Stack: Supplements & Timing</h2>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-ink">
                    <strong>Caveat:</strong> Supplements are optional if sleep basics (light, temperature, consistency) are dialed in. Start with behavioural changes first.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Magnesium Glycinate', databaseId: 'magnesium', dose: '200–400 mg', timing: '19:00–20:00 (2–3 hrs before bed)', why: 'Calms nervous system, improves sleep quality. Glycinate form doesn\'t cause loose stools.' },
                    { name: 'Melatonin', go: 'melatonin-timed-release', dose: '0.5–3 mg', timing: '21:00–21:30 (1 hr before bed)', why: 'Signals circadian rhythm if shifting schedule or jet lag. Less needed if circadian-aligned.' },
                    { name: 'L-Theanine', go: 'now-l-theanine', dose: '100–200 mg', timing: '20:00–21:00', why: 'Promotes relaxation via GABA. Stacks well with magnesium.' },
                    { name: 'Apigenin (from chamomile)', go: 'dw-apigenin', dose: '50–100 mg', timing: '19:30–20:30', why: 'Mild anxiolytic; doesn\'t reduce alertness next day.' },
                    { name: 'Glycine', go: 'bulk-glycine', dose: '3–5 g', timing: '20:30–21:00', why: 'Lowers core body temperature; improves deep sleep efficiency.' },
                    { name: 'Magnesium Threonate', go: 'magtein', dose: '2 g', timing: '20:00 (with magnesium glycinate)', why: 'Crosses blood-brain barrier; may enhance REM quality.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-display text-lg text-ink">{item.name}</h3>
                        <span className="font-mono text-xs text-green-bright bg-green/5 px-2 py-1 rounded">{item.dose}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted mb-2">
                        <Clock className="w-3.5 h-3.5" /> {item.timing}
                      </div>
                      <p className="text-muted text-sm mb-3">{item.why}</p>
                      <Link href={item.databaseId ? `/database/${item.databaseId}` : `/go/${item.go}`} className="text-xs font-medium text-green-bright hover:text-green transition-colors cursor-pointer inline-flex items-center gap-1">
                        View product →
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="bg-surface border border-border rounded-lg p-4 mt-6">
                  <h3 className="font-display text-ink mb-2">Sample Bedtime Routine (21:00)</h3>
                  <div className="space-y-2 text-sm text-muted">
                    <p>20:00 — Dim lights, put on blue-light glasses</p>
                    <p>20:15 — Magnesium glycinate + apigenin with dinner</p>
                    <p>20:45 — L-theanine + glycine with herbal tea (chamomile, passionflower)</p>
                    <p>21:00 — Melatonin 1 mg (if needed)</p>
                    <p>21:30 — Lights off, 65°F, dark silent room</p>
                  </div>
                </div>
              </div>

              {/* Sleep Disruption Fixes */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Troubleshooting: Common Sleep Issues</h2>

                <div className="space-y-4">
                  {[
                    { issue: 'Can\'t Fall Asleep (Sleep Onset Insomnia)', fixes: ['Ensure zero blue light 2+ hrs before bed', 'Increase magnesium glycinate to 400 mg', 'Add L-theanine 200 mg', 'Avoid caffeine after 14:00', 'Try 4–7–8 breathing: inhale 4, hold 7, exhale 8'] },
                    { issue: 'Wake at 3 AM (Mid-Sleep Insomnia)', fixes: ['Check room temperature (too warm?)', 'Add glycine 5 g before bed', 'Reduce alcohol (disrupts REM)', 'Try magnesium threonate 2 g', 'Rule out sleep apnea (seek testing if snoring)'] },
                    { issue: 'Can\'t Get Deep Sleep', fixes: ['Increase exercise (Zone 2 cardio + strength)', 'Cool room to 65°F', 'Add magnesium glycinate + glycine', 'Use red light therapy 30 min before bed (increases melatonin)', 'Track with wearable to validate changes'] },
                    { issue: 'Groggy in Morning (Sleep Inertia)', fixes: ['Get bright light within 30 min of wake', 'Cold shower or splash', 'Skip melatonin (or reduce dose)', 'Check sleep debt (need 7–9 hrs consistently)'] },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-ink mb-3">{item.issue}</h3>
                      <ul className="space-y-2">
                        {item.fixes.map((fix, j) => (
                          <li key={j} className="flex items-start gap-3 text-sm text-muted">
                            <Check className="w-4 h-4 text-green-bright shrink-0 mt-0.5" />
                            <span>{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wearables for Sleep */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Sleep Tracking: Wearables That Matter</h2>
                <p className="text-muted mb-6">
                  Sleep trackers estimate sleep stages via heart rate variability (HRV), movement, and breathing. No wearable measures sleep perfectly, but consistency matters—track trends, not absolute values.
                </p>

                <div className="grid gap-4">
                  {[
                    { device: 'WHOOP Band 4.0', go: 'whoop-4', metrics: 'Sleep need, REM, deep sleep, HRV', score: 93 },
                    { device: 'Oura Ring Gen 3', go: 'oura-gen3', metrics: 'Sleep phases, temperature deviation, resting HR', score: 91 },
                    { device: 'Garmin Fenix 7/Epix', go: 'garmin-fenix7', metrics: 'Sleep stages, body battery, sleep score', score: 88 },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-display text-ink">{item.device}</h3>
                        <span className="font-mono text-xs bg-green/10 border border-green/25 text-green-bright px-2 py-1 rounded">{item.score}/100</span>
                      </div>
                      <p className="text-muted text-sm mb-3">{item.metrics}</p>
                      <Link href={`/go/${item.go}`} className="text-xs font-medium text-green-bright hover:text-green transition-colors cursor-pointer inline-flex items-center gap-1">
                        View product →
                      </Link>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Action:</strong> Pick one tracker and use it consistently for 4 weeks. Log what you changed (supplements, room temp, bedtime, exercise). Correlate your changes with sleep score improvements.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber/5 border border-amber/20 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Important Disclaimer</p>
                    <p className="text-sm text-ink leading-relaxed">
                      This is educational content, not medical advice. Sleep disorders (sleep apnea, restless leg syndrome, insomnia disorder) require professional diagnosis. Consult a sleep specialist or doctor before starting supplements, especially if you take medications or have health conditions. Melatonin can interact with blood thinners and other drugs.
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
                      <span className="text-muted">Duration</span>
                      <p className="text-ink font-semibold">7–9 hours</p>
                    </div>
                    <div>
                      <span className="text-muted">Consistency</span>
                      <p className="text-ink font-semibold">±30 min every day</p>
                    </div>
                    <div>
                      <span className="text-muted">Core Supplements</span>
                      <p className="text-ink font-semibold">Magnesium, melatonin, glycine</p>
                    </div>
                    <div>
                      <span className="text-muted">Key Factors</span>
                      <p className="text-ink font-semibold">Temperature, light, darkness, silence</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <Link href="/database?category=sleep"
                  className="block w-full text-center px-4 py-3 bg-green text-white rounded-lg font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
                  Sleep Products →
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <Link href="/get-started"
                  className="block w-full text-center px-4 py-3 border border-border text-ink rounded-lg font-semibold text-sm hover:border-green/30 hover:bg-surface transition-colors cursor-pointer">
                  Get Personalized Plan
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
