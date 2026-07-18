'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { Clock, ArrowUpRight } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
}

export function BentoGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="section-rule" />
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-green-bright mb-2">Latest</p>
          <h2 className="font-display text-4xl text-ink leading-tight">Recent Reviews</h2>
        </div>
        <Link href="/best"
          className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer group">
          Best lists
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="space-y-5"
      >
        {/* Row 1 — full width hero */}
        {articles[0] && (
          <motion.div variants={item}>
            <Link href={`/${articles[0].category}/${articles[0].slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden border border-border hover:border-green/30 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer bg-surface">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-80 overflow-hidden bg-surface-2">
                    <Image src={articles[0].frontmatter.image} alt={articles[0].frontmatter.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="50vw" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface/80 dark:md:to-[#141a15]/80" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest bg-ink/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">{articles[0].category}</span>
                      {articles[0].frontmatter.featured && <span className="font-mono text-[10px] uppercase tracking-widest bg-amber/90 text-white px-2.5 py-1 rounded-full">Featured</span>}
                    </div>
                  </div>
                  <div className="p-7 flex flex-col justify-center">
                    {articles[0].frontmatter.score && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-1 w-16 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-green-bright rounded-full" style={{ width: `${articles[0].frontmatter.score}%` }} />
                        </div>
                        <span className="font-mono text-xs text-green-bright">{articles[0].frontmatter.score}/100</span>
                      </div>
                    )}
                    <h2 className="font-display text-3xl text-ink group-hover:text-green transition-colors leading-tight mb-3">{articles[0].frontmatter.title}</h2>
                    <p className="text-muted leading-relaxed mb-4 line-clamp-3">{articles[0].frontmatter.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-3">
                        <span className="font-mono">{articles[0].frontmatter.author}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{articles[0].frontmatter.readTime}</span>
                      </div>
                      <span className="flex items-center gap-1 text-green-bright font-semibold">Read article <ArrowUpRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Row 2 — 2 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {articles.slice(1, 3).map((article) => (
            <motion.article key={article.slug} variants={item}
              className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer flex flex-col">
              <Link href={`/${article.category}/${article.slug}`} className="block flex-1 flex flex-col">
                <div className="relative h-48 overflow-hidden bg-surface-2 shrink-0">
                  <Image src={article.frontmatter.image} alt={article.frontmatter.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  {article.frontmatter.score && (
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm border border-border text-ink font-mono text-xs font-medium px-2 py-1 rounded-full">{article.frontmatter.score}/100</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-ink/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">{article.category}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="font-display text-xl text-ink group-hover:text-green transition-colors leading-tight mb-2">{article.frontmatter.title}</h2>
                  <p className="text-muted text-sm line-clamp-2 flex-1 mb-3">{article.frontmatter.description}</p>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{article.frontmatter.readTime}</span>
                    <span className="flex items-center gap-1.5 text-green-bright font-semibold">Read article <ArrowUpRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Row 3 — 3 column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.slice(3, 6).map((article) => (
            <motion.article key={article.slug} variants={item}
              className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer flex flex-col">
              <Link href={`/${article.category}/${article.slug}`} className="block flex-1 flex flex-col">
                <div className="relative h-40 overflow-hidden bg-surface-2 shrink-0">
                  <Image src={article.frontmatter.image} alt={article.frontmatter.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div className="absolute top-2 left-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-ink/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">{article.category}</span>
                  </div>
                  {article.frontmatter.score && (
                    <div className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm border border-border font-mono text-[10px] px-2 py-0.5 rounded-full">{article.frontmatter.score}/100</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-display text-lg text-ink group-hover:text-green transition-colors leading-tight mb-1.5">{article.frontmatter.title}</h2>
                  <p className="text-muted text-xs line-clamp-2 flex-1 mb-3">{article.frontmatter.description}</p>
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.frontmatter.readTime}</span>
                    <span className="flex items-center gap-1 text-green-bright font-semibold text-[11px]">Read <ArrowUpRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
