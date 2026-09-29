import { protocols, getProtocolById } from '@/lib/protocols'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection } from '@/components/AnimatedSection'
import { AffiliateDisclosure } from '@/components/ArticleTrust'
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, AlertTriangle, Clock, FlaskConical } from 'lucide-react'
import type { Metadata } from 'next'
import { absoluteUrl, SITE } from '@/lib/site'

export function generateStaticParams() {
  return protocols.map(p => ({ id: p.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProtocolById(params.id)
  if (!p) return {}
  const url = absoluteUrl(`/protocols/${params.id}`)
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      title: p.title,
      description: p.description,
      url,
      type: 'article',
      siteName: SITE.name,
    },
  }
}

const difficultyColor = {
  Beginner: 'bg-green/10 text-green-bright border-green/25',
  Intermediate: 'bg-amber/10 text-amber border-amber/25',
  Advanced: 'bg-red-500/10 text-red-400 border-red-500/25',
}

export default function ProtocolPage({ params }: { params: { id: string } }) {
  const protocol = getProtocolById(params.id)
  if (!protocol) notFound()

  const otherProtocols = protocols.filter(p => p.id !== protocol.id)

  const faqJsonLd = protocol.faq ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: protocol.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  return (
    <div className="pt-24 pb-24">
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {/* Hero */}
      <div className="relative h-[420px] mb-12 overflow-hidden">
        <Image src={protocol.image} alt={protocol.expert} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
            <Link href="/protocols" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> All Protocols
            </Link>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <span className={`inline-block font-mono text-[10px] uppercase tracking-wider border px-2.5 py-1 rounded-full mb-3 ${difficultyColor[protocol.difficulty]}`}>
                  {protocol.difficulty}
                </span>
                <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight">{protocol.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Main content */}
          <div>
            <AnimatedSection>
              {/* Expert bio */}
              <div className="bg-surface border border-border rounded-2xl p-6 mb-8 flex gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  <Image src={protocol.expertImage} alt={protocol.expert} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-ink">{protocol.expert}</h2>
                  <p className="text-muted text-sm mb-2">{protocol.role}</p>
                  <a href={`https://${protocol.website}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-bright hover:text-green transition-colors cursor-pointer">
                    {protocol.website} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <AffiliateDisclosure />

              {/* Long description */}
              <p className="text-muted text-lg leading-relaxed mb-8">{protocol.longDescription}</p>

              {/* Philosophy */}
              <div className="mb-10">
                <h2 className="font-display text-2xl text-ink mb-4">Core Philosophy</h2>
                <ul className="space-y-3">
                  {protocol.keyPhilosophy.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green/10 border border-green/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-bright" />
                      </div>
                      <span className="text-ink leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Protocol sections */}
              {protocol.sections.map((section) => (
                <div key={section.title} className="mb-12">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-green/10 border border-green/20 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-3.5 h-3.5 text-green-bright" />
                    </div>
                    <h2 className="font-display text-2xl text-ink">{section.title}</h2>
                  </div>
                  <p className="text-muted mb-6 pl-10">{section.description}</p>

                  <div className="space-y-3 pl-0">
                    {section.items.map((item) => (
                      <div key={item.name}
                        className="bg-surface border border-border rounded-2xl p-5 hover:border-green/25 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-lg text-ink">{item.name}</h3>
                              {item.supplementId && (
                                <Link href={`/database/${item.supplementId}`}
                                  className="font-mono text-[9px] uppercase tracking-wider text-green-bright border border-green/25 px-2 py-0.5 rounded-full hover:bg-green/5 transition-colors cursor-pointer">
                                  View in Database
                                </Link>
                              )}
                              {item.productSlug && (
                                <Link href={`/go/${item.productSlug}`}
                                  className="font-mono text-[9px] uppercase tracking-wider text-green-bright border border-green/25 px-2 py-0.5 rounded-full hover:bg-green/5 transition-colors cursor-pointer">
                                  Where to Buy
                                </Link>
                              )}
                            </div>
                            <p className="text-sm text-muted mt-0.5">{item.purpose}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono text-xs font-medium text-ink bg-surface-2 px-2.5 py-1 rounded-lg">{item.dose}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className="flex items-center gap-1.5 text-xs text-muted">
                            <Clock className="w-3 h-3" /> {item.timing}
                          </span>
                          {item.evidenceNote && (
                            <span className="text-xs text-muted italic border-l border-border pl-3">{item.evidenceNote}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* FAQ */}
              {protocol.faq && (
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-ink mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {protocol.faq.map((f) => (
                      <div key={f.question} className="bg-surface border border-border rounded-2xl p-5">
                        <h3 className="font-display text-lg text-ink mb-2">{f.question}</h3>
                        <p className="text-sm text-muted leading-relaxed">{f.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-amber/5 border border-amber/20 rounded-2xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-amber mb-2">Important Disclaimer</p>
                    <p className="text-sm text-ink leading-relaxed">{protocol.disclaimer}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted font-mono">{protocol.affiliateDisclosure}</p>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28 space-y-5">
              {/* Quick stats */}
              <AnimatedSection delay={0.1}>
                <div className="bg-surface border border-border rounded-2xl p-5">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">At a Glance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Supplements</span>
                      <span className="font-mono text-sm text-ink font-medium">{protocol.totalSupplements}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Est. monthly cost</span>
                      <span className="font-mono text-sm text-ink font-medium">{protocol.estimatedCost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Complexity</span>
                      <span className={`font-mono text-xs border px-2 py-0.5 rounded-full ${difficultyColor[protocol.difficulty]}`}>{protocol.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Approach</span>
                      <span className="text-xs text-muted text-right max-w-[140px]">{protocol.approach.split('—')[0].trim()}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Measured results stats */}
              {protocol.resultsStats && (
                <AnimatedSection delay={0.12}>
                  <div className="bg-surface border border-border rounded-2xl p-5">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Measured Results</h3>
                    <div className="space-y-3">
                      {protocol.resultsStats.map(stat => (
                        <div key={stat.label} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-muted">{stat.label}</span>
                          <span className="font-mono text-sm text-ink font-medium text-right">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Related reading */}
              {protocol.id === 'bryan-johnson' && (
                <AnimatedSection delay={0.15}>
                  <div className="bg-surface border border-border rounded-2xl p-5">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Related Reading</h3>
                    <div className="space-y-3">
                      <Link href="/protocols/bryan-johnson-biological-age-explained"
                        className="flex items-start justify-between gap-2 group cursor-pointer">
                        <span className="text-sm text-ink group-hover:text-green transition-colors leading-snug">His biological age results, explained (DunedinPACE, TruAge)</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green transition-colors shrink-0 mt-0.5" />
                      </Link>
                      <Link href="/supplements/lithium-orotate-ndga-2026"
                        className="flex items-start justify-between gap-2 group cursor-pointer">
                        <span className="text-sm text-ink group-hover:text-green transition-colors leading-snug">Lithium Orotate &amp; NDGA: the 2026 additions, reviewed</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green transition-colors shrink-0 mt-0.5" />
                      </Link>
                      <Link href="/protocols/dont-die-movement-explained"
                        className="flex items-start justify-between gap-2 group cursor-pointer">
                        <span className="text-sm text-ink group-hover:text-green transition-colors leading-snug">The &quot;Don&apos;t Die&quot; movement, explained</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green transition-colors shrink-0 mt-0.5" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Other protocols */}
              <AnimatedSection delay={0.2}>
                <div className="bg-surface border border-border rounded-2xl p-5">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4">Other Protocols</h3>
                  <div className="space-y-3">
                    {otherProtocols.map(p => (
                      <Link key={p.id} href={`/protocols/${p.id}`}
                        className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-ink group-hover:text-green transition-colors">{p.expert}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-green transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* CTA */}
              <AnimatedSection delay={0.3}>
                <Link href="/quiz"
                  className="block w-full text-center px-5 py-3.5 bg-green text-white rounded-xl font-semibold text-sm hover:bg-green-bright transition-colors cursor-pointer">
                  Find Your Own Protocol →
                </Link>
                <p className="text-xs text-center text-muted mt-2">Free biological age quiz</p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
