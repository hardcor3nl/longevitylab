import { getCollection, type CollectionEntry } from "astro:content";
import readingTime from "reading-time";
import { getArticleFaqs } from "../legacy/lib/faqs";

export const CATEGORIES = ["supplements", "wearables", "recovery", "diagnostics", "protocols", "best"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_LABEL: Record<Category, string> = {
  supplements: "Supplements", wearables: "Wearables", recovery: "Recovery", diagnostics: "Diagnostics", protocols: "Protocols", best: "Best Picks",
};
export type Article = CollectionEntry<Category> & { category: Category; slug: string; minutes: number };

let cache: Article[] | undefined;
/** Every article, newest `published` first. `slug` is the frontmatter slug (the live URL), not the file id. */
export async function getAllArticles(): Promise<Article[]> {
  if (cache) return cache;
  const out: Article[] = [];
  for (const category of CATEGORIES) {
    for (const e of await getCollection(category)) {
      out.push({ ...e, category, slug: e.data.slug, minutes: Math.max(1, Math.round(readingTime(e.body ?? "").minutes)) } as Article);
    }
  }
  return (cache = out.filter((a) => !a.data.noindex).sort((a, b) => b.data.published.localeCompare(a.data.published)));
}
export const articleFaqs = (a: Article) => (a.data.faqs.length ? a.data.faqs : getArticleFaqs(a.slug));
export const articleUrl = (a: { category: string; slug: string }) => `/${a.category}/${a.slug}`;
export const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
