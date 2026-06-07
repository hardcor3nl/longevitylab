import Link from 'next/link'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight, Brain, Clock, Sparkles, CheckCircle2 } from 'lucide-react'

const features = [
  { icon: Brain,         label: 'Sleep, stress & lifestyle analysed' },
  { icon: Clock,         label: 'Takes just 2 minutes'               },
  { icon: Sparkles,      label: 'Personalised supplement protocol'   },
  { icon: CheckCircle2,  label: 'No sign-up · 100% free'            },
]

export function QuizTeaser() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #071a0a 0%, #0d2211 45%, #051507 100%)' }}>

            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.18]"
              style={{ backgroundImage: 'radial-gradient(circle, #2d9e58 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            {/* Glow */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(45,158,88,0.12)' }} />

            <div className="relative px-8 py-12 sm:px-14 sm:py-16">
              <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">

                {/* Left */}
                <div>
                  <div className="inline-flex items-center gap-2 border border-green/30 bg-green/10 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-6">
                    <Sparkles className="w-3 h-3" /> Free Assessment
                  </div>
                  <h2 className="font-display text-white leading-tight mb-4"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
                    What&apos;s Your<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #4dc478 0%, #2d9e58 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>Biological Age?</span>
                  </h2>
                  <p className="text-[#7aad7d] text-lg leading-relaxed mb-8 max-w-md">
                    Answer 10 science-backed questions and get your estimated biological age —
                    plus a personalised protocol to reduce it.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                    {features.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-2.5 text-sm text-white/70">
                        <div className="w-5 h-5 rounded-md bg-green/20 border border-green/30 flex items-center justify-center shrink-0">
                          <Icon className="w-3 h-3 text-green-bright" />
                        </div>
                        {label}
                      </div>
                    ))}
                  </div>

                  <Link href="/quiz"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-green-bright text-white rounded-xl font-semibold text-sm hover:bg-green transition-all duration-200 cursor-pointer"
                    style={{ boxShadow: '0 4px 20px rgba(45,158,88,0.35)' }}
                  >
                    Take the Free Quiz
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                  </Link>
                </div>

                {/* Right — decorative score card */}
                <div className="hidden lg:block shrink-0 w-64">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">Sample Result</p>
                    <div className="flex items-end gap-3 mb-5">
                      <div>
                        <div className="font-display text-6xl text-white leading-none">34</div>
                        <div className="font-mono text-xs text-green-bright mt-1">Biological Age</div>
                      </div>
                      <div className="pb-1">
                        <div className="font-mono text-sm text-white/40 line-through">42</div>
                        <div className="font-mono text-xs text-white/40">Chronological</div>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Sleep quality',    pct: 88 },
                        { label: 'Metabolic health', pct: 76 },
                        { label: 'Inflammation',     pct: 82 },
                      ].map(({ label, pct }) => (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono text-[10px] text-white/50">{label}</span>
                            <span className="font-mono text-[10px] text-white/50">{pct}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green/80 to-green-bright rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
