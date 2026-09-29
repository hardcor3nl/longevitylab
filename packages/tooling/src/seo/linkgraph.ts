import { type Check, type Page, type SiteConfig, check, hubPairs, isRealPage } from "./dist.ts";

/**
 * Internal link graph on a built dist.
 * Google finds pages by following links and gives more weight to pages that are linked prominently
 * (https://developers.google.com/search/docs/crawling-indexing/links-crawlable). Rules:
 *  - orphan (no internal link from any other page) or unreachable from the home page: FAIL (breaks the build)
 *  - click depth from home > 3: WARN
 *  - fewer than 3 inbound links from other pages' main content (navigation and footer excluded): WARN
 *  - every collection item must be linked from its hub page: FAIL
 */
export interface GraphOptions { minInbound?: number; maxDepth?: number; utilityRoutes?: string[] }

/** Resolve an href found on `from` to a canonical internal path, or null for external/non-page links. */
export function normalizeHref(href: string, from: string, origin: string): string | null {
  if (/^(mailto:|tel:|javascript:|data:)/i.test(href) || href.startsWith("#")) return null;
  let u: URL;
  try { u = new URL(href, new URL(from, origin)); } catch { return null; }
  if (u.origin !== new URL(origin).origin) return null;
  const p = u.pathname;
  if (p.startsWith("/go/") || /\.[a-z0-9]{2,5}$/i.test(p.split("/").pop() ?? "")) return null; // affiliate redirects and file downloads
  return p;
}

export interface GraphReport {
  inbound: Map<string, Set<string>>; contextual: Map<string, Set<string>>; depth: Map<string, number>;
  orphans: string[]; unreachable: string[]; deep: string[]; thin: string[]; hubGaps: string[];
}

export function analyseGraph(pages: Page[], cfg: Pick<SiteConfig, "origin" | "collectionRoutes"> & { hubRoutes?: string[]; hubPages?: Record<string, string> }, opt: GraphOptions = {}): GraphReport {
  const minInbound = opt.minInbound ?? 3, maxDepth = opt.maxDepth ?? 3;
  const real = pages.filter(isRealPage);
  const indexable = real.filter((p) => !p.noindex);
  const known = new Set(real.map((p) => p.url));
  const out = new Map<string, Set<string>>();
  const inbound = new Map<string, Set<string>>(), contextual = new Map<string, Set<string>>();
  for (const p of real) { inbound.set(p.url, new Set()); contextual.set(p.url, new Set()); out.set(p.url, new Set()); }
  for (const p of real) {
    for (const h of p.links) {
      const t = normalizeHref(h, p.url, cfg.origin);
      if (t && t !== p.url && known.has(t)) { out.get(p.url)!.add(t); inbound.get(t)!.add(p.url); }
    }
    for (const h of p.mainLinks) {
      const t = normalizeHref(h, p.url, cfg.origin);
      if (t && t !== p.url && known.has(t)) contextual.get(t)!.add(p.url);
    }
  }
  // BFS from home
  const depth = new Map<string, number>([["/", 0]]);
  const q = ["/"];
  while (q.length) {
    const c = q.shift()!;
    for (const n of out.get(c) ?? []) if (!depth.has(n)) { depth.set(n, depth.get(c)! + 1); q.push(n); }
  }
  const utility = new Set(opt.utilityRoutes ?? []);
  const orphans = indexable.filter((p) => p.url !== "/" && inbound.get(p.url)!.size === 0).map((p) => p.url);
  const unreachable = indexable.filter((p) => !depth.has(p.url) && !orphans.includes(p.url)).map((p) => p.url);
  const deep = indexable.filter((p) => (depth.get(p.url) ?? 0) > maxDepth).map((p) => `${p.url} (depth ${depth.get(p.url)})`);
  const thin = indexable.filter((p) => p.url !== "/" && !utility.has(p.url) && contextual.get(p.url)!.size < minInbound)
    .map((p) => `${p.url} (${contextual.get(p.url)!.size} contextual, ${inbound.get(p.url)!.size} total)`);
  const hubGaps: string[] = [];
  for (const { page: hub, prefix } of hubPairs(cfg as SiteConfig)) {
    const hp = real.find((p) => p.url === hub);
    if (!hp) { hubGaps.push(`hub page ${hub} not built`); continue; }
    if (hp.noindex) hubGaps.push(`hub ${hub} is noindex`);
    for (const item of indexable.filter((p) => p.url.startsWith(prefix) && p.url !== hub && p.url.slice(prefix.length).split("/").filter(Boolean).length === 1))
      if (!out.get(hub)!.has(item.url)) hubGaps.push(`${item.url} not linked from hub ${hub}`);
  }
  return { inbound, contextual, depth, orphans, unreachable, deep, thin, hubGaps };
}

export function checkLinkGraph(pages: Page[], cfg: SiteConfig, opt: GraphOptions = {}): Check {
  const utilityRoutes = opt.utilityRoutes ?? (cfg.utilityRoutes as string[] | undefined) ?? ["/about/", "/privacy/", "/affiliate-disclosure/"];
  const r = analyseGraph(pages, cfg as any, { ...opt, utilityRoutes });
  const hard = [
    ...r.orphans.map((u) => `ORPHAN (no internal links in): ${u}`),
    ...r.unreachable.map((u) => `unreachable from home: ${u}`),
    ...r.hubGaps.map((u) => `hub gap: ${u}`),
  ];
  const soft = [...r.deep.map((u) => `deeper than 3 clicks: ${u}`), ...r.thin.map((u) => `under 3 contextual inbound links: ${u}`)];
  const depths = [...r.depth.values()];
  const summary = `${r.depth.size} pages reachable, max depth ${Math.max(0, ...depths)}, ${r.orphans.length} orphans, ${r.thin.length} pages under 3 contextual inbound links, ${r.hubGaps.length} hub gaps`;
  if (hard.length) return check("linkgraph", "Internal link graph", [...hard, ...soft], summary);
  return check("linkgraph", "Internal link graph", soft, summary, true);
}
