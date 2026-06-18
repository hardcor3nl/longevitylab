import { protocols } from '@/lib/protocols'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ArrowUpRight, FlaskConical, DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Expert Longevity Protocols',
  description: "The complete supplement stacks and lifestyle protocols from the world's leading longevity experts — Peter Attia, Andrew Huberman, Bryan Johnson, and David Sinclair.",
}

const difficultyColor = {
  Beginner: 'bg-green/10 text-green-bright border-green/25',
  Intermediate: 'bg-amber/10 text-amber border-amber/25',
  Advanced: 'bg-red-500/10 text-red-400 border-red-500/25',
}

export default function ProtocolsPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-14">
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-3">Expert Protocols</p>
          <h1 className="font-display text-5xl text-ink mb-4">Longevity Protocols</h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            The complete supplement stacks, dietary approaches, and lifestyle practices from the world&apos;s most prominent longevity researchers and practitioners — analysed and explained.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {protocols.map((protocol, i) => (
            <AnimatedSection key={protocol.id} delay={i * 0.1}>
              <Link href={`/protocols/${protocol.id}`}
                className="group block bg-surface border border-border rounded-3xl overflow-hidden hover:border-green/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer h-full">
                {/* Hero image */}
                <div className="relative h-52 overflow-hidden">
                  <Image src={protocol.image} alt="" aria-hidden fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                  <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3.5">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-white/20 shadow-lg">
                      <Image src={protocol.expertImage} alt={`Portrait of ${protocol.expert}`} fill sizes="64px" className="object-cover object-top" />
                    </div>
                    <div className="min-w-0 pb-0.5">
                      <h2 className="font-display text-2xl text-white leading-tight mb-0.5">{protocol.expert}</h2>
                      <p className="text-white/60 text-xs font-mono line-clamp-1">{protocol.role}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`font-mono text-[10px] uppercase tracking-wider border px-2.5 py-1 rounded-full backdrop-blur-sm ${difficultyColor[protocol.difficulty]}`}>
                      {protocol.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-muted text-sm line-clamp-2 mb-4 leading-relaxed">{protocol.description}</p>

                  <div className="flex items-center gap-5 text-xs text-muted mb-4">
                    <span className="flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5" />
                      {protocol.totalSupplements} supplements
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {protocol.estimatedCost}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted font-mono">Updated {protocol.lastUpdated}</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-bright group-hover:gap-2 transition-all">
                      View protocol <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  )
}
