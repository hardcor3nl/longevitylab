import { escapeXml } from "./sitemap.ts";

/**
 * RSS 2.0 and Atom 1.0 builders, plus llms.txt. Feeds help discovery (feed readers, aggregators, Bing); Google
 * accepts RSS/Atom as sitemap formats (developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
 * llms.txt (llmstxt.org) is a convention for AI crawlers; Google does not use it for ranking. It is cheap, so it is generated from content.
 */
export interface FeedItem { title: string; link: string; description: string; published: string; updated?: string; category?: string }
export interface FeedMeta { title: string; link: string; description: string; feedUrl: string; author: string; language?: string }

const rfc822 = (iso: string) => new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toUTCString();
const atomDate = (iso: string) => (iso.length === 10 ? `${iso}T00:00:00Z` : iso);
const newest = (items: FeedItem[]) =>
  [...items].sort((a, b) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published) || a.link.localeCompare(b.link));

export function rssFeed(m: FeedMeta, items: FeedItem[], limit = 50): string {
  const list = newest(items).slice(0, limit);
  const last = list[0] ? rfc822(list[0].updated ?? list[0].published) : undefined;
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(m.title)}</title>
<link>${escapeXml(m.link)}</link>
<description>${escapeXml(m.description)}</description>
<language>${m.language ?? "en"}</language>
${last ? `<lastBuildDate>${last}</lastBuildDate>\n` : ""}<atom:link href="${escapeXml(m.feedUrl)}" rel="self" type="application/rss+xml" />
${list.map((i) => `<item><title>${escapeXml(i.title)}</title><link>${escapeXml(i.link)}</link><guid isPermaLink="true">${escapeXml(i.link)}</guid><pubDate>${rfc822(i.published)}</pubDate><description>${escapeXml(i.description)}</description>${i.category ? `<category>${escapeXml(i.category)}</category>` : ""}</item>`).join("\n")}
</channel>
</rss>
`;
}

export function atomFeed(m: FeedMeta, items: FeedItem[], limit = 50): string {
  const list = newest(items).slice(0, limit);
  const updated = list[0] ? atomDate(list[0].updated ?? list[0].published) : undefined;
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>${escapeXml(m.title)}</title>
<subtitle>${escapeXml(m.description)}</subtitle>
<link href="${escapeXml(m.link)}" />
<link rel="self" type="application/atom+xml" href="${escapeXml(m.feedUrl)}" />
<id>${escapeXml(m.link)}</id>
${updated ? `<updated>${updated}</updated>\n` : ""}<author><name>${escapeXml(m.author)}</name></author>
${list.map((i) => `<entry><title>${escapeXml(i.title)}</title><link href="${escapeXml(i.link)}" /><id>${escapeXml(i.link)}</id><published>${atomDate(i.published)}</published><updated>${atomDate(i.updated ?? i.published)}</updated><summary>${escapeXml(i.description)}</summary></entry>`).join("\n")}
</feed>
`;
}

export interface LlmsSection { title: string; items: { title: string; url: string; description?: string }[] }
export function llmsTxt(o: { name: string; summary: string; details?: string; sections: LlmsSection[] }): string {
  const one = (s: string) => s.replace(/\s+/g, " ").trim();
  const out = [`# ${o.name}`, "", `> ${one(o.summary)}`, ""];
  if (o.details) out.push(o.details.trim(), "");
  for (const s of o.sections.filter((x) => x.items.length)) {
    out.push(`## ${s.title}`, "");
    for (const i of s.items) out.push(`- [${one(i.title)}](${i.url})${i.description ? `: ${one(i.description)}` : ""}`);
    out.push("");
  }
  return out.join("\n");
}
