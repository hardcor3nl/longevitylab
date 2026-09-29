import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { type Check, type Page, type SiteConfig, check, isRealPage } from "./dist.ts";
import { parseRedirectsFile } from "../util.ts";

export interface SitemapUrl { loc: string; lastmod?: string; images: string[] }

export function parseUrlset(xml: string): SitemapUrl[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: m[1].match(/<loc>([^<]*)<\/loc>/)![1].replace(/&amp;/g, "&"),
    lastmod: m[1].match(/<lastmod>([^<]*)<\/lastmod>/)?.[1],
    images: [...m[1].matchAll(/<image:loc>([^<]*)<\/image:loc>/g)].map((x) => x[1]),
  }));
}
export const parseIndex = (xml: string) => [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);

/** Read the sitemap index and every child urlset from a dist. */
export function readSitemaps(dist: string, origin: string): { urls: SitemapUrl[]; files: string[]; problems: string[] } {
  const problems: string[] = [];
  const idxPath = join(dist, "sitemap-index.xml");
  if (!existsSync(idxPath)) return { urls: [], files: [], problems: ["sitemap-index.xml missing"] };
  const files = parseIndex(readFileSync(idxPath, "utf8"));
  const urls: SitemapUrl[] = [];
  for (const f of files) {
    if (!f.startsWith(origin)) problems.push(`child sitemap not on origin: ${f}`);
    const p = join(dist, new URL(f).pathname);
    if (!existsSync(p)) { problems.push(`child sitemap missing from dist: ${f}`); continue; }
    urls.push(...parseUrlset(readFileSync(p, "utf8")));
  }
  return { urls, files, problems };
}

export function checkSitemaps(dist: string, cfg: SiteConfig, pages: Page[], redirectsFile: string): Check {
  const { urls, files, problems } = readSitemaps(dist, cfg.origin);
  const issues = [...problems];
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  const redirects = parseRedirectsFile(redirectsFile);
  const inMap = new Set<string>();
  for (const u of urls) {
    const path = new URL(u.loc).pathname;
    inMap.add(path);
    if (!u.loc.startsWith(cfg.origin)) issues.push(`off-origin url ${u.loc}`);
    const p = byUrl.get(path);
    if (!p) issues.push(`in sitemap but not built: ${path}`);
    else {
      if (p.noindex) issues.push(`in sitemap but noindex: ${path}`);
      if (p.canonical[0] && p.canonical[0] !== u.loc) issues.push(`sitemap url differs from canonical: ${u.loc} vs ${p.canonical[0]}`);
    }
    if (redirects.has(path)) issues.push(`in sitemap but redirected: ${path}`);
    if (u.lastmod && new Date(u.lastmod).getTime() > Date.now() + 864e5) issues.push(`future lastmod ${u.lastmod} on ${path}`);
    if (u.lastmod && /T\d\d:\d\d:\d\d/.test(u.lastmod)) issues.push(`lastmod carries a time component (looks like build time): ${path}`);
  }
  const dupes = urls.length - new Set(urls.map((u) => u.loc)).size;
  if (dupes) issues.push(`${dupes} duplicate sitemap urls`);
  for (const p of pages.filter(isRealPage)) if (!p.noindex && !inMap.has(p.url)) issues.push(`indexable page missing from sitemap: ${p.url}`);
  const dated = urls.filter((u) => u.lastmod);
  const distinct = new Set(dated.map((u) => u.lastmod)).size;
  if (dated.length > 10 && distinct === 1) issues.push("every lastmod is identical: looks fake");
  const img = urls.filter((u) => u.images.length).length;
  return check("sitemaps", "Sitemaps", issues, `${files.length} child sitemaps, ${urls.length} urls, ${dated.length} with real lastmod, ${img} with image entries`);
}
