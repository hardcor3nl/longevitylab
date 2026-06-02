import { AnimatedSection } from '@/components/AnimatedSection'
import Link from 'next/link'
import { User, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Editorial Team',
  description: "Meet the physicians, researchers, and scientists behind LongevityLab's independent reviews.",
}

const authors = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Medical Reviewer',
    initials: 'SC',
    bio: 'MD with 12 years in preventive medicine and longevity research. Former researcher at UCSF. Specialises in metabolic health, diagnostics, and evidence-based supplementation.',
    expertise: ['Diagnostics', 'Metabolic Health', 'Supplements', 'Preventive Medicine'],
    articles: 8,
    credentials: 'MD, Internal Medicine. Board-certified. Former UCSF researcher.',
    slug: 'sarah-chen',
  },
  {
    name: 'Marcus Webb',
    role: 'Senior Recovery & Tech Editor',
    initials: 'MW',
    bio: 'MSc Exercise Physiology. 10 years covering health technology, recovery science, and wearable devices. Tests every device personally with lab-grade instruments.',
    expertise: ['Wearables', 'Recovery Devices', 'Red Light Therapy', 'Exercise Science'],
    articles: 15,
    credentials: 'MSc Exercise Physiology. ACSM Certified.',
    slug: 'marcus-webb',
  },
  {
    name: 'Dr. James Okafor',
    role: 'Research Scientist',
    initials: 'JO',
    bio: 'PhD Molecular Biology. Specialises in NAD+ metabolism, mitochondrial health, and cellular longevity mechanisms. Reviews all supplement mechanistic claims.',
    expertise: ['NAD+ & Mitochondria', 'Molecular Biology', 'Supplement Science', 'Protocols'],
    articles: 6,
    credentials: 'PhD Molecular Biology. Published researcher in NAD+ metabolism.',
    slug: 'james-okafor',
  },
]

export default function AuthorsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">The Team</p>
          <h1 className="font-display text-5xl text-ink mb-4">Our Editorial Team</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Every article on LongevityLab is written or reviewed by a qualified expert.
            Our team is contractually prohibited from owning equity in supplement or device companies.
          </p>
        </AnimatedSection>

        <div className="space-y-6">
          {authors.map((author, i) => (
            <AnimatedSection key={author.name} delay={i * 0.1}>
              <div className="bg-surface border border-border rounded-2xl p-6 hover:border-green/25 transition-colors">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
                    <span className="font-mono text-lg font-medium text-green-bright">{author.initials}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h2 className="font-display text-2xl text-ink">{author.name}</h2>
                        <p className="font-mono text-xs uppercase tracking-widest text-green-bright mt-0.5">{author.role}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display text-2xl text-ink">{author.articles}</div>
                        <div className="font-mono text-[9px] text-muted uppercase">articles</div>
                      </div>
                    </div>
                    <p className="text-muted text-sm leading-relaxed mt-3 mb-4">{author.bio}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs text-muted font-mono">{author.credentials}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {author.expertise.map(e => (
                        <span key={e} className="font-mono text-[10px] uppercase tracking-wider border border-border text-muted px-2.5 py-1 rounded-full">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.4} className="mt-10 bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display text-xl text-ink mb-3">Editorial Independence</h3>
          <p className="text-muted text-sm leading-relaxed">
            Our team members are contractually prohibited from holding equity positions in supplement,
            wearable, or health device companies. Affiliate commissions fund our operations but never
            influence editorial decisions. Products are purchased independently unless specifically
            disclosed otherwise.
          </p>
          <Link href="/about" className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-green-bright hover:text-green transition-colors cursor-pointer">
            <BookOpen className="w-4 h-4" />
            Read our full editorial policy
          </Link>
        </AnimatedSection>
      </div>
    </div>
  )
}
