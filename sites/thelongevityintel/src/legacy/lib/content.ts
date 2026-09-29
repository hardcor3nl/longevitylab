import matter from "gray-matter";
import readingTime from "reading-time";
import type { Article, ArticleFrontmatter } from "./types";

const files = import.meta.glob("/src/content/*/*.{md,mdx}", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

/** Accessor used by the ported pages: reads the exported MDX collections. `date` is the real `published` date. */
const all: Article[] = Object.entries(files)
  .map(([path, raw]) => {
    const [, category, file] = /\/src\/content\/([^/]+)\/([^/]+)\.mdx?$/.exec(path)!;
    const { data, content } = matter(raw);
    const fm = { ...data, date: String(data.published), modified: data.updated ? String(data.updated) : undefined, readTime: readingTime(content).text } as unknown as ArticleFrontmatter;
    return { slug: file, category, frontmatter: fm, content } as Article;
  })
  .filter((a) => !(a.frontmatter as any).noindex)
  .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

export const getAllArticles = (): Article[] => all;
export const getArticleBySlug = (category: string, slug: string) => all.find((a) => a.category === category && a.slug === slug) ?? null;
export const getArticlesByCategory = (category: string) => all.filter((a) => a.category === category);
export const getFeaturedArticles = () => all.filter((a) => a.frontmatter.featured);
export const getArticlesByAuthor = (_name: string) => all;
