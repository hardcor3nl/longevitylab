import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'content')
const OUT = path.join(__dirname, '..', 'public', 'search-index.json')

const articles = []
if (fs.existsSync(CONTENT_DIR)) {
  for (const category of fs.readdirSync(CONTENT_DIR)) {
    const categoryDir = path.join(CONTENT_DIR, category)
    if (!fs.statSync(categoryDir).isDirectory()) continue
    for (const file of fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))) {
      const slug = file.replace('.mdx', '')
      const { data } = matter(fs.readFileSync(path.join(categoryDir, file), 'utf-8'))
      articles.push({
        slug,
        category,
        title: data.title ?? slug,
        description: data.description ?? '',
      })
    }
  }
}

// Stable sort for reproducible builds
articles.sort((a, b) => a.slug.localeCompare(b.slug))

fs.writeFileSync(OUT, JSON.stringify(articles))
console.log(`search-index.json: ${articles.length} articles`)
