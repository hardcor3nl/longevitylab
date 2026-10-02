import { latestDate, relatedEntries, type SitemapGroup, type RelatedCandidate, type FeedItem, type FeedMeta } from "@portfolio/core";
import { getAllArticles, articleUrl, CATEGORIES, type Article } from "./content";
import { ogUrl } from "./og";
import { cpdModified } from "./cpd";
import site from "../../site.config.json";

/** Absolute, slashless URL. */
export const abs = (p: string) => (p === "/" ? new URL(site.origin + "/").toString() : new URL(p, site.origin).toString());
/** Real content date: `updated` when present, else `published` (published is the first git commit that added the file). Never build time. */
export const entryDate = (d: { updated?: string; published: string }) => (d.updated ?? d.published).slice(0, 10);

export async function sitemapGroups(): Promise<SitemapGroup[]> {
  const all = await getAllArticles();
  const byCat = (c: string) => all.filter((a) => a.category === c);
  const dateOf = (c?: string) => latestDate((c ? byCat(c) : all).map((a) => entryDate(a.data)));
  const hubLastmod: Record<string, string | undefined> = {
    "/": dateOf(), "/best": dateOf("best"), "/protocols": dateOf("protocols"),
    "/category/supplements": dateOf("supplements"), "/category/wearables": dateOf("wearables"), "/category/recovery": dateOf("recovery"),
    "/category/diagnostics": dateOf("diagnostics"), "/category/protocols": dateOf("protocols"),
    "/database": dateOf("supplements"), "/cost-per-dose": cpdModified(), "/cost-per-dose-statistics": "2026-09-29",
  };
  return [
    { name: "pages", entries: site.staticRoutes.map((r) => ({ loc: abs(r), lastmod: hubLastmod[r] })) },
    ...CATEGORIES.map((c) => ({
      name: c,
      entries: byCat(c).map((a) => ({ loc: abs(articleUrl(a)), lastmod: entryDate(a.data), images: [ogUrl(`${a.category}/${a.slug}`)] })),
    })),
  ];
}

export const orgInfo = { name: site.editorialName, url: site.origin + "/", logo: (site as any).logo as string | undefined, sameAs: ((site as any).sameAs ?? []) as string[] };

/** Related links for an article: same cluster (category) first, then shared tags. */
export async function relatedFor(a: Article) {
  const cand = (x: Article): RelatedCandidate => ({ href: articleUrl(x), title: x.data.h1 ?? x.data.title, description: x.data.description, date: entryDate(x.data), text: x.data.targetQuery, cluster: x.category, tags: x.data.tags });
  const all = (await getAllArticles()).map(cand);
  const cur = all.find((c) => c.href === articleUrl(a))!;
  return relatedEntries(cur, all, { limit: 3, min: 3, minInbound: 3, maxExtra: 2 }).map(({ href, title, description }) => ({ href, title, description }));
}

export const feedMeta: FeedMeta = { title: `${site.name}: new and updated pages`, link: abs("/"), description: "Evidence summaries on supplements, wearables, recovery devices, diagnostics and protocols.", feedUrl: abs("/feed.xml"), author: site.editorialName };
export async function feedItems(): Promise<FeedItem[]> {
  return (await getAllArticles()).map((a) => ({ title: a.data.h1 ?? a.data.title, link: abs(articleUrl(a)), description: a.data.description, published: a.data.published, updated: a.data.updated, category: a.category }));
}
