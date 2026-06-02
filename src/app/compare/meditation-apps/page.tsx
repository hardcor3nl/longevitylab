import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MeditationAppComparison() {
  return (
    <div className="pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <Link href="/compare" className="inline-flex items-center gap-1.5 text-muted hover:text-ink text-sm mb-6 transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> All Comparisons
          </Link>
          <h1 className="font-display text-4xl text-ink mb-4">Meditation Apps: Honest Comparison</h1>
          <p className="text-muted text-lg max-w-2xl mb-12">
            Five top meditation apps compared on approach, science backing, cost, and best use cases. No app is universally best—it depends on your goal and learning style.
          </p>
        </AnimatedSection>

        {/* Comparison Grid */}
        <AnimatedSection delay={0.1}>
          <div className="space-y-6 mb-12">
            {[
              {
                app: 'Insight Timer',
                best: 'Best Overall (Free + Premium)',
                approach: 'Eclectic: Vipassana, Loving-Kindness, sleep, music, talks',
                courses: '100,000+ free meditations + premium courses',
                pricing: 'Free (limited), Premium $10/mo',
                pros: ['Huge library', 'Free option genuinely good', 'Community', 'Teacher variety'],
                cons: ['Can feel overwhelming', 'Quality varies', 'Paid features gated'],
                science: 'Backed by research; founder is scientist',
                best_for: 'Beginners exploring different styles; budget-conscious',
              },
              {
                app: 'Wim Hof Method',
                best: 'Best for Breathwork & Cold Exposure',
                approach: 'Breathing protocols + cold water immersion + mindset',
                courses: '7-week structured program + daily breathing',
                pricing: 'Free app with basics, Premium $10/mo (full access)',
                pros: ['Evidence-backed breathing', 'Measurable results (HRV, cortisol)', 'Community challenges'],
                cons: ['Not for anxiety-prone (intense)', 'Niche focus', 'Requires commitment'],
                science: 'RCTs show immune boosting, cold tolerance, stress resilience',
                best_for: 'Athletes, biohackers, cold-water enthusiasts',
              },
              {
                app: 'Calm',
                best: 'Best for Sleep & Relaxation',
                approach: 'Sleep stories, ambient music, body scans, stress relief',
                courses: 'Sleep focus: 200+ stories + music library',
                pricing: '$15/mo or $70/yr (premium only)',
                pros: ['Exceptional sleep content', 'Celebrity narrators (sleep stories)', 'Beautiful UI', 'Ambient music'],
                cons: ['Most expensive', 'Less on insight meditation', 'Gated behind paywall'],
                science: 'Sleep science solid; general meditation evidence mixed',
                best_for: 'Sleep problems, insomnia, relaxation focus',
              },
              {
                app: '10% Happier',
                best: 'Best for Skeptics & Science-Minded',
                approach: 'Secular, science-based, teaches how meditation works',
                courses: '300+ meditations curated by teacher (Dan Harris)',
                pricing: '$10/mo or $100/yr',
                pros: ['Skeptic-friendly', 'Expert interviews', 'Clear teaching', 'Research-backed'],
                cons: ['Smaller library than Insight Timer', 'Less free content', 'Less spiritual depth'],
                science: 'Focuses on neuroscience of meditation; evidence-heavy',
                best_for: 'Skeptics, people who need explanations, science learners',
              },
              {
                app: 'Headspace',
                best: 'Best for Beginners (Structured)',
                approach: 'Gamified, bite-sized, animation-heavy, Netflix-partnered',
                courses: 'Quick meditations (3–20 min), SOS calm, focus, sleep',
                pricing: '$10/mo or $70/yr',
                pros: ['Extremely beginner-friendly', 'Animations engaging', 'Bite-sized sessions', 'Scientifically sound'],
                cons: ['Feels commercial', 'Less depth for advanced practitioners', 'Paywall early'],
                science: 'Backed by research; CEO is trained teacher',
                best_for: 'Absolute beginners, ADHD-friendly approach, mobile-first',
              },
            ].map((app, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-display text-2xl text-ink">{app.app}</h2>
                    <p className="text-sm text-green-bright font-semibold mt-1">{app.best}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide mb-2">Approach</p>
                    <p className="text-sm text-ink mb-4">{app.approach}</p>

                    <p className="text-xs text-muted uppercase tracking-wide mb-2">Course Library</p>
                    <p className="text-sm text-ink mb-4">{app.courses}</p>

                    <p className="text-xs text-muted uppercase tracking-wide mb-2">Pricing</p>
                    <p className="text-sm text-ink font-semibold">{app.pricing}</p>
                  </div>

                  <div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide mb-2">Pros</p>
                      <ul className="text-sm text-ink space-y-1 mb-4">
                        {app.pros.map((pro, j) => (
                          <li key={j}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs text-muted uppercase tracking-wide mb-2">Cons</p>
                      <ul className="text-sm text-muted space-y-1">
                        {app.cons.map((con, j) => (
                          <li key={j}>✗ {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <p><strong>Science:</strong> <span className="text-muted">{app.science}</span></p>
                  <p><strong>Best For:</strong> <span className="text-muted">{app.best_for}</span></p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Decision Tree */}
        <AnimatedSection delay={0.2}>
          <h2 className="font-display text-2xl text-ink mb-6">Quick Decision Tree</h2>
          <div className="space-y-4 mb-12">
            {[
              { q: 'Budget is my #1 concern?', a: '→ Insight Timer (free option is genuinely great)' },
              { q: 'I want breathwork + cold exposure?', a: '→ Wim Hof Method' },
              { q: 'I have insomnia or sleep issues?', a: '→ Calm (best sleep content, worth the $)' },
              { q: 'I\'m a skeptic / need science explanations?', a: '→ 10% Happier' },
              { q: 'I\'m a complete beginner and want easiest on-ramp?', a: '→ Headspace' },
              { q: 'I want the most comprehensive library?', a: '→ Insight Timer' },
            ].map((item, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-4">
                <p className="text-sm font-semibold text-ink mb-1">{item.q}</p>
                <p className="text-sm text-green-bright font-semibold">{item.a}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* DIY Alternative */}
        <AnimatedSection delay={0.3}>
          <h2 className="font-display text-2xl text-ink mb-6">Free / DIY Alternatives (No App)</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                method: 'YouTube Meditation Videos',
                cost: 'Free',
                content: 'Tao Porchon-Lynch (100+ free), The Honest Guys (ambient + meditation)',
                pros: 'Zero cost, huge variety, advert-free channels available',
                cons: 'No structure, curation burden on you',
              },
              {
                method: 'Podcasts + Audio Programs',
                cost: 'Free or $10–15',
                content: 'Secular Buddhism podcast, Sam Harris "Making Sense" (premium guided meditations)',
                pros: 'Deep dives, interview-based learning',
                cons: 'Less structured programs for beginners',
              },
              {
                method: 'Local Meditation Groups',
                cost: 'Free–$10/session',
                content: 'Meetup.com: Zen centers, Buddhist sanghas, meditation circles',
                pros: 'Community, in-person guidance, free options exist',
                cons: 'Schedule dependent, variable teaching quality',
              },
              {
                method: 'Books + Self-Guided',
                cost: '$15–30 per book',
                content: '"10-Minute Mindfulness" (Tara Brach), "The Mind Illuminated" (Culadasa)',
                pros: 'Deep understanding, one-time cost',
                cons: 'Requires discipline, no guided audio',
              },
            ].map((alt, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-5">
                <h3 className="font-display text-lg text-ink mb-2">{alt.method}</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Cost:</strong> <span className="text-muted">{alt.cost}</span></p>
                  <p><strong>Content:</strong> <span className="text-muted">{alt.content}</span></p>
                  <p className="text-xs"><strong>Pros:</strong> {alt.pros}</p>
                  <p className="text-xs"><strong>Cons:</strong> {alt.cons}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Verdict */}
        <AnimatedSection delay={0.4}>
          <div className="bg-green/5 border border-green/25 rounded-lg p-6 mb-12">
            <h2 className="font-display text-xl text-ink mb-3">The Verdict</h2>
            <p className="text-muted mb-3">
              <strong>Best overall pick for most people:</strong> Insight Timer. Free tier is genuinely useful, library is massive, and community is supportive. Pay $10/mo later if you want premium.
            </p>
            <p className="text-muted">
              <strong>If you can only buy one paid app:</strong> Calm if sleep is your goal, 10% Happier if you want rigorous science, Headspace if you&apos;re brand-new.
            </p>
          </div>
        </AnimatedSection>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.5} className="text-center">
          <Link href="/compare" className="inline-flex items-center gap-2 text-green-bright hover:text-green font-semibold text-sm transition-colors cursor-pointer">
            ← Back to All Comparisons
          </Link>
        </AnimatedSection>
      </div>
    </div>
  )
}
