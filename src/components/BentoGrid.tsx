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

function ArticleCard({ article, size = 'sm' }: { article: Article; size?: 'lg' | 'md' | 'sm' }) {
  const { frontmatter, slug, category } = article
  const imgH = size === 'lg' ? 'h-72' : size === 'md' ? 'h-52' : 'h-44'

  return (
    <motion.article variants={item}
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 cursor-pointer flex flex-col">
      <Link href={`/${category}/${slug}`} className="block flex-1 flex flex-col">
        <div className={`relative ${imgH} overflow-hidden bg-surface-2 shrink-0`}>
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {/* Score badge */}
          {frontmatter.score && (
            <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm border border-border text-ink font-mono text-xs font-medium px-2 py-1 rounded-full">
              {frontmatter.score}/100
            </div>
          )}
          {/* Category chip */}
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[10px] uppercase tracking-widest bg-ink/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h2 className={`font-display text-ink group-hover:text-green transition-colors leading-tight ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}`}>
            {frontmatter.title}
          </h2>
          <p className="mt-2 text-muted text-sm line-clamp-2 flex-1">{frontmatter.description}</p>
          <p className="mt-2 text-xs text-muted font-mono">{frontmatter.author}</p>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Clock className="w-3 h-3" />
              {frontmatter.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-bright group-hover:gap-2.5 transition-all duration-200">
              Read article <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export function BentoGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null
  const [a, b, , ...rest] = articles

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-green-bright mb-2">Latest</p>
          <h2 className="font-display text-4xl text-ink">Recent Reviews</h2>
        </div>
        <Link href="/category/supplements"
          className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink transition-colors cursor-pointer group">
          View all
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {/* Large featured */}
        {a && (
          <div className="lg:col-span-2 lg:row-span-1">
            <ArticleCard article={a} size="lg" />
          </div>
        )}
        {/* Medium */}
        {b && <ArticleCard article={b} size="md" />}
        {/* Small row */}
        {rest.slice(0, 3).map(art => (
          <ArticleCard key={art.slug} article={art} size="sm" />
        ))}
      </motion.div>
    </div>
  )
}
