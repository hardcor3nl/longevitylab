import { getAllArticles } from '@/lib/content'
import { NextResponse } from 'next/server'

export const revalidate = 86400

export function GET() {
  const articles = getAllArticles()
  const index = articles.map(a => ({
    slug: a.slug,
    category: a.category,
    title: a.frontmatter.title,
    description: a.frontmatter.description,
  }))
  return NextResponse.json(index)
}
