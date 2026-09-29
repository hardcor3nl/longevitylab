/**
 * Nomad Terminal content export (job M).
 * usage: node --experimental-strip-types src/migrate/nomad.ts --repo <old repo> --drafts <owner-drafts checkout> --site sites/nomadterminal --sitemap <live sitemap.xml>
 * Emits MDX (guides, blog, city narratives), data JSON, drafts, content-ledger.csv and public/_redirects.
 * Body text is the old strings: only mechanical link normalisation, escaping and the listed word swaps are applied.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { PRICE_RE } from "@portfolio/schema";
import { csvCell } from "../util.ts";
import { loadNomadData } from "./load-nomad.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "/home/user/globaldigitalnomadhub");
const draftsRepo = opt("--drafts", "");
const site = opt("--site", "sites/nomadterminal");
const sitemapFile = opt("--sitemap", join(site, "live-sitemap.xml"));
const EDITORIAL = "Nomad Terminal editorial";
const TODAY = "2026-09-29";

// ---------------------------------------------------------------- git dates
const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
const kindOf = (file: string) => (/blog/.test(file) ? "blog" : /guides\.ts$/.test(file) ? "guide" : /cities\.ts$/.test(file) ? "city" : /countries\.ts$/.test(file) ? "country" : /regions\.ts$/.test(file) ? "region" : "other");
const firstSeenMap = new Map<string, string>();
{
  const commits = git(["log", "--reverse", "--format=%H %aI", "master"]).split("\n").map((l) => l.split(" "));
  for (const [sha, iso] of commits) {
    let out = "";
    try { out = git(["grep", "-o", "-E", `slug: \\"[a-z0-9-]+\\"`, sha, "--", "src/data"]); } catch { continue; }
    for (const line of out.split("\n")) {
      const m = /^[0-9a-f]{40}:(.+?):slug: "([a-z0-9-]+)"$/.exec(line);
      if (!m) continue;
      const key = `${kindOf(m[1])}:${m[2]}`;
      if (!firstSeenMap.has(key)) firstSeenMap.set(key, iso.slice(0, 10));
    }
  }
}
const firstSeen = (kind: string, slug: string) => firstSeenMap.get(`${kind}:${slug}`);

// ------------------------------------------------------------ text helpers
const esc = (s: string) =>
  s.split(/(`[^`\n]*`)/).map((part, i) => (i % 2 ? part : part.replace(/([{}])/g, "\\$1").replace(/<(?=[a-zA-Z/!])/g, "\\<").replace(/(^|\s)([*_])(?=\S)/g, "$1\\$2"))).join("");
const cell = (s: string) => esc(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
const swaps: Record<string, number> = {};
/** Mechanical word swaps for the content lint's banned and testing-claim lists. Counted and logged. */
const SWAPS: [RegExp, string, string][] = [
  [/\bleverage\b/g, "use", "leverage"],
  [/\bunlock\b/gi, "open up", "unlock"],
  [/\bseamless\b/gi, "smooth", "seamless"],
  [/\brobust\b/gi, "solid", "robust"],
  [/\belevate\b/gi, "raise", "elevate"],
  [/\bgame[- ]changer\b/gi, "big change", "game-changer"],
  [/\bdive in\b/gi, "start", "dive in"],
  [/\bin conclusion\b,?\s*/gi, "", "in conclusion"],
  [/\bit'?s important to note that\s+(\w)/gi, (_m: string, c: string) => c.toUpperCase(), "important to note"] as any,
  [/\bit'?s important to note\b,?\s*/gi, "", "important to note"],
  [/\bin today['’]s\b/gi, "in the current", "in today's"],
  [/\bhands-on\b/gi, "practical", "hands-on"],
  [/\bwe tested\b/gi, "tests found", "we tested"],
  [/\bin our experience\b,?\s*/gi, "", "in our experience"],
  [/\bwe built\b/gi, "the site built", "we built"],
];
function fix(s: string): string {
  let out = s;
  for (const [re, to, name] of SWAPS) {
    out = out.replace(re, (...m: any[]) => {
      swaps[name] = (swaps[name] ?? 0) + 1;
      return typeof to === "function" ? (to as any)(...m) : to;
    });
  }
  return out;
}
function normLinks(s: string): string {
  return s.replace(/\]\((\/[^)\s#?]*?)(?<!\/)([?#][^)\s]*)?\)/g, (_m, p, tail) => `](${p === "" ? "/" : p}/${tail ?? ""})`);
}
const canonPath = (u: string) => {
  const m = /^(\/[^?#]*?)(\/?)([?#].*)?$/.exec(u);
  if (!m) return u;
  return (m[1] === "" ? "/" : m[1] + "/") + (m[3] ?? "");
};
const P = (s: string) => normLinks(esc(fix(s)));
const wordsOf = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
/** "July 2026" / "September 8, 2026" -> ISO. */
function monthToIso(s?: string): string | null {
  if (!s) return null;
  let m = /([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/.exec(s);
  if (m) { const mo = MONTHS.indexOf(m[1].toLowerCase()); if (mo >= 0) return `${m[3]}-${String(mo + 1).padStart(2, "0")}-${m[2].padStart(2, "0")}`; }
  m = /([A-Za-z]+)\s+(\d{4})/.exec(s);
  if (!m) return null;
  const mo = MONTHS.indexOf(m[1].toLowerCase());
  return mo < 0 ? null : `${m[2]}-${String(mo + 1).padStart(2, "0")}-01`;
}

// ------------------------------------------------- title / description / query
const stripYear = (t: string) =>
  t.replace(/\s*\(\s*20\d\d\s*\)/g, "").replace(/\s*[:,–—-]?\s*\b(?:in|for|of|update|guide)?\s*20\d\d\b(?=[\s:,).—–-]|$)/gi, (m) => (/^\s*[:,–—-]/.test(m) ? "" : m.replace(/\s*\b(in|for|of)?\s*20\d\d\b/i, "")))
   .replace(/\b20\d\d\b/g, "").replace(/\s{2,}/g, " ").replace(/\s+([:,)])/g, "$1").replace(/[:,\s–—-]+$/, "").replace(/^[\s:–—-]+/, "").replace(/\(\s*\)/g, "").trim();
function titleCandidates(full: string): string[] {
  const t = stripYear(full);
  if (t.length <= 60) return [t];
  const parts = t.split(/\s*[:—–|]\s*|\s-\s|\s\(/).map((x) => x.replace(/\)$/, "").trim()).filter(Boolean);
  const out: string[] = [];
  let acc = "";
  for (const p of parts) {
    const next = acc ? `${acc}: ${p}` : p;
    if (next.length > 60) break;
    acc = next;
    if (acc.length >= 12) out.unshift(acc);
  }
  const trim = (x: string) => { let y = x.replace(/[\s,:;–—(-]+$/, ""); for (let i = 0; i < 4; i++) y = y.replace(/\s+(and|or|for|to|in|of|the|a|an|with|vs|as|on|that|at|by)$/i, ""); return y; };
  const cut = trim(t.slice(0, 61).replace(/\s+\S*$/, ""));
  out.push(cut, trim(t.slice(0, 57).replace(/\s+\S*$/, "")) + " (2)");
  return out;
}
const shortTitle = (full: string) => titleCandidates(full)[0];
function shortDesc(s: string): string {
  const d = fix(s).replace(/\s+/g, " ").trim();
  if (d.length <= 155) return d;
  const sentence = d.slice(0, 156).match(/^.*[.!?](?=\s)/);
  if (sentence && sentence[0].length >= 80) return sentence[0];
  return d.slice(0, 152).replace(/\s+\S*$/, "").replace(/[\s,:;–—(-]+$/, "") + "...";
}
const queryFrom = (t: string) => stripYear(t).toLowerCase().replace(/[^a-z0-9$€£+&' -]/g, " ").replace(/\s+/g, " ").trim();

function frontmatterText(fm: Record<string, unknown>): string {
  return YAML.stringify(fm, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date): (\d{4}-\d{2}-\d{2}\S*)$/gm, '$1$2: "$3"');
}

// MDX/GFM reads ~a ... ~b on two lines as strikethrough: escape approximate-amount tildes
const escapeTildes = (md: string) => md.replace(new RegExp("(?<![" + String.fromCharCode(92) + "])~(?=[$€£¥0-9≈])", "g"), String.fromCharCode(92) + "~");

// ----------------------------------------------------------- body renderers
const anchorOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function renderBlocks(blocks: any[], uses: { callout: boolean }): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "p": out.push(P(b.text)); break;
      case "h2": out.push(`## ${esc(fix(b.text))}`); break;
      case "h3": out.push(`### ${esc(fix(b.text))}`); break;
      case "list": out.push(b.items.map((it: string, i: number) => `${b.ordered ? `${i + 1}.` : "-"} ${P(it)}`).join("\n")); break;
      case "quickFacts":
        out.push(`<dl class="quickfacts">\n${b.items.map((f: any) => `<div><dt>${esc(fix(f.label))}</dt><dd>${esc(fix(f.value))}</dd></div>`).join("\n")}\n</dl>`);
        break;
      case "callout":
        uses.callout = true;
        out.push(`<Callout type="${b.tone === "warning" ? "warning" : "info"}">\n\n${P(b.text)}\n\n</Callout>`);
        break;
      case "faq":
        out.push(b.items.map((f: any) => `<details class="faq-item">\n<summary>${esc(fix(f.q))}</summary>\n\n${P(f.a)}\n\n</details>`).join("\n\n"));
        break;
      case "links":
        out.push((b.title ? `**${esc(fix(b.title))}**\n\n` : "") + b.items.map((l: any) => `- [${esc(l.label)}](${/^https?:\/\//.test(l.url) ? l.url : canonPath(l.url)})`).join("\n"));
        break;
      default: throw new Error("unknown block " + b.type);
    }
  }
  return out.join("\n\n");
}
function textPieces(blocks: any[]): string[] {
  const t: string[] = [];
  for (const b of blocks) {
    if (b.text) t.push(b.text);
    if (b.items) t.push(...b.items.map((i: any) => (typeof i === "string" ? i : [i.label, i.value, i.q, i.a].filter(Boolean).join(" "))));
  }
  return t;
}
function extractSources(blocks: any[], checked: string, approx: boolean) {
  const seen = new Map<string, { title: string; url: string; checked: string; approx?: boolean }>();
  for (const b of blocks)
    if (b.type === "links")
      for (const l of b.items)
        if (/^https?:\/\//.test(l.url) && !/nomadterminal\.com/.test(l.url) && !seen.has(l.url))
          seen.set(l.url, { title: l.label.replace(/\*+/g, "").trim(), url: l.url, checked, ...(approx ? { approx: true } : {}) });
  return [...seen.values()];
}

// ------------------------------------------------------------- photo assets
const photoFile = (id: string) => `${id}.jpg`;
function heroRef(asset: any | undefined) {
  if (!asset) return undefined;
  const alt = asset.alt as string;
  const credit = asset.credit as string | undefined, creditUrl = asset.creditUrl as string | undefined;
  if (asset.src) return { file: `blog/${String(asset.src).replace(/^\/blog\//, "")}`.replace(/\.png$/, ".webp"), alt, credit, creditUrl, kind: "owner" };
  return { file: `photos/${photoFile(asset.photoId ?? "photo-1488646953014-85cb44e25828")}`, alt, credit, creditUrl, kind: "unsplash" };
}

async function main() {
  const d = await loadNomadData(repo, draftsRepo || undefined);
  const root = site;
  for (const c of ["guides", "blog", "destinations"]) { rmSync(join(root, "src/content", c), { recursive: true, force: true }); mkdirSync(join(root, "src/content", c), { recursive: true }); }
  rmSync(join(root, "drafts"), { recursive: true, force: true }); mkdirSync(join(root, "drafts"), { recursive: true });
  mkdirSync(join(root, "src/data"), { recursive: true }); mkdirSync(join(root, "public"), { recursive: true });
  const ledger: string[][] = [];
  const stats = { guides: 0, blog: 0, cities: 0, drafts: 0, approxDates: 0, gitDates: 0 };
  const usedTitles = new Set<string>(), usedQueries = new Set<string>();
  const uniq = (set: Set<string>, ...cands: string[]) => { const c = cands.find((x) => x && !set.has(x.toLowerCase())) ?? cands.at(-1)!; set.add(c.toLowerCase()); return c; };
  const photos = new Set<string>();

  const countryOf = (slug: string) => d.countries.find((c: any) => c.slug === slug);
  const regionOf = (slug: string) => d.regions.find((r: any) => r.slug === slug);
  const cityByslug = (slug: string) => d.cities.find((c: any) => c.slug === slug);

  function entry(kind: "guide" | "blog", coll: string, urlBase: string, item: any, blocks: any[], opts: { date?: string; category: string; legacyChecked?: string; hero: any; draft?: boolean }) {
    const uses = { callout: false };
    const md = (() => {
      const body = renderBlocks(blocks, uses);
      return (uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body + "\n";
    })();
    const git = opts.draft ? undefined : firstSeen(kind, item.slug);
    const published = opts.draft ? item.date : git ?? item.date ?? "2026-08-01";
    if (!opts.draft) (git ? stats.gitDates++ : stats.approxDates++);
    const legacy = opts.legacyChecked;
    const checked = monthToIso(legacy) ?? published;
    const sources = extractSources(blocks, checked, true);
    const pieces = textPieces(blocks);
    const hasPrices = PRICE_RE.test(pieces.join("\n"));
    const h1 = stripYear(fix(item.title));
    const title = uniq(usedTitles, ...titleCandidates(fix(item.title)), item.slug);
    const tq = uniq(usedQueries, ...titleCandidates(item.title).map(queryFrom), queryFrom(item.title), item.slug.replace(/-/g, " "));
    const fm: Record<string, unknown> = {
      title, description: shortDesc(item.excerpt ?? item.description), slug: item.slug, targetQuery: tq,
      published, ...(git ? {} : { publishedApprox: true }),
      ...(hasPrices || kind === "guide" ? { reviewEvery: "90d" } : {}), author: EDITORIAL, evidence: "research",
      sources, affiliates: [], category: opts.category, ...(hasPrices && sources.length === 0 ? { needsSources: true } : {}), h1,
    };
    if (!fm.reviewEvery) delete fm.reviewEvery;
    const heroFm = heroRef(opts.hero);
    if (heroFm) photos.add(heroFm.file);
    (fm as any).hero = heroFm ? { file: heroFm.file, alt: heroFm.alt, ...(heroFm.credit ? { credit: heroFm.credit } : {}), ...(heroFm.creditUrl ? { creditUrl: heroFm.creditUrl } : {}) } : undefined;
    if (!fm.hero) delete fm.hero;
    const dir = opts.draft ? join(root, "drafts") : join(root, "src/content", coll);
    writeFileSync(join(dir, `${item.slug}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    return { fm, words: wordsOf(md), legacy, published, git };
  }

  // ---- guides
  for (const g of d.guides) {
    const r = entry("guide", "guides", "/guides/", g, g.content, { category: g.category, legacyChecked: g.updated, hero: d.getGuideHero(g.slug, g.category) });
    stats.guides++;
    ledger.push([`/guides/${g.slug}/`, "keep", r.fm.targetQuery as string, "GSC pages file absent: everything is kept", "", TODAY, "proposed", String(r.words), String(!!r.fm.needsSources), "guide", g.updated ?? "", r.published, "derived"]);
  }
  // ---- blog
  for (const p of d.blogPosts) {
    const r = entry("blog", "blog", "/blog/", p, p.content, { category: p.category, hero: d.getBlogHero(p.slug) });
    stats.blog++;
    ledger.push([`/blog/${p.slug}/`, "keep", r.fm.targetQuery as string, "GSC pages file absent: everything is kept", "", TODAY, "proposed", String(r.words), String(!!r.fm.needsSources), "blog", p.date, r.published, "derived"]);
  }
  // ---- owner drafts (not built, not in the sitemap)
  const draftRows: any[] = [];
  for (const p of [...(d.draft35 ?? []), ...(d.draft36 ?? []), ...(d.draft37 ?? [])]) {
    const hero = (await loadDraftHero(p.slug)) ?? d.getBlogHero(p.slug);
    const r = entry("blog", "blog", "/blog/", p, p.content, { category: p.category, hero, draft: true, date: p.date } as any);
    stats.drafts++;
    draftRows.push({ slug: p.slug, words: r.words, sources: (r.fm.sources as any[]).length, title: r.fm.title });
  }
  // ---- cities: narrative as MDX (route override), everything else in JSON
  for (const c of d.cities) {
    const country = countryOf(c.countrySlug), region = regionOf(c.regionSlug);
    const route = `/destinations/${c.regionSlug}/${c.countrySlug}/${c.slug}/`;
    const blocks = d.cityNarratives[c.slug] ?? [];
    const ev = d.cityEvidence[c.slug];
    const uses = { callout: false };
    const body = renderBlocks(blocks, uses);
    const md = (uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body + "\n";
    const git = firstSeen("city", c.slug);
    const published = git ?? "2026-08-01";
    if (git) stats.gitDates++; else stats.approxDates++;
    const updated = ev ? monthToIso(ev.checkedDate) ?? undefined : undefined;
    const sources = ev ? ev.sources.map((s: any) => ({ title: s.label, url: s.url, checked: updated ?? published })) : [];
    const pieces = [...textPieces(blocks), c.description];
    const hasPrices = PRICE_RE.test(pieces.join("\n"));
    const t0 = `${c.name} for Digital Nomads: Cost, Wifi, Visa`;
    const title = uniq(usedTitles, t0.length <= 60 ? t0 : `${c.name} for Digital Nomads: Cost and Visa`, `${c.name} digital nomad guide`);
    const tq = uniq(usedQueries, `${c.name.toLowerCase()} digital nomad`, `${c.name.toLowerCase()} for digital nomads`, c.slug);
    const fm: Record<string, unknown> = {
      title, description: shortDesc(`${c.name} for digital nomads: ${c.tagline.replace(/\.$/, "")}. Planning estimates for cost, wifi and safety, coworking, neighbourhoods and the visa route.`),
      slug: c.slug, route, targetQuery: tq, published, ...(git ? {} : { publishedApprox: true }),
      ...(updated ? { updated } : {}), reviewEvery: "90d", author: EDITORIAL, evidence: "research", sources, affiliates: [], category: `${region?.name ?? ""} / ${country?.name ?? ""}`,
      ...(hasPrices && sources.length === 0 ? { needsSources: true } : {}), h1: `${c.name} for digital nomads`,
    };
    writeFileSync(join(root, "src/content/destinations", `${c.slug}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.cities++;
    ledger.push([route, "keep", tq, "GSC pages file absent: everything is kept", "", TODAY, "proposed", String(wordsOf(md)), String(!!fm.needsSources), "city", "", published, "derived"]);
    const hero = heroRef(d.getCityHero(c.slug));
    if (hero) photos.add(hero.file);
  }

  // ---- data JSON
  const heroes: Record<string, any> = {};
  const put = (key: string, a: any) => { const h = heroRef(a); if (h) { heroes[key] = { file: h.file, alt: h.alt, credit: h.credit, creditUrl: h.creditUrl, kind: h.kind }; photos.add(h.file); } };
  for (const c of d.cities) put(`city:${c.slug}`, d.getCityHero(c.slug));
  for (const c of d.countries) put(`country:${c.slug}`, d.getCountryHero(c.citySlugs));
  for (const r of d.regions) put(`region:${r.slug}`, d.getCountryHero(d.countries.filter((c: any) => c.regionSlug === r.slug).flatMap((c: any) => c.citySlugs)));
  const wj = (name: string, v: unknown) => writeFileSync(join(root, "src/data", name), JSON.stringify(v, null, 2) + "\n");
  wj("regions.json", d.regions);
  wj("countries.json", d.countries);
  wj("cities.json", d.cities.map(({ gradient, ...rest }: any) => rest));
  wj("visas.json", d.visas);
  wj("insurance.json", { providers: d.insuranceProviders, faqs: d.insuranceFaqs });
  wj("cost-breakdowns.json", d.costBreakdowns);
  wj("coworking.json", d.coworkingSpaces);
  wj("things-to-do.json", d.thingsToDoByCity);
  wj("city-evidence.json", Object.fromEntries(Object.entries(d.cityEvidence).map(([k, v]: [string, any]) => [k, { ...v, checkedIso: monthToIso(v.checkedDate) }])));
  wj("heroes.json", heroes);
  const TRACK_HOST = /tpo\.li|kqzyfj\.com|trip\.com\/t\/|expedia\.com\/affiliate|safetywing\.com\/\?reference|agent\.12go\.asia\?referer/;
  const NETWORK: Record<string, string> = { tripCom: "Trip.com", expedia: "Expedia", safetywing: "SafetyWing ambassador", worldNomads: "CJ Affiliate", localrent: "Travelpayouts", welcomePickups: "Travelpayouts", bikesbooking: "Travelpayouts", tiqets: "Travelpayouts", klook: "Travelpayouts", twelveGo: "12Go" };
  const affRows = Object.entries(d.affiliates).map(([key, a]: [string, any]) => {
    const tracked = TRACK_HOST.test(a.url);
    return { id: key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), key, programme: a.label.replace(/^(Search|Get a|Find a|Book)\s+/i, ""), network: NETWORK[key] ?? "none", url: a.url, status: tracked ? "live" : key === "bookingCom" ? "pending" : "none", category: a.category, description: a.description ?? "", label: a.label };
  });
  wj("affiliates.json", affRows);

  // ---- ledger: live sitemap + everything we build; statics
  const liveUrls = existsSync(sitemapFile) ? [...readFileSync(sitemapFile, "utf8").matchAll(/<loc>\s*https:\/\/nomadterminal\.com([^<\s]*)\s*<\/loc>/g)].map((m) => m[1]) : [];
  const have = new Set(ledger.map((r) => r[0]));
  const STATIC: Record<string, string> = { "/": "home", "/destinations/": "hub", "/visas/": "tool", "/insurance/": "tool", "/compare/": "tool", "/guides/": "hub", "/blog/": "hub", "/coworking/": "tool", "/community/": "static", "/tools/": "tool", "/about/": "static", "/disclosure/": "static", "/privacy/": "static", "/terms/": "static", "/cookies/": "static", "/contact/": "static" };
  for (const r of d.regions.filter((x: any) => !x.comingSoon)) ledger.push([`/destinations/${r.slug}/`, "keep", "", "region hub", "", TODAY, "proposed", "", "", "region", "", firstSeen("region", r.slug) ?? "", ""]);
  for (const c of d.countries) ledger.push([`/destinations/${c.regionSlug}/${c.slug}/`, "keep", "", "country page", "", TODAY, "proposed", "", "", "country", "", firstSeen("country", c.slug) ?? "", ""]);
  for (const [u, kind] of Object.entries(STATIC)) ledger.push([u, "keep", "", `${kind} page`, "", TODAY, "proposed", "", "", kind, "", "", ""]);
  const built = new Set(ledger.map((r) => r[0]));
  const missingFromBuild = liveUrls.filter((u) => !built.has(u));
  const extraInBuild = [...built].filter((u) => liveUrls.length && !liveUrls.includes(u));
  for (const u of missingFromBuild) ledger.push([u, "keep", "", "in the live sitemap but not produced by the export: check", "", TODAY, "proposed", "", "", "unknown", "", "", ""]);
  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_last_updated", "published", "target_query_source"];
  writeFileSync(join(root, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  writeFileSync(join(root, "public/_redirects"), `# generated from content-ledger.csv by packages/tooling/src/migrate/nomad.ts; do not edit\n# no merges or cuts: no GSC pages file exists for nomadterminal.com, so every URL is kept\n`);
  // site.config.json routes: destinations + statics (guides and blog come from collectionRoutes)
  const staticRoutes = [...new Set([...Object.keys(STATIC), ...ledger.filter((r) => ["region", "country", "city"].includes(r[9])).map((r) => r[0])])];
  const cfgPath = join(root, "site.config.json");
  const cfg = existsSync(cfgPath) ? JSON.parse(readFileSync(cfgPath, "utf8")) : {};
  writeFileSync(cfgPath, JSON.stringify({ name: "Nomad Terminal", editorialName: EDITORIAL, origin: "https://nomadterminal.com", trailingSlash: "always", collectionRoutes: { guides: "/guides/", blog: "/blog/" }, ...cfg, staticRoutes, checkLinks: true }, null, 2) + "\n");
  writeFileSync(join(root, "src/data/photos-needed.json"), JSON.stringify([...photos].sort(), null, 2) + "\n");
  const by = (k: string) => ledger.filter((r) => r[1] === k).length;
  console.log(JSON.stringify({ ...stats, ledger: ledger.length, keep: by("keep"), liveSitemap: liveUrls.length, missingFromBuild, extraInBuild, photos: photos.size, swaps, draftRows }, null, 1));

  async function loadDraftHero(slug: string) {
    // draft heroes are defined in the drafts checkout's media.ts; reload it there
    const m = await loadNomadData(draftsRepo);
    return m.blogHeroes[slug];
  }
}
main();
