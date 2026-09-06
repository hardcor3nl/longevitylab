import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'
import { supplements } from '@/lib/supplements'
import { protocols } from '@/lib/protocols'
import { authors } from '@/lib/authors'
import { comparisons } from '@/lib/comparisons'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url
  const articles = getAllArticles()
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/get-started`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/database`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/protocols`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/quiz`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/best`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/compare`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/glossary`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/authors`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Category hubs
  const categories = ['supplements', 'wearables', 'recovery', 'diagnostics', 'protocols', 'best']
  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/category/${cat}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Topic / lifestyle hubs (high-intent SEO landers)
  const topicHubs = [
    'sleep',
    'cardio',
    'nutrition',
    'stress-resilience',
    'exotic-methods',
  ]
  const topicPages: MetadataRoute.Sitemap = topicHubs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Compare pages (from central registry)
  const comparePages: MetadataRoute.Sitemap = comparisons.map(c => ({
    url: `${baseUrl}/compare/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: c.featured ? 0.8 : 0.75,
  }))

  // Author profile pages (E-E-A-T)
  const authorPages: MetadataRoute.Sitemap = authors.map(a => ({
    url: `${baseUrl}/authors/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/${a.category}/${a.slug}`,
    lastModified: new Date(a.frontmatter.modified ?? a.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: a.frontmatter.featured
      ? 0.85
      : a.frontmatter.products?.length
        ? 0.75
        : 0.65,
  }))

  const protocolPages: MetadataRoute.Sitemap = protocols.map(p => ({
    url: `${baseUrl}/protocols/${p.id}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const databasePages: MetadataRoute.Sitemap = supplements.map(s => ({
    url: `${baseUrl}/database/${s.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...topicPages,
    ...comparePages,
    ...authorPages,
    ...articlePages,
    ...protocolPages,
    ...databasePages,
  ]
}
