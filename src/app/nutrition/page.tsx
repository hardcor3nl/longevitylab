import { AnimatedSection } from '@/components/AnimatedSection'
import { HubClusterStrip } from '@/components/ContentCluster'
import { ArrowLeft, Apple, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function NutritionProtocol() {
  return (
    <div className="pt-24 pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-900/20 via-green-800/10 to-transparent border-b border-border mb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/protocols" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Protocols
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Apple className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-emerald-500/30 px-2.5 py-1 rounded-full bg-emerald-500/5 text-emerald-400 mb-3">Lifestyle Protocol</span>
              <h1 className="font-display text-5xl text-ink mb-2">Nutrition Optimization</h1>
              <p className="text-muted max-w-2xl text-lg">Macro timing, meal order hacks, supplement stacking, and metabolic flexibility for longevity.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <HubClusterStrip clusterId="nutrition" title="Priority nutrition guides" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Main Content */}
          <div>
            <AnimatedSection>
              {/* Foundations */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">The Foundation: Macros for Longevity</h2>
                <p className="text-muted text-lg leading-relaxed mb-6">
                  Your macro split matters less than protein adequacy, micronutrient density, and metabolic health. The baseline for longevity:
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-surface border border-border rounded-lg p-4 text-center">
                    <div className="text-xl font-display text-ink mb-2">1.6–2.2 g/kg</div>
                    <p className="text-xs text-muted uppercase tracking-wide">Protein (daily)</p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-4 text-center">
                    <div className="text-xl font-display text-ink mb-2">20–30%</div>
                    <p className="text-xs text-muted uppercase tracking-wide">Calories from fat</p>
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-4 text-center">
                    <div className="text-xl font-display text-ink mb-2">Whole foods</div>
                    <p className="text-xs text-muted uppercase tracking-wide">80%+ intake</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { macro: 'Protein', range: '1.6–2.2 g/kg BW/day', why: 'Preserves muscle, supports autophagy, high thermic effect. Higher intakes safe long-term.' },
                    { macro: 'Fat', range: '20–30% calories', why: 'Essential for hormones, mitochondrial health, satiety. Prioritize omega-3s and MUFA.' },
                    { macro: 'Carbs', range: 'Flexible (20–50%)', why: 'Vary by activity level. Lower carb supports metabolic flexibility; high carb supports performance.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-display text-ink">{item.macro}</h3>
                        <span className="font-mono text-xs text-green-bright bg-green/5 px-2 py-1 rounded">{item.range}</span>
                      </div>
                      <p className="text-muted text-sm">{item.why}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal Timing */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Meal Timing: Metabolic Windows</h2>
                <p className="text-muted mb-6">
                  When you eat matters nearly as much as what you eat. Timing affects circadian alignment, digestion, autophagy, and hormone patterns.
                </p>

                <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                  <h3 className="font-display text-lg text-ink mb-4">The 2-Meal Protocol (Evidence-Backed)</h3>
                  <div className="space-y-4">
                    {[
                      { time: '7:00–9:00 AM', action: 'First meal within 1–2 hrs of wake', detail: 'Resets food-timing clock, stabilizes cortisol, breaks overnight fast.' },
                      { time: '12:00–14:00 PM', action: 'Largest meal (lunch)', detail: 'Peak insulin sensitivity, best digestion window, fuel for afternoon activity.' },
                      { time: '14:00–17:00 PM', action: 'Last caloric intake (ideally)', detail: 'Allows 4–6 hr fasting window before bed for autophagy and sleep quality.' },
                      { time: '19:00–21:00 PM', action: 'No food (or very light)', detail: 'Sleeping with full stomach disrupts deep sleep; melatonin peaks on empty stomach.' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="font-mono text-sm text-green-bright font-semibold min-w-fit">{item.time}</div>
                        <div>
                          <p className="text-ink font-semibold text-sm">{item.action}</p>
                          <p className="text-muted text-xs mt-1">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4">
                  <p className="text-sm text-ink">
                    <strong>Why 2 meals?</strong> Longer fasting periods trigger autophagy, improve insulin sensitivity, and simplify adherence. Most longevity experts (Huberman, Sinclair) use 2–3 meals max.
                  </p>
                </div>
              </div>

              {/* Meal Order */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Meal Order Hack: Vegetables First</h2>
                <p className="text-muted mb-6">
                  The sequence in which you eat components of a meal dramatically affects glucose response and satiety.
                </p>

                <div className="space-y-4">
                  {[
                    { order: '1st', item: 'Vegetables & Fiber', effect: 'Slows glucose absorption by 20–30%. Eat cruciferous, leafy greens, legumes first.' },
                    { order: '2nd', item: 'Protein & Fat', effect: 'Slows carb digestion further. Satiety signal arrives 15 min later.' },
                    { order: '3rd', item: 'Carbs & Starches', effect: 'Last component prevents blood sugar spike. Glucose peaks 30–50% lower.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-green/10 border border-green/20 flex items-center justify-center shrink-0 font-semibold text-green-bright text-sm">
                          {item.order}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-ink">{item.item}</h3>
                          <p className="text-muted text-sm mt-1">{item.effect}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Real example:</strong> Pizza (cheese + bread + vegetable toppings) → Eat toppings first, then cheese, then crust. Glucose response drops 20–30%.
                </p>
              </div>

              {/* Supplement Stacking */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Supplement Stacking: Synergies & Timing</h2>
                <p className="text-muted mb-6">
                  Some supplements amplify each other; others compete for absorption. Smart stacking maximizes benefits.
                </p>

                <div className="space-y-4">
                  {[
                    { stack: 'Morning Glucose Control', items: [{ label: 'Berberine 500 mg', go: 'thorne-berberine' }, { label: 'Chromium 200 mcg', go: 'now-chromium' }, { label: 'Cinnamon 1 g', go: 'now-cinnamon' }], timing: 'With breakfast', why: 'All target insulin sensitivity. Synergistic effect on glucose response.' },
                    { stack: 'Metabolic Flexibility', items: [{ label: 'Acetyl-L-carnitine 2 g', go: 'now-alcar' }, { label: 'R-ALA 300 mg', go: 'jarrow-r-ala' }, { label: 'PQQ 20 mg', go: 'jarrow-pqq' }], timing: 'Pre-fasted cardio', why: 'Enhances fat oxidation and mitochondrial efficiency.' },
                    { stack: 'Nutrient Absorption', items: [{ label: 'Curcumin 500 mg + black pepper 5 mg', go: 'thorne-meriva-curcumin' }, { label: 'Vitamin D3 2000 IU + K2 100 mcg', go: 'thorne-dk2' }, { label: 'Fish oil + vitamin E', go: 'nordic-omega3' }], timing: 'With meals', why: 'Fat-soluble; black pepper increases curcumin bioavailability 2000%.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-3">{item.stack}</h3>
                      <div className="grid sm:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-2">Supplements</p>
                          <ul className="space-y-1.5">
                            {item.items.map((s, j) => (
                              <li key={j} className="text-sm text-ink flex items-center justify-between gap-2">
                                <span>• {s.label}</span>
                                <Link href={`/go/${s.go}`} className="text-xs font-medium text-green-bright hover:text-green transition-colors cursor-pointer shrink-0">
                                  Shop →
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-2">Timing & Why</p>
                          <p className="text-sm text-ink"><strong>{item.timing}</strong></p>
                          <p className="text-xs text-muted mt-1">{item.why}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber/5 border border-amber/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-ink">
                    <strong>Rule:</strong> Don&apos;t stack things that compete for absorption (iron + calcium, calcium + magnesium). Take them 2+ hours apart.
                  </p>
                </div>
              </div>

              {/* Intermittent Fasting */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Intermittent Fasting: Protocols & Trade-Offs</h2>

                <div className="space-y-4">
                  {[
                    { protocol: '16:8 (Time-Restricted Eating)', fast: '16 hrs', eat: '8 hrs', example: 'Noon–8 PM eating window', pros: 'Easiest to sustain, good autophagy, muscle-sparing', cons: 'Moderate calorie restriction benefit' },
                    { protocol: '20:4 (Warrior Diet)', fast: '20 hrs', eat: '4 hrs', example: 'One 4-hour evening feeding window', pros: 'Maximal autophagy, simplicity', cons: 'Hard to meet protein; harder to sustain' },
                    { protocol: '5:2 (5 days normal, 2 days low-cal)', fast: 'Variable', eat: '500 cal on fast days', example: 'Normal Mon–Fri, 500 cal Sat–Sun', pros: 'Sustainable, good adherence, metabolic flexibility', cons: 'Slower results than daily IF' },
                  ].map((item, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-5">
                      <h3 className="font-display text-lg text-ink mb-3">{item.protocol}</h3>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-1">Window</p>
                          <p className="text-ink font-semibold">{item.fast} fast / {item.eat} eat</p>
                          <p className="text-xs text-muted mt-1">{item.example}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wide mb-1">Pros & Cons</p>
                          <p className="text-ink text-xs"><strong>✓</strong> {item.pros}</p>
                          <p className="text-ink text-xs"><strong>✗</strong> {item.cons}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Best for longevity:</strong> 16:8 with consistent meal timing (e.g., always noon–8 PM). Easier to stick with long-term than extreme protocols.
                </p>
              </div>

              {/* Metabolic Flexibility */}
              <div className="mb-12">
                <h2 className="font-display text-3xl text-ink mb-4">Metabolic Flexibility: The Hidden Skill</h2>
                <p className="text-muted mb-6">
                  Metabolic flexibility = ability to switch between glucose and fat oxidation. It predicts longevity, insulin sensitivity, and metabolic health.
                </p>

                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="font-display text-lg text-ink mb-4">Building Metabolic Flexibility</h3>
                  <div className="space-y-3">
                    {[
                      'Zone 2 cardio on fasted state (4+ hours post-meal) trains fat oxidation',
                      'Intermittent fasting (even 16:8) improves insulin sensitivity over weeks',
                      'Carb cycling: low-carb 2–3 days/week, moderate-carb 4–5 days/week',
                      'Strength training post-fasted cardio (glycogen depleted → increased AMPK)',
                      'Periodically skip post-workout carbs (forces fat adaptation)',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-bright shrink-0 mt-0.5" />
                        <span className="text-ink">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted italic border-l-2 border-border pl-4 mt-6">
                  <strong>Metric:</strong> Test fasting glucose (under 90 mg/dL = good). Use CGM if available to see your glucose response to fasting and meal combinations.
                </p>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber/5 border border-amber/20 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Medical Disclaimer</p>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <p className="text-sm text-ink leading-relaxed">
                      This is educational content. Consult a registered dietitian or doctor before major dietary changes, especially if you have diabetes, gastrointestinal issues, or take medications. Intermittent fasting is not appropriate for pregnant/nursing women, those with eating disorder history, or certain medical conditions.
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
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Quick Reference</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted">Daily Protein</span>
                    <p className="text-ink font-semibold">1.6–2.2 g/kg</p>
                  </div>
                  <div>
                    <span className="text-muted">Meal Timing</span>
                    <p className="text-ink font-semibold">2 meals, 6–8 hrs apart</p>
                  </div>
                  <div>
                    <span className="text-muted">Fasting Window</span>
                    <p className="text-ink font-semibold">16:8 or 12:12</p>
                  </div>
                  <div>
                    <span className="text-muted">Key Focus</span>
                    <p className="text-ink font-semibold">Whole foods 80%+</p>
                  </div>
                </div>
              </div>

              <Link href="/database?category=supplements"
                className="block w-full text-center px-4 py-3 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-colors cursor-pointer">
                Nutrition Supplements →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
