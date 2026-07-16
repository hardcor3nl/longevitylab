export type Category =
  | 'supplements'
  | 'wearables'
  | 'recovery'
  | 'diagnostics'
  | 'protocols'
  | 'best'

export interface ArticleFrontmatter {
  title: string
  description: string
  category: Category
  date: string
  author: string
  readTime?: string
  image: string
  featured?: boolean
  verdict?: string
  score?: number
  products?: Product[]
  affiliateLinks?: AffiliateLink[]
  tags?: string[]
}

export interface Product {
  name: string
  brand: string
  rating: number // 0–100
  price: string
  badge?: 'Best Pick' | 'Runner-Up' | 'Budget'
  pros: string[]
  cons: string[]
  affiliateUrl: string
  image?: string
}

export interface AffiliateLink {
  product: string
  url: string
  commission?: string
}

export interface Article {
  slug: string
  category: string
  frontmatter: ArticleFrontmatter
  content: string
}
