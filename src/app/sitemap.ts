import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'
import { products } from '@/lib/products'
import { protocols } from '@/lib/protocols'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://longevitylab-five.vercel.app'
  const articles = getAllArticles()

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/database`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/protocols`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/best`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    ...['supplements', 'wearables', 'recovery', 'diagnostics', 'protocols'].map(cat => ({
      url: `${baseUrl}/category/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]

  const articlePages = articles.map(a => ({
    url: `${baseUrl}/${a.category}/${a.slug}`,
    lastModified: new Date(a.frontmatter.date),
    changeFrequency: 'monthly' as const,
    // Featured articles and those with products get higher priority
    priority: a.frontmatter.featured ? 0.85 : (a.frontmatter.products?.length ? 0.75 : 0.65),
  }))

  const protocolPages = protocols.map(p => ({
    url: `${baseUrl}/protocols/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const databasePages = products.map(p => ({
    url: `${baseUrl}/database/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...protocolPages, ...databasePages]
}
