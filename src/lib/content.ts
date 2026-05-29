import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { Article, ArticleFrontmatter } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export function getAllArticles(): Article[] {
  const articles: Article[] = []
  if (!fs.existsSync(CONTENT_DIR)) return articles

  const categories = fs.readdirSync(CONTENT_DIR)
  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category)
    if (!fs.statSync(categoryDir).isDirectory()) continue
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))
    for (const file of files) {
      const slug = file.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(categoryDir, file), 'utf-8')
      const { data, content } = matter(raw)
      const rt = readingTime(content)
      articles.push({
        slug,
        category,
        frontmatter: { ...data, readTime: rt.text } as ArticleFrontmatter,
        content,
      })
    }
  }
  return articles.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export function getArticleBySlug(category: string, slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)
  return { slug, category, frontmatter: { ...data, readTime: rt.text } as ArticleFrontmatter, content }
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter(a => a.category === category)
}

export function getFeaturedArticles(): Article[] {
  return getAllArticles().filter(a => a.frontmatter.featured)
}
