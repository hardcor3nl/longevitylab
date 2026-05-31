import Link from 'next/link'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight, Brain, Clock, Sparkles } from 'lucide-react'

export function QuizTeaser() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden bg-surface border border-border rounded-3xl p-8 sm:p-12">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-[400px] h-[300px] pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at top right, rgba(45,158,88,0.08), transparent 60%)' }} />

            <div className="relative grid sm:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green/10 border border-green/20 text-green-bright px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest mb-5">
                  <Sparkles className="w-3 h-3" /> Free Tool
                </div>
                <h2 className="font-display text-4xl text-ink mb-4 leading-tight">
                  What&apos;s Your<br />Biological Age?
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  Answer 10 science-backed questions and get your estimated biological age — plus a personalised supplement protocol to reduce it.
                </p>
                <Link href="/quiz"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-semibold hover:bg-green-bright transition-colors cursor-pointer shadow-lg shadow-green/20">
                  Take the Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Brain, label: 'Sleep Quality', value: 'Analysed' },
                  { icon: Clock, label: 'Takes only', value: '2 minutes' },
                  { icon: Sparkles, label: 'Personalised', value: 'Protocol' },
                  { icon: ArrowRight, label: 'No sign-up', value: '100% Free' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-cream dark:bg-[#0a0f0b] border border-border rounded-2xl p-4">
                    <Icon className="w-4 h-4 text-green-bright mb-2" />
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</p>
                    <p className="font-display text-lg text-ink mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
