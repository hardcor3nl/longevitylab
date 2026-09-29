import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/** Shared reader for a built dist: every HTML page parsed into the facts the SEO checks need. */
export interface SiteConfig {
  name: string; origin: string; trailingSlash: "always" | "never";
  editorialName?: string; indexNowKey?: string; collectionRoutes?: Record<string, string>; staticRoutes?: string[];
  [k: string]: unknown;
}
export interface Page {
  /** URL path, e.g. /guides/x/ */
  url: string; file: string; html: string;
  title: string; description: string; canonical: string[]; robots: string;
  noindex: boolean; h1: string[];
  links: string[]; mainLinks: string[]; jsonLd: any[]; jsonLdErrors: string[];
}
export interface Check { id: string; name: string; status: "pass" | "warn" | "fail"; summary: string; issues: string[] }

export function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : []; });
}
const dec = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag: string, name: string) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? dec(m[1] ?? m[2]) : undefined;
};

const hrefs = (h: string) => [...h.matchAll(/<a\s[^>]*href=("[^"]*"|'[^']*')/gi)].map((m) => dec(m[1].slice(1, -1)));

export function parsePage(url: string, file: string, html: string): Page {
  const head = html.split(/<\/head>/i)[0] ?? html;
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const metaContent = (name: string) => {
    const t = metas.find((x) => attr(x, "name")?.toLowerCase() === name);
    return t ? attr(t, "content") ?? "" : "";
  };
  const canonical = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0])
    .filter((t) => attr(t, "rel")?.toLowerCase() === "canonical").map((t) => attr(t, "href") ?? "");
  const robots = metaContent("robots");
  const jsonLd: any[] = [], jsonLdErrors: string[] = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { jsonLd.push(JSON.parse(m[1])); } catch (e) { jsonLdErrors.push((e as Error).message); }
  }
  const body = html.slice(head.length);
  return {
    url, file, html,
    title: dec((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim()),
    description: metaContent("description"), canonical, robots, noindex: /noindex/i.test(robots),
    h1: [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => dec(m[1].replace(/<[^>]+>/g, "").trim())),
    links: hrefs(body), mainLinks: hrefs(body.match(/<main[\s\S]*<\/main>/i)?.[0] ?? body),
    jsonLd, jsonLdErrors,
  };
}

export function loadDist(dist: string): Page[] {
  const root = resolve(dist);
  return htmlFiles(root).map((f) => {
    const rel = f.slice(root.length).replace(/\\/g, "/");
    // directory format (/x/index.html) and Astro `build.format: "file"` (/x.html, served at /x) both map to their URL path
    const url = rel.replace(/index\.html$/, "");
    return parsePage(url.endsWith(".html") && url !== "/404.html" ? url.slice(0, -5) : url, f, readFileSync(f, "utf8"));
  });
}

export function loadSiteConfig(siteDir: string): SiteConfig {
  return JSON.parse(readFileSync(join(siteDir, "site.config.json"), "utf8"));
}
export const readIfExists = (p: string) => (existsSync(p) ? readFileSync(p, "utf8") : undefined);

/** Real routes = built pages that are not the 404 page. */
export const isRealPage = (p: Page) => p.url !== "/404.html" && p.url !== "/404/";

export const check = (id: string, name: string, issues: string[], summary: string, warnOnly = false): Check =>
  ({ id, name, status: issues.length === 0 ? "pass" : warnOnly ? "warn" : "fail", summary, issues });

/** Hub pages and the URL prefix of the items each one must list. `hubPages` (page -> item prefix) overrides the default of collection bases and hubRoutes, for sites whose hubs live at a different URL than their items. */
export function hubPairs(cfg: SiteConfig): { page: string; prefix: string }[] {
  const withSlash = (h: string) => (h.endsWith("/") ? h : h + "/");
  const hubPages = cfg.hubPages as Record<string, string> | undefined;
  if (hubPages) return Object.entries(hubPages).map(([page, prefix]) => ({ page, prefix: withSlash(prefix) }));
  return [...new Set([...Object.values(cfg.collectionRoutes ?? {}), ...((cfg.hubRoutes as string[]) ?? [])])].map((h) => ({ page: h, prefix: withSlash(h) }));
}
