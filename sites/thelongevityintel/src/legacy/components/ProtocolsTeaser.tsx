import Link from 'next/link'
import Image from 'next/image'
import { protocols } from '@/lib/protocols'
import { AnimatedSection } from './AnimatedSection'
import { ArrowRight } from 'lucide-react'

export function ProtocolsTeaser() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <div className="section-rule" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">Expert Protocols</p>
            <h2 className="font-display text-4xl text-ink leading-tight">Learn From the Best</h2>
            <p className="text-muted mt-2.5 max-w-lg leading-relaxed">The complete supplement stacks and protocols from leading longevity researchers, analysed and explained.</p>
          </div>
          <Link href="/protocols" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer group shrink-0">
            All protocols <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {protocols.map((p, i) => (
            <AnimatedSection key={p.id} delay={i * 0.08}>
              <Link href={`/protocols/${p.id}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer bg-surface-2">
                <Image src={p.expertImage} alt={`Portrait of ${p.expert}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-display text-white text-lg leading-tight">{p.expert}</p>
                  <p className="text-white/50 text-xs font-mono mt-1 line-clamp-1">{p.approach.split('—')[0].trim()}</p>
                  <div className="flex items-center gap-1 mt-3 text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                    View protocol <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
