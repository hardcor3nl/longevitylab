/**
 * Sitemap builders (sitemaps.org protocol + Google image extension).
 * Google: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 *         https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 * Rules encoded here:
 *  - <lastmod> is emitted only when a real date is supplied; never defaulted to build time. Google ignores
 *    lastmod values that are not consistently accurate, so omitting is better than guessing.
 *  - Entries flagged noindex are dropped (a sitemap lists canonical, indexable URLs only).
 *  - Each urlset stays far below the 50,000 URL / 50 MB limits; `chunk` splits if a site ever exceeds it.
 *  - <priority> and <changefreq> are not emitted: Google ignores both.
 */
export interface SitemapImage { loc: string; title?: string }
export interface SitemapEntry {
  loc: string;
  /** ISO date or datetime from the content's real `updated` / `published`. */
  lastmod?: string;
  noindex?: boolean;
  images?: (string | SitemapImage)[];
}

export const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const ISO = /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2}))?$/;
/** W3C datetime: keep date-only as is, otherwise pass through; returns undefined for junk. */
export function normalizeLastmod(v?: string | Date): string | undefined {
  if (!v) return undefined;
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : v;
  return ISO.test(s) ? s : undefined;
}

/** Latest of several dates (for hub pages: lastmod = newest item). */
export const latestDate = (dates: (string | undefined)[]) =>
  dates.map((d) => normalizeLastmod(d)).filter(Boolean).sort().at(-1) as string | undefined;

/** Embed pages (/embed/<widget>/) are noindex and never belong in a sitemap. */
export const isEmbedUrl = (loc: string) => /^https?:\/\/[^/]+\/embed(\/|$)/.test(loc) || loc.startsWith("/embed/");

export function urlset(entries: SitemapEntry[]): string {
  const seen = new Set<string>();
  const rows = entries
    .filter((e) => !e.noindex && !isEmbedUrl(e.loc))
    .filter((e) => (seen.has(e.loc) ? false : (seen.add(e.loc), true)))
    .map((e) => {
      const lm = normalizeLastmod(e.lastmod);
      const imgs = (e.images ?? []).map((i) => (typeof i === "string" ? { loc: i } : i))
        .map((i) => `<image:image><image:loc>${escapeXml(i.loc)}</image:loc>${i.title ? `<image:title>${escapeXml(i.title)}</image:title>` : ""}</image:image>`).join("");
      return `<url><loc>${escapeXml(e.loc)}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ""}${imgs}</url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/image/1.1">\n${rows.join("\n")}\n</urlset>\n`;
}

export function sitemapIndex(maps: { loc: string; lastmod?: string }[]): string {
  const rows = maps.map((m) => {
    const lm = normalizeLastmod(m.lastmod);
    return `<sitemap><loc>${escapeXml(m.loc)}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ""}</sitemap>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</sitemapindex>\n`;
}

export const chunk = <T>(a: T[], n = 45000): T[][] => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, (i + 1) * n));

export interface SitemapGroup { name: string; entries: SitemapEntry[] }
/**
 * Build the index plus one urlset per group. Files: `/sitemap-index.xml`, `/sitemap-<name>.xml`
 * (or `-<name>-2.xml` when a group is chunked). Groups with no indexable entries are skipped.
 */
export function buildSitemaps(origin: string, groups: SitemapGroup[]): Map<string, string> {
  const out = new Map<string, string>();
  const idx: { loc: string; lastmod?: string }[] = [];
  for (const g of groups) {
    const live = g.entries.filter((e) => !e.noindex && !isEmbedUrl(e.loc));
    chunk(live).forEach((part, i) => {
      const file = `sitemap-${g.name}${i ? `-${i + 1}` : ""}.xml`;
      out.set(file, urlset(part));
      idx.push({ loc: new URL(`/${file}`, origin).toString(), lastmod: latestDate(part.map((p) => p.lastmod)) });
    });
  }
  out.set("sitemap-index.xml", sitemapIndex(idx));
  return out;
}
