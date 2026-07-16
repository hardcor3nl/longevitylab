import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/content'
import { products } from '@/lib/products'
import { protocols } from '@/lib/protocols'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url
  const articles = getAllArticles()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/get-started`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/database`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/protocols`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/best`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/authors`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Category hubs
  const categories = ['supplements', 'wearables', 'recovery', 'diagnostics', 'protocols', 'best']
  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: now,
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
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Compare pages
  const compareSlugs = [
    'cardio-modalities',
    'cold-plunge-vs-ice-bath',
    'creatine-vs-hmb',
    'magnesium-forms',
    'meditation-apps',
    'nmn-vs-nr',
    'sauna-types',
    'whoop-vs-oura',
  ]
  const comparePages: MetadataRoute.Sitemap = compareSlugs.map(slug => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const articlePages: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${baseUrl}/${a.category}/${a.slug}`,
    lastModified: new Date(a.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: a.frontmatter.featured
      ? 0.85
      : a.frontmatter.products?.length
        ? 0.75
        : 0.65,
  }))

  const protocolPages: MetadataRoute.Sitemap = protocols.map(p => ({
    url: `${baseUrl}/protocols/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const databasePages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${baseUrl}/database/${p.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...topicPages,
    ...comparePages,
    ...articlePages,
    ...protocolPages,
    ...databasePages,
  ]
}
