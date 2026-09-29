import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Check, type Page, type SiteConfig, check, isRealPage } from "./dist.ts";

/** RSS/Atom feed and llms.txt sanity: exists, items point at built indexable pages on the origin, autodiscovery link on the home page. */
export function checkFeeds(dist: string, cfg: SiteConfig, pages: Page[]): Check {
  const issues: string[] = [];
  const byUrl = new Map(pages.filter(isRealPage).map((p) => [p.url, p]));
  const linkOk = (loc: string, ctx: string) => {
    if (!loc.startsWith(cfg.origin)) return issues.push(`${ctx}: off-origin link ${loc}`);
    const p = byUrl.get(new URL(loc).pathname);
    if (!p) issues.push(`${ctx}: link to unbuilt page ${loc}`);
    else if (p.noindex) issues.push(`${ctx}: link to noindex page ${loc}`);
  };
  let items = 0;
  const feed = join(dist, "feed.xml"), atom = join(dist, "atom.xml"), llms = join(dist, "llms.txt");
  if (!existsSync(feed)) issues.push("feed.xml missing");
  else {
    const x = readFileSync(feed, "utf8");
    if (!/<rss[^>]+version="2\.0"/.test(x) || !/<\/rss>\s*$/.test(x)) issues.push("feed.xml is not well-formed RSS 2.0");
    for (const m of x.matchAll(/<item>[\s\S]*?<\/item>/g)) {
      items++;
      const link = m[0].match(/<link>([^<]+)<\/link>/)?.[1];
      if (link) linkOk(link.replace(/&amp;/g, "&"), "feed.xml"); else issues.push("feed.xml item without link");
      const d = m[0].match(/<pubDate>([^<]+)<\/pubDate>/)?.[1];
      if (!d || Number.isNaN(Date.parse(d))) issues.push(`feed.xml bad pubDate on ${link}`);
    }
    if (!items) issues.push("feed.xml has no items");
  }
  if (!existsSync(atom)) issues.push("atom.xml missing");
  else if (!/<feed[^>]+Atom/.test(readFileSync(atom, "utf8"))) issues.push("atom.xml is not Atom");
  const home = pages.find((p) => p.url === "/");
  if (home && !/<link[^>]+type="application\/rss\+xml"/.test(home.html.split(/<\/head>/i)[0])) issues.push("home page lacks RSS autodiscovery <link>");
  if (!existsSync(llms)) issues.push("llms.txt missing");
  else {
    const t = readFileSync(llms, "utf8");
    if (!/^# .+\n\n> .+/.test(t)) issues.push("llms.txt must start with an H1 and a blockquote summary");
    const links = [...t.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
    for (const l of links) {
      const path = new URL(l).pathname;
      if (l.startsWith(cfg.origin) && !byUrl.has(path) && !existsSync(join(dist, path))) issues.push(`llms.txt links to missing ${l}`);
    }
    const idx = [...byUrl.values()].filter((p) => !p.noindex && !((cfg.categoryRoutes as string[]) ?? []).includes(p.url) && /^\/(guides|reviews)\/[^/]+\/$/.test(p.url));
    const missing = idx.filter((p) => !t.includes(p.url));
    if (missing.length) issues.push(`llms.txt lacks ${missing.length} article pages, e.g. ${missing[0].url}`);
  }
  return check("feeds", "Feeds and llms.txt", issues, `RSS with ${items} items, Atom, llms.txt`);
}
