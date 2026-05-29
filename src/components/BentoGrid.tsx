'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'
import { Clock, ArrowUpRight } from 'lucide-react'

function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  const { frontmatter, slug, category } = article
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-green/40 transition-colors ${large ? 'row-span-2' : ''}`}
    >
      <div className={`relative overflow-hidden ${large ? 'h-64' : 'h-40'}`}>
        <Image
          src={frontmatter.image}
          alt={frontmatter.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {frontmatter.score && (
          <div className="absolute top-3 right-3 bg-green text-white font-mono text-xs font-medium px-2 py-1 rounded-full">
            {frontmatter.score}/100
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="font-mono text-xs uppercase tracking-wider bg-cream/90 dark:bg-[#0a0f0b]/90 text-ink px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h2 className={`font-display text-ink group-hover:text-green transition-colors leading-tight ${large ? 'text-2xl' : 'text-lg'}`}>
          {frontmatter.title}
        </h2>
        <p className="mt-2 text-muted text-sm line-clamp-2">{frontmatter.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {frontmatter.readTime}
          </div>
          <Link href={`/${category}/${slug}`} className="flex items-center gap-1 hover:text-green transition-colors cursor-pointer">
            Read <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

export function BentoGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl text-ink">Latest Reviews</h2>
        <Link href="/category/supplements" className="text-sm text-green hover:text-green-bright font-medium cursor-pointer">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <ArticleCard key={article.slug} article={article} large={i === 0} />
        ))}
      </div>
    </div>
  )
}
