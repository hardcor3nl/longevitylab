import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function CardioModalitiesComparison() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <span className="inline-block font-mono text-[10px] uppercase tracking-wider border border-blue-500/30 px-2.5 py-1 rounded-full bg-blue-500/5 text-blue-400 mb-3">Cardiovascular Training</span>
              <h1 className="font-display text-5xl text-ink mb-2">Cardio Modalities Compared</h1>
              <p className="text-muted max-w-2xl text-lg">Zone 2 training modality breakdown: VO₂ max impact, accessibility, injury risk, and longevity benefits for each cardio style.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Full Comparison Table */}
        <AnimatedSection delay={0.1} className="mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-ink font-semibold">Modality</th>
                  <th className="text-left py-3 px-4 text-ink font-semibold">Zone 2 HR Range</th>
                  <th className="text-left py-3 px-4 text-ink font-semibold">VO₂ Max Stimulus</th>
                  <th className="text-left py-3 px-4 text-ink font-semibold">Injury Risk</th>
                  <th className="text-left py-3 px-4 text-ink font-semibold">Accessibility</th>
                  <th className="text-left py-3 px-4 text-ink font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    modality: 'Running',
                    zone2: '120–150 bpm (example)',
                    vo2: 'Moderate (high impact)',
                    injury: 'High (knees, shins)',
                    accessibility: 'Excellent (free)',
                    bestFor: 'Athletes with resilient joints',
                  },
                  {
                    modality: 'Cycling (outdoor)',
                    zone2: '115–145 bpm (example)',
                    vo2: 'Moderate-high',
                    injury: 'Low (low-impact)',
                    accessibility: 'Good (bike cost)',
                    bestFor: 'Joint-friendly VO₂ building',
                  },
                  {
                    modality: 'Swimming',
                    zone2: '100–130 bpm (example)',
                    vo2: 'High (full-body)',
                    injury: 'Very low (zero impact)',
                    accessibility: 'Moderate (pool access)',
                    bestFor: 'Full-body conditioning, rehab',
                  },
                  {
                    modality: 'Rowing (machine)',
                    zone2: '110–140 bpm (example)',
                    vo2: 'Very high (90% muscle)',
                    injury: 'Moderate (technique matters)',
                    accessibility: 'Moderate (equipment cost)',
                    bestFor: 'Efficient VO₂ max development',
                  },
                  {
                    modality: 'Elliptical',
                    zone2: '125–155 bpm (example)',
                    vo2: 'Moderate (lower intensity)',
                    injury: 'Very low (smooth motion)',
                    accessibility: 'Good (gym access)',
                    bestFor: 'Long Zone 2 sessions, rehab',
                  },
                  {
                    modality: 'Stairclimber',
                    zone2: '130–160 bpm (example)',
                    vo2: 'Moderate-high',
                    injury: 'Moderate (knees)',
                    accessibility: 'Good (gym access)',
                    bestFor: 'Strength + Zone 2 blend',
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-4 text-ink font-semibold">{row.modality}</td>
                    <td className="py-4 px-4 text-muted text-xs">{row.zone2}</td>
                    <td className="py-4 px-4 text-muted text-xs">{row.vo2}</td>
                    <td className="py-4 px-4 text-muted text-xs">{row.injury}</td>
                    <td className="py-4 px-4 text-muted text-xs">{row.accessibility}</td>
                    <td className="py-4 px-4 text-muted text-xs">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        {/* Detailed Breakdowns */}
        <div className="space-y-12">
          {[
            {
              title: 'Running',
              icon: '🏃',
              pros: ['Free (minimal cost)', 'Accessible (anywhere)', 'Strong cardiovascular stimulus', 'Portable, social'],
              cons: ['High impact (injury risk)', 'Knee/shin/plantar fascia stress', 'Joint degeneration over time', 'Joint-dependent'],
              science: 'Running generates 2–3x body-weight force per step. Best for VO₂ max when combined with tempo runs and intervals.',
              longevity: 'Zone 2 running 3–4x/week reduces all-cause mortality ~30%. High impact requires excellent mechanics and lower-body resilience.',
              protocol: 'Zone 2: 30–60 min at conversational pace (60–70% max HR). Injury prevention: strength training 2x/week, dynamic warm-ups, gait analysis every 12 months.',
              cost: '$100–400 (shoes annually)',
            },
            {
              title: 'Cycling',
              icon: '🚴',
              pros: ['Low-impact (joint-friendly)', 'Moderate skill ceiling', 'High VO₂ stimulus (especially intervals)', 'Outdoor nature option'],
              cons: ['Equipment cost ($500–3000+)', 'Weather-dependent (outdoor)', 'Saddle discomfort learning curve', 'Less accessible for beginners'],
              science: 'Cycling isolates lower-body muscles with zero ground reaction force. Can achieve zone 2 at lower absolute watts, reducing cardio stress on joints.',
              longevity: 'Equivalent cardiovascular mortality reduction to running, with 80% less joint loading. Ideal for 50+.',
              protocol: 'Zone 2: 90–120 min at 55–75% FTP (functional threshold power). Outdoor adds variable terrain stimulus. Indoor (trainer) offers precision control.',
              cost: '$500–2000 (bike + gear)',
            },
            {
              title: 'Swimming',
              icon: '🏊',
              pros: ['Zero impact (best for rehab)', 'Full-body engagement', 'Excellent VO₂ stimulus', 'Thermoregulation challenge (sauna-like)'],
              cons: ['Technique-dependent (coaching needed)', 'Pool access limiting', 'Shoulder injury risk if poor form', 'Slower HR response in cold water'],
              science: 'Swimming engages 85% of muscles. Water immersion triggers parasympathetic response; better for stress resilience. Slower HR rise means harder to reach Zone 2 zones.',
              longevity: 'Longevity data sparse (less common than running/cycling), but zero-impact + full-body stimulus makes it ideal for 55+.',
              protocol: 'Zone 2: 40–60 min steady-pace freestyle. Form coaching critical (hire coach for 4 sessions). Build to 2–3x/week.',
              cost: '$50–150/month (pool membership) + coaching ($30–80/session)',
            },
            {
              title: 'Rowing',
              icon: '🚣',
              pros: ['Highest muscle activation (90% engaged)', 'Exceptional VO₂ stimulus', 'Low-impact', 'Scalable (beginner-friendly machines to elite racing)'],
              cons: ['Steep technique learning curve', 'Overuse injuries if form broken (lower back)', 'Equipment cost ($1000–5000)', 'Less intuitive than running/cycling'],
              science: 'Rowing combines pulling + core isometry. Engages more muscle than any other cardio modality. Peak VO₂ gains fastest among cardio sports.',
              longevity: 'Limited epidemiological data, but high-responder modality for VO₂ max. Strong for preserving muscle mass (sarcopenia prevention).',
              protocol: 'Zone 2: 40–50 min at 18–22 strokes/min (low cadence, high force). Intervals: 6x5-min at power-2 every 2 weeks. Hire coach for form (first 10 sessions critical).',
              cost: '$1500–4000 (machine) + coaching ($40–100/session)',
            },
            {
              title: 'Elliptical',
              icon: '🏃‍♀️',
              pros: ['Zero impact', 'Long zone 2 sessions easy', 'Minimal technique barrier', 'Minimal injury risk'],
              cons: ['Psychological (feels "cheating")', 'Lower intensity ceiling', 'Muscle stimulus modest', 'Requires gym access'],
              science: 'Elliptical removes ground impact while maintaining stepping motion. Lower VO₂ max stimulus than running/rowing, but excellent for volume.',
              longevity: 'Ideal for joint degeneration, osteoarthritis, or 60+. Volume beats intensity for all-cause mortality reduction at this point.',
              protocol: 'Zone 2: 60–90 min steady. Can watch content (books, podcasts). No coaching needed. Self-regulating (easy to stay in zone).',
              cost: '$0–20/month (gym membership)',
            },
            {
              title: 'Stairclimber',
              icon: '🚶',
              pros: ['Strength + cardio blend', 'Quad/glute engagement', 'Lower injury risk than running', 'Metabolic rate boost'],
              cons: ['Not true Zone 2 (quads fatigue)', 'Knee stress if overused', 'Less VO₂ max stimulus than pure cardio', 'Requires gym access'],
              science: 'Stairclimber combines isometric leg strength with cardio. Metabolic demand high but not pure aerobic—quads fatigue before cardio system maxes.',
              longevity: 'Best as 1–2x/week complement to primary cardio (not standalone). Useful for sarcopenia prevention.',
              protocol: 'Not Zone 2 primary modality. Use as 2x/week 20–30 min complement. Can layer: 30 min zone 2 on another modality, then 20 min stairclimber.',
              cost: '$0–20/month (gym membership)',
            },
          ].map((mod, i) => (
            <AnimatedSection key={i} delay={0.1 + i * 0.05}>
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="font-display text-2xl text-ink mb-1">{mod.icon} {mod.title}</h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="mb-6">
                      <p className="text-xs text-muted uppercase tracking-wider mb-2">Pros</p>
                      <ul className="space-y-1 text-sm text-ink">
                        {mod.pros.map((pro, j) => (
                          <li key={j}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-2">Cons</p>
                      <ul className="space-y-1 text-sm text-muted">
                        {mod.cons.map((con, j) => (
                          <li key={j}>✗ {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-2">Science</p>
                      <p className="text-muted">{mod.science}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-2">Longevity Impact</p>
                      <p className="text-muted">{mod.longevity}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border mt-6 pt-6 space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-ink mb-2">Longevity Protocol</p>
                    <p className="text-muted">{mod.protocol}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-ink mb-2">Estimated Annual Cost</p>
                    <p className="text-muted font-mono">{mod.cost}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Summary */}
        <AnimatedSection delay={0.5} className="mt-12">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-6">
            <h2 className="font-display text-xl text-ink mb-4">The Longevity Verdict</h2>
            <div className="space-y-3 text-sm text-muted">
              <p>
                <strong>For VO₂ Max Development:</strong> Rowing &gt; Running &gt; Cycling. Rowing engages most muscle and generates fastest VO₂ gains. Running is accessible and well-researched for longevity mortality reduction. Cycling offers low-impact efficiency.
              </p>
              <p>
                <strong>For Joint Health (50+):</strong> Cycling &gt; Swimming &gt; Elliptical. Cycling combines VO₂ stimulus with zero impact. Swimming is recovery-friendly. Elliptical is ideal for existing arthritis.
              </p>
              <p>
                <strong>For Sustainability (10+ years):</strong> Cycling or Swimming. Running requires exceptional biomechanics and strength work to avoid chronic injury. Rowing is intense and technique-dependent, making it hard to maintain long-term without coaching.
              </p>
              <p>
                <strong>Recommendation:</strong> Build a dual modality stack—primary (50% volume) + secondary (30% volume) + strength/skill work (20%). Example: 3x/week cycling + 2x/week rowing/swimming + 2x/week strength training.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.6} className="text-center mt-12">
          <Link href="/cardio" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors cursor-pointer">
            ← Full Zone 2 Protocol
          </Link>
        </AnimatedSection>
      </div>
    </div>
  )
}
