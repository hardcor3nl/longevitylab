/**
 * Longevity Intel export (job M).
 * usage: node --experimental-strip-types src/migrate/longevity.ts --repo <old repo> --site <sites/thelongevityintel>
 * MDX bodies move unchanged except: brand name "LongevityLab" -> "Longevity Intel" (owner rule), and a
 * mechanical year strip from titles. Data files (supplements, products, protocols, comparisons, faqs,
 * affiliates) are exported as JSON: numeric evidence/safety/popularity scores are dropped, "tested" phrases removed.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import { PRICE_RE, splitFrontmatter } from "@portfolio/schema";
import { csvCell } from "../util.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "/home/user/longevitylab");
const site = opt("--site", "sites/thelongevityintel");
const EDITORIAL = "Longevity Intel editorial";
const CATEGORIES = ["supplements", "wearables", "recovery", "diagnostics", "protocols", "best"];
const TQ_OVERRIDE: Record<string, string> = { "supplements/rapamycin-longevity-guide": "rapamycin longevity guide", "supplements/best-rapamycin-guide": "best rapamycin" };
const REAL_AFFILIATE_HOSTS = ["amazon.com", "amzn.to", "awin1.com", "oxfordhealthspan.com", "sunlighten.com"];
const log: string[] = [];

const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
const firstAdded = (file: string) => git(["log", "--diff-filter=A", "--follow", "--format=%aI", "--", file]).split("\n").filter(Boolean).at(-1)?.slice(0, 10);
const initialDay = git(["log", "--reverse", "--format=%aI"]).split("\n")[0].slice(0, 10);

async function loadTs(entries: Record<string, string>) {
  const contents = Object.entries(entries).map(([name, path]) => `export * as ${name} from ${JSON.stringify(join(repo, path))};`).join("\n");
  const out = await build({ stdin: { contents, resolveDir: repo, loader: "ts" }, bundle: true, format: "esm", platform: "node", write: false, logLevel: "error", alias: { "@": join(repo, "src") } });
  const file = join(mkdtempSync(join(tmpdir(), "lg-old-")), "old.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return (await import(pathToFileURL(file).href)) as Record<string, any>;
}

const yamlText = (o: unknown) => YAML.stringify(o, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date|legacyDate): (\d{4}-\d\d-\d\d\S*)$/gm, '$1$2: "$3"');
const stripYear = (s: string) => s.replace(/\s*\(?\b20(2\d)\b\)?/g, "").replace(/\s{2,}/g, " ").replace(/\s+([:,|—-])/g, "$1").replace(/[:,|—-]\s*$/, "").trim();
function targetQuery(title: string) {
  return stripYear(title).split(/\s[:|—-]\s|[:|]/)[0].replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim().toLowerCase();
}
/** Fit to a length limit by dropping trailing clauses, then trailing words. Old text stays in the old repo; changes are logged to audits/. */
function fit(s: string, max: number, seps: RegExp): string {
  if (s.length <= max) return s;
  const parts = s.split(seps).filter(Boolean);
  const joiners = [...s.matchAll(seps)].map((m) => m[0]);
  let out = parts[0];
  for (let i = 1; i < parts.length && (out + joiners[i - 1] + parts[i]).length <= max; i++) out += joiners[i - 1] + parts[i];
  if (out.length > max) out = out.slice(0, max).replace(/\s+\S*$/, "");
  return out.replace(/[\s,;:—–-]+$/, "");
}
const fitTitle = (s: string) => fit(s, 60, /(?:\s[:|—–-]\s|:\s)/g);
const fitDesc = (s: string) => fit(s, 155, /(?:[.;]\s|,\s|\s[—–-]\s|:\s)/g);
/** Banned filler words (CONTENT_STANDARD) reworded mechanically, case preserved. */
const banFix = (s: string) => s
  .replace(/([Hh])ighest[- ]([Ll])everage/g, (_m, a, b) => `${a}ighest-${b === "L" ? "I" : "i"}mpact`)
  .replace(/\b([Ll])everage\b/g, (_m, a) => (a === "L" ? "Use" : "use")).replace(/\b([Rr])obust\b/g, (_m, a) => (a === "R" ? "Strong" : "strong"))
  .replace(/\b([Ss])eamless\b/g, (_m, a) => (a === "S" ? "Smooth" : "smooth")).replace(/\b([Ee])levate\b/g, (_m, a) => (a === "E" ? "Raise" : "raise"))
  .replace(/not a hands-on validation/g, "not a device validation").replace(/not a hands-on product test/g, "not a product test");
const wordsOf = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;
const isRealAffiliate = (url: string) => { try { const h = new URL(url).hostname.replace(/^www\./, ""); return REAL_AFFILIATE_HOSTS.some((x) => h === x || h.endsWith("." + x)); } catch { return false; } };

/** "third-party tested" and similar: replace with a statement of what the brand claims, never a testing claim by us. */
function fixTested(s: string): string {
  return s
    .replace(/states that it is third-party tested/gi, "states that it uses third-party testing")
    .replace(/Third-party purity tested/g, "Brand states third-party purity testing")
    .replace(/Third-party tested/g, "Brand states third-party testing")
    .replace(/third-party tested/g, "third-party testing stated by the brand");
}
/** Unverified accuracy statistics that P0B removed from the articles but that survive in the product cards. */
const UNVERIFIED = [/\(±?\d+(\.\d+)?ms vs ECG\)/, /\(\d+% vs PSG\)/];

async function main() {
  const old = await loadTs({ aff: "src/lib/affiliateLinks.ts", supp: "src/lib/supplements.ts", prod: "src/lib/products.ts", proto: "src/lib/protocols.ts", cmp: "src/lib/comparisons.ts", faq: "src/lib/faqs.ts", clusters: "src/lib/contentClusters.ts", hubs: "src/lib/categoryHubLinks.ts" });
  const dataDir = join(site, "src/data");
  mkdirSync(dataDir, { recursive: true });
  for (const c of CATEGORIES) { rmSync(join(site, "src/content", c), { recursive: true, force: true }); mkdirSync(join(site, "src/content", c), { recursive: true }); }

  // ---------------------------------------------------------------- affiliates
  const rows: any[] = [];
  const internalGo = new Map<string, string>();
  for (const [id, url] of Object.entries<string>(old.aff.affiliateLinks)) {
    if (/^https:\/\/thelongevityintel\.com\//.test(url)) { internalGo.set(id, new URL(url).pathname); continue; }
    const real = isRealAffiliate(url);
    const host = new URL(url).hostname.replace(/^www\./, "");
    const network = host.endsWith("amazon.com") || host === "amzn.to" ? "Amazon Associates" : host.includes("awin1") ? "Awin" : host.includes("oxfordhealthspan") ? "Oxford Healthspan referral" : host.includes("sunlighten") ? "Sunlighten referral" : "none";
    rows.push({ id, programme: id, network, url, status: real ? "live" : "plain" });
  }
  writeFileSync(join(dataDir, "affiliates.json"), JSON.stringify(rows, null, 2) + "\n");
  const liveIds = new Set(rows.filter((r) => r.status === "live").map((r) => r.id));

  // ------------------------------------------------------------------ articles
  const faqBySlug: Record<string, unknown[]> = old.faq.articleFaqs;
  const ledger: string[][] = [];
  const heroes = new Map<string, string>();
  const fitLog: string[][] = [["url", "old_title", "new_title", "old_description", "new_description"]];
  const stats = { articles: 0, approxDates: 0, brandFixed: 0, yearStripped: 0 };
  const hasFaq = new Set<string>();
  for (const cat of CATEGORIES) {
    const dir = join(repo, "content", cat);
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".mdx")).sort()) {
      const slug = f.replace(/\.mdx$/, "");
      const rel = `content/${cat}/${f}`;
      const { data, body } = splitFrontmatter(readFileSync(join(repo, rel), "utf8")) as { data: any; body: string };
      let text = body;
      text = banFix(text);
      data.verdict = data.verdict && banFix(String(data.verdict));
      if (data.description) data.description = banFix(String(data.description));
      if (data.products) data.products = JSON.parse(banFix(JSON.stringify(data.products)));
      text = text.replace(/not a hands-on laboratory test/g, "not a laboratory test").replace(/not a hands-on test/g, "not a product test");
      if (data.description) data.description = String(data.description).replace(/with no unsupported hands-on claims/, "without unsupported testing claims");
      if (/LongevityLab/.test(text)) { stats.brandFixed++; text = text.replace(/LongevityLab/g, "Longevity Intel"); }
      for (const [id, path] of internalGo) text = text.split(`/go/${id})`).join(`${path})`);
      if (data.products) for (const pr of data.products) { const id = String(pr.affiliateUrl).replace(/^\/go\//, ""); if (internalGo.has(id)) pr.affiliateUrl = ""; }
      const pubGit = firstAdded(rel) ?? String(data.date).slice(0, 10);
      const image = /photo-[\w-]+/.exec(data.image ?? "")?.[0];
      if (image) heroes.set(image, data.image);
      const title = stripYear(String(data.title));
      if (title !== data.title) stats.yearStripped++;
      const externalLinks = new Map<string, string>();
      for (const m of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
        const url = m[2].replace(/[.,;]$/, "");
        if (/thelongevityintel\.com|amazon\.com|amzn\.to|awin1\.com/.test(url)) continue;
        if (!externalLinks.has(url)) externalLinks.set(url, m[1].replace(/\*+/g, "").trim());
      }
      const checked = String(data.modified ?? data.date).slice(0, 10);
      const sources = [...externalLinks].map(([url, t]) => ({ title: t, url, checked, approx: true }));
      const hasPrices = PRICE_RE.test(text) || PRICE_RE.test(JSON.stringify(data.products ?? []));
      const faqs = faqBySlug[slug];
      if (faqs) hasFaq.add(slug);
      const shortTitle = fitTitle(title), shortDesc = fitDesc(String(data.description));
      if (shortTitle !== title || shortDesc !== data.description) fitLog.push([`/${cat}/${slug}`, String(data.title), shortTitle, String(data.description), shortDesc]);
      const fm: Record<string, unknown> = {
        title: shortTitle, description: shortDesc, slug, targetQuery: TQ_OVERRIDE[`${cat}/${slug}`] ?? targetQuery(String(data.title)),
        published: pubGit, ...(pubGit === initialDay ? { publishedApprox: true } : {}),
        ...(data.modified ? { updated: String(data.modified).slice(0, 10) } : {}),
        legacyDate: String(data.date).slice(0, 10),
        ...(hasPrices ? { reviewEvery: "90d" } : { reviewEvery: "180d" }),
        author: EDITORIAL, evidence: "research", sources,
        ...(data.products?.length ? { affiliates: [...new Set<string>(data.products.map((p: any) => String(p.affiliateUrl).replace(/^\/go\//, "")))].filter((id) => liveIds.has(id)) } : {}),
        ...(sources.length === 0 ? { needsSources: true } : {}),
        category: cat, h1: stripYear(String(data.title)), verdict: data.verdict, tags: data.tags ?? [], featured: !!data.featured,
        ...(image ? { image } : {}), ...(data.products?.length ? { products: data.products } : {}), ...(faqs ? { faqs: JSON.parse(banFix(JSON.stringify(faqs))) } : {}),
      };
      writeFileSync(join(site, "src/content", cat, f), `---\n${yamlText(fm)}---\n\n${text.replace(/^\n+/, "")}`);
      stats.articles++; if (fm.publishedApprox) stats.approxDates++;
      ledger.push([`/${cat}/${slug}`, "keep", String(fm.targetQuery), "no GSC pages export for this domain: no cuts or merges proposed", "", "2026-09-29", "proposed", String(wordsOf(text)), String(!!fm.needsSources), "article", String(data.date).slice(0, 10), pubGit]);
    }
  }
  writeFileSync(join(dataDir, "heroes.json"), JSON.stringify(Object.fromEntries([...heroes].sort()), null, 2) + "\n");

  // ------------------------------------------------------------------ data
  const strip = ({ evidenceScore, safetyScore, popularityScore, image, ...rest }: any) => rest;
  const supplements = old.supp.supplements.map(strip);
  writeFileSync(join(dataDir, "supplements.json"), JSON.stringify(supplements, null, 2) + "\n");
  let removedClaims = 0;
  const products = old.prod.products.map((p: any) => {
    const q = strip(p);
    const clean = (s: string) => { let t = fixTested(s); for (const re of UNVERIFIED) if (re.test(t)) { removedClaims++; t = t.replace(re, "").replace(/\s{2,}/g, " ").replace(/\s+$/, ""); } return t; };
    q.summary = clean(q.summary);
    q.keyBenefits = q.keyBenefits.map(clean);
    return q;
  });
  writeFileSync(join(dataDir, "products.json"), JSON.stringify(products, null, 2) + "\n");
  writeFileSync(join(dataDir, "productCategories.json"), JSON.stringify({ allCategories: old.prod.allCategories, categoryGroups: old.prod.categoryGroups }, null, 2) + "\n");
  writeFileSync(join(dataDir, "protocols.json"), JSON.stringify(old.proto.protocols.map(({ image, ...r }: any) => r), null, 2) + "\n");
  writeFileSync(join(dataDir, "comparisons.json"), JSON.stringify(old.cmp.comparisons.map((c: any) => ({ ...c, description: c.description.replace("Six months wearing both:", "Side by side:") })), null, 2) + "\n");
  writeFileSync(join(dataDir, "faqs.json"), JSON.stringify({ compare: old.faq.compareFaqs, articles: Object.fromEntries(Object.entries(faqBySlug).filter(([k]) => !hasFaq.has(k))) }, null, 2) + "\n");
  writeFileSync(join(dataDir, "clusters.json"), JSON.stringify({ clusters: old.clusters.contentClusters, hubs: old.hubs.categoryHubLinks }, null, 2) + "\n");
  writeFileSync(join(dataDir, "search-index.json"), "[]\n"); // regenerated by the site build script

  // ---------------------------------------------------------------- ledger
  const live = readFileSync("/tmp/live-sitemap.txt", "utf8").split("\n").filter(Boolean).map((u) => new URL(u).pathname);
  const have = new Set(ledger.map((r) => r[0]));
  for (const p of live) if (!have.has(p)) ledger.push([p, "keep", "", "hub, tool or data page rebuilt on the new templates", "", "2026-09-29", "proposed", "", "", p.startsWith("/database/") ? "evidence-card" : p.startsWith("/compare/") ? "compare" : p.startsWith("/protocols/") ? "protocol" : "static", "", ""]);
  mkdirSync(join(site, "audits"), { recursive: true });
  writeFileSync(join(site, "audits/title-description-changes.csv"), fitLog.map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  const cfgPath = join(site, "site.config.json");
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  cfg.staticRoutes = live.filter((p) => !ledger.some((r) => r[0] === p && r[9] === "article"));
  writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
  const missing = ledger.map((r) => r[0]).filter((p) => !live.includes(p) && p !== "");
  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_date", "published"];
  writeFileSync(join(site, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  writeFileSync(join(site, "public/_redirects"), "# generated from content-ledger.csv by packages/tooling/src/migrate/longevity.ts; do not edit\n# no redirects planned: every live URL is kept, slashless\n");
  console.log(JSON.stringify({ ...stats, affiliates: rows.length, live: liveIds.size, plain: rows.length - liveIds.size, internalGo: [...internalGo], products: products.length, supplements: supplements.length, removedUnverifiedClaims: removedClaims, ledger: ledger.length, notInLiveSitemap: missing }));
}
main();
