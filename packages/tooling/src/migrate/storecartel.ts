/**
 * StoreCartel content export (Job M, Step 1). Adapted from vibe.ts: the old storeforge repo shares Vibe's code shape.
 * usage: node --experimental-strip-types src/migrate/storecartel.ts --repo <old repo> --site <sites/storecartel>
 * Emits MDX (guides, reviews, best-of hubs), data JSON, content-ledger.csv and public/_redirects.
 * Body text is the old strings; only mechanical normalisation is applied (link form, /go/ rewrite, year stripped from titles,
 * over-long titles and descriptions shortened at a word boundary). Nothing is retyped by hand.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { build } from "esbuild";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { PRICE_RE } from "@portfolio/schema";
import { csvCell } from "../util.ts";
import { STATIC_PAGES } from "./storecartel-ledger.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "C:/Users/michael/Projects/Websites/storeforge");
const site = opt("--site", "sites/storecartel");
const EDITORIAL = "StoreCartel editorial";
const TODAY = "2026-09-29";

async function loadOld() {
  const r = (p: string) => JSON.stringify(join(repo, p));
  const out = await build({
    stdin: {
      contents: `
        export { guides } from ${r("src/data/guides.ts")};
        export { reviewArticles } from ${r("src/data/reviewArticles.ts")};
        export { hubs } from ${r("src/data/hubArticles.ts")};
        export { default as tools } from ${r("src/data/tools.json")};
        export { AFFILIATE_TOOL_IDS, PENDING_AFFILIATE_PROGRAMS } from ${r("src/lib/affiliates.ts")};
      `,
      resolveDir: repo, loader: "ts",
    },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  });
  const dir = mkdtempSync(join(tmpdir(), "sc-old-"));
  const file = join(dir, "old.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return (await import(pathToFileURL(file).href)) as {
    guides: any[]; reviewArticles: any[]; hubs: any[]; tools: any[]; AFFILIATE_TOOL_IDS: string[]; PENDING_AFFILIATE_PROGRAMS: string[];
  };
}

// ---------------------------------------------------------------- git dates
const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
const fileFirst = (file: string) => git(["log", "--diff-filter=A", "--format=%aI", "--", file]).split("\n").filter(Boolean).at(-1)?.slice(0, 10);
/** First commit in which the entry's id line appears in src (pickaxe). Falls back to the file's first commit. */
const pick = new Map<string, string[]>();
function firstSeen(needle: string, file: string): { date: string; approx: boolean } {
  let out = pick.get(needle);
  if (!out) { out = git(["log", "-S" + needle, "--format=%aI", "--reverse", "--", "src"]).split("\n").filter(Boolean); pick.set(needle, out); }
  if (out.length) return { date: out[0].slice(0, 10), approx: false };
  return { date: fileFirst(file) ?? "2026-07-01", approx: true };
}

// ------------------------------------------------------------ text helpers
/** Mechanical rewording of the few CONTENT_STANDARD banned words / testing claims that occur in the old text. */
function fix(s: string): string {
  return s
    .replace(/\bhighest-leverage\b/gi, (m) => (m[0] === "H" ? "Highest-impact" : "highest-impact"))
    .replace(/\bhigh[- ]leverage\b/gi, "high-impact")
    .replace(/\boperator leverage\b/g, "operator advantage")
    .replace(/\bunlocks as\b/g, "access as")
    .replace(/\bunlock (free shipping)/g, "earn $1")
    .replace(/\bunlock (customer-account)/g, "open $1")
    .replace(/\bunlocks (more)/g, "give $1")
    .replace(/\bunlock(s|ed|ing)?\b/g, (_m, x) => ({ s: "opens up", ed: "opened up", ing: "opening up" } as Record<string, string>)[x as string] ?? "open up")
    .replace(/\bleverag(e|es|ed|ing)\b/g, (_m, x) => ({ e: "use", es: "uses", ed: "used", ing: "using" } as Record<string, string>)[x as string])
    .replace(/\bhands-on work\b/g, "manual work")
    .replace(/\bSilent hands-on\b/g, "Silent demonstration")
    .replace(/\bhow hands-on you want to be\b/g, "how involved you want to be")
    .replace(/\bUnlock (full surfaces)/g, "Full surfaces:");
}
const esc = (s: string) =>
  fix(s).split(/(`[^`\n]*`)/).map((part, i) => (i % 2 ? part : part.replace(/([{}])/g, "\\$1").replace(/<(?=[a-zA-Z/!])/g, "\\<"))).join("");
const cell = (s: string) => esc(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
let TRACKED: [string, string][] = [];
function normLinks(s: string): string {
  return s
    .replace(/\]\((\/[^)\s#?]*?)(?<!\/)([?#][^)\s]*)?\)/g, (_m, p, tail) => `](${p === "" ? "/" : p}/${tail ?? ""})`)
    .replace(/\]\((https?:\/\/[^)\s]+)\)/g, (m, url) => {
      const t = TRACKED.find(([prefix]) => url.startsWith(prefix));
      return t ? `](/go/${t[1]}/)` : m;
    });
}
const P = (s: string) => normLinks(esc(s));
const wordsOf = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;

function extractSources(raw: string[], checked: string, approx: boolean) {
  const seen = new Map<string, { title: string; url: string; checked: string; approx?: boolean }>();
  for (const text of raw)
    for (const m of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
      const url = m[2].replace(/[.,;]$/, "");
      if (TRACKED.some(([p]) => url.startsWith(p)) || /storecartel\.com/.test(url)) continue;
      if (!seen.has(url)) seen.set(url, { title: m[1].replace(/\*+/g, "").trim(), url, checked, ...(approx ? { approx: true } : {}) });
    }
  return [...seen.values()];
}
function monthToIso(s?: string): string | null {
  const m = s && /([A-Za-z]+)\s+(\d{4})/.exec(s);
  if (!m) return null;
  const mo = ["january","february","march","april","may","june","july","august","september","october","november","december"].indexOf(m[1].toLowerCase());
  return mo < 0 ? null : `${m[2]}-${String(mo + 1).padStart(2, "0")}-01`;
}

/** Mechanical shortening at a word boundary (never mid-word); prefers a sentence or clause boundary. */
function shorten(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max + 1);
  const punct = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "), cut.lastIndexOf(": "), cut.lastIndexOf(" - "), cut.lastIndexOf(", "), cut.lastIndexOf(" ("));
  if (punct > max * 0.55) return cut.slice(0, punct).replace(/[,;:\s-]+$/, "").replace(/\.$/, "") + (cut[punct] === "." ? "." : "");
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s-]+$/, "");
}
/** Remove a year from a title, including the preposition that introduced it ("in 2026", "for 2026"). */
function noYear(t: string): string {
  return t
    .replace(/\s*[(\[]\s*20\d\d\s*[)\]]/g, "")
    .replace(/\s+(?:in|for|of|to|by)\s+20\d\d\b/gi, "")
    .replace(/\b20\d\d\s*[:|]\s*/g, "")
    .replace(/\s*\b20\d\d\b/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([:|,?!.])/g, "$1")
    .replace(/^[\s:|,-]+|[\s:|,-]+$/g, "")
    .replace(/\s+/g, " ").trim();
}
/** Title rules: no year unless an update log exists; at most 60 characters. */
function cleanTitle(t: string): string {
  let s = noYear(t);
  if (s.length > 60) {
    const parts = s.split(/\s[|–-]\s|:\s/);
    // drop trailing clause segments until it fits
    while (parts.length > 1 && parts.join(": ").length > 60) parts.pop();
    s = parts.join(": ");
    if (s.length > 60) s = shorten(s, 60);
  }
  return s;
}
const stripYear = noYear;
function targetQuery(seoTitle: string, override?: string): { q: string; source: string } {
  if (override) return { q: override, source: "brief" };
  const q = noYear(seoTitle).split(/[:|]|\s[-–]\s/)[0].replace(/\(.*?\)/g, "").replace(/[()]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  return { q, source: "derived" };
}
const BRIEF_QUERIES: Record<string, string> = {
  "guides/best-dropshipping-product-research-tools": "best dropshipping product research tools",
  "best/best-product-research-tools-2026": "best product research tools",
};

function frontmatterText(fm: Record<string, unknown>): string {
  return YAML.stringify(fm, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date): (\d{4}-\d\d-\d\d\S*)$/gm, '$1$2: "$3"');
}

// ----------------------------------------------------------- body renderers
let TOOLS: any[] = [];
let LIVE = new Set<string>();
/** Owner rule: the Shopify CTA appears only on platform-choice pages. Other tools keep their contextual section CTA. */
const PLATFORM_PAGES = new Set(["guides/how-to-start-an-online-store-2026", "guides/shopify-vs-wix-vs-bigcommerce", "best/best-ecommerce-platforms-for-dropshipping-2026"]);
let PAGE_KEY = "";
let droppedShopifyCtas = 0;
function ctaLine(cta: { toolId: string; label?: string }): string {
  const t = TOOLS.find((x) => x.id === cta.toolId);
  if (!t) return "";
  if (t.id === "shopify" && !PLATFORM_PAGES.has(PAGE_KEY)) { droppedShopifyCtas++; return ""; }
  const label = cta.label ?? `Try ${t.name}`;
  return LIVE.has(t.id) ? `[${esc(label)}](/go/${t.id}/)` : `[${esc(label)}](${t.referralUrl})`;
}
function renderSection(s: any, uses: { callout: boolean }): string {
  const out: string[] = [`## ${esc(s.heading)}`];
  for (const p of s.paragraphs ?? []) out.push(P(p));
  if (s.steps?.length) out.push(s.steps.map((st: any, i: number) => `${i + 1}. **${esc(st.title)}**: ${P(st.detail)}`).join("\n"));
  if (s.bullets?.length) out.push(s.bullets.map((b: any) => (typeof b === "string" ? `- ${P(b)}` : `- **${esc(b.label)}** ${P(b.text)}`)).join("\n"));
  if (s.code) out.push("```" + (s.code.lang ?? "") + "\n" + s.code.content.replace(/\n$/, "") + "\n```");
  if (s.table) {
    const t = s.table;
    out.push([`| ${t.headers.map(cell).join(" | ")} |`, `| ${t.headers.map(() => "---").join(" | ")} |`, ...t.rows.map((r: string[]) => `| ${r.map((c) => normLinks(cell(c))).join(" | ")} |`)].join("\n"));
    if (t.caption) out.push(`*${P(t.caption)}*`);
  }
  if (s.callout) { uses.callout = true; out.push(`<Callout type="${s.callout.type}">\n\n${P(s.callout.text)}\n\n</Callout>`); }
  if (s.cta) { const l = ctaLine(s.cta); if (l) out.push(l); }
  return out.join("\n\n");
}
const faqSection = (faqs: any[]) => `## Common questions\n\n` + faqs.map((f) => `### ${esc(f.question)}\n\n${P(f.answer)}`).join("\n\n");

function textPieces(g: any): string[] {
  const t: string[] = [...(g.intro ?? []), ...(g.keyTakeaways ?? []), ...(g.faqs ?? []).map((f: any) => f.answer), ...(g.verdict ?? [])];
  for (const s of g.sections ?? []) {
    t.push(...(s.paragraphs ?? []), ...(s.steps ?? []).map((x: any) => x.detail), ...(s.bullets ?? []).map((b: any) => (typeof b === "string" ? b : b.text)));
    if (s.table) t.push(...s.table.rows.flat(), s.table.caption ?? "");
    if (s.callout) t.push(s.callout.text);
  }
  return t;
}
const goIds = (md: string) => [...new Set([...md.matchAll(/\(\/go\/([a-z0-9-]+)\/\)/g)].map((m) => m[1]))];

async function main() {
  const d = await loadOld();
  TOOLS = d.tools;
  LIVE = new Set(d.AFFILIATE_TOOL_IDS);
  TRACKED = d.tools.filter((t: any) => LIVE.has(t.id)).map((t: any) => [t.referralUrl, t.id] as [string, string]);
  const root = site;
  for (const c of ["guides", "reviews", "best"]) { rmSync(join(root, "src/content", c), { recursive: true, force: true }); mkdirSync(join(root, "src/content", c), { recursive: true }); }
  mkdirSync(join(root, "src/data"), { recursive: true });
  const ledger: string[][] = [];
  const stats = { guides: 0, reviews: 0, hubs: 0, approxDates: 0 };
  const guideIds = new Set(d.guides.map((g: any) => g.id));
  const guideTitle = new Map(d.guides.map((g: any) => [g.id, g.title]));

  // ---- guides
  for (const g of d.guides) {
    PAGE_KEY = `guides/${g.id}`;
    const uses = { callout: false };
    const body: string[] = [];
    if (g.intro?.length) body.push(g.intro.map(P).join("\n\n"));
    for (const s of g.sections ?? []) body.push(renderSection(s, uses));
    if (g.keyTakeaways?.length) body.push(`## Key takeaways\n\n` + g.keyTakeaways.map((k: string) => `- ${P(k)}`).join("\n"));
    if (g.faqs?.length) body.push(faqSection(g.faqs));
    const md = (uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body.join("\n\n") + "\n";
    const seen = firstSeen(`id: "${g.id}"`, "src/data/guides.ts");
    const legacy = g.lastUpdated as string | undefined;
    const checked = monthToIso(legacy) ?? seen.date;
    const sources = extractSources(textPieces(g), checked, true);
    const hasPrices = PRICE_RE.test(textPieces(g).join("\n"));
    const tq = targetQuery(g.seoTitle, BRIEF_QUERIES[`guides/${g.id}`]);
    const fm: Record<string, unknown> = {
      title: cleanTitle(g.seoTitle), description: shorten(g.metaDescription, 155), slug: g.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}),
      ...(hasPrices ? { reviewEvery: "90d" } : {}), author: EDITORIAL, evidence: "research",
      sources, affiliates: goIds(md), category: g.category, relatedTools: g.relatedTools ?? [],
      ...(hasPrices && sources.length === 0 ? { needsSources: true } : {}), h1: stripYear(g.title),
    };
    writeFileSync(join(root, "src/content/guides", `${g.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.guides++; if (seen.approx) stats.approxDates++;
    ledger.push([`/guides/${g.id}/`, "keep", tq.q, "no GSC pages file: everything is keep", "", TODAY, "proposed", String(wordsOf(md)), String(!!fm.needsSources), "guide", legacy ?? "", seen.date, tq.source]);
  }

  // ---- reviews (full article, or tools.json fallback layout)
  const affiliateRows: any[] = [];
  const NETWORK: Record<string, string> = { shopify: "Impact", zendrop: "Impact", autods: "direct", "sell-the-trend": "direct", sellshop: "direct", printful: "direct", printify: "direct", gempages: "direct" };
  for (const t of d.tools) {
    const isLive = LIVE.has(t.id);
    affiliateRows.push({ id: t.id, programme: t.name, network: NETWORK[t.id] ?? "none", url: t.referralUrl, status: isLive ? "live" : d.PENDING_AFFILIATE_PROGRAMS.includes(t.id) ? "pending" : "none" });
    const a = d.reviewArticles.find((r: any) => r.toolId === t.id);
    PAGE_KEY = `reviews/${t.id}`;
    const uses = { callout: false };
    const body: string[] = [];
    let seoTitle: string, metaDescription: string, legacy: string | undefined, pieces: string[];
    if (a) {
      seoTitle = a.seoTitle; metaDescription = a.metaDescription; legacy = a.lastUpdated;
      body.push(P(a.heroSummary));
      body.push(`**Best for:** ${P(a.bestFor)}\n\n**Not ideal for:** ${P(a.notFor)}`);
      body.push(a.intro.map(P).join("\n\n"));
      for (const s of a.sections) body.push(renderSection(s, uses));
      body.push(`## Pricing\n\n${P(a.pricing.intro)}\n\n| Plan | Price | What it includes |\n| --- | --- | --- |\n` +
        a.pricing.tiers.map((x: any) => `| ${cell(x.name)} | ${cell(x.price + (x.period ? " " + x.period : ""))} | ${cell([x.blurb, ...x.features].filter(Boolean).join("; "))} |`).join("\n") + (a.pricing.note ? `\n\n${P(a.pricing.note)}` : ""));
      body.push(`## Pros and cons\n\n**Pros**\n\n${a.pros.map((x: string) => `- ${P(x)}`).join("\n")}\n\n**Cons**\n\n${a.cons.map((x: string) => `- ${P(x)}`).join("\n")}`);
      if (a.keyTakeaways?.length) body.push(`## Key takeaways\n\n` + a.keyTakeaways.map((k: string) => `- ${P(k)}`).join("\n"));
      body.push(faqSection(a.faqs));
      body.push(`## Verdict\n\n${a.verdict.map(P).join("\n\n")}`);
      pieces = [a.heroSummary, a.bestFor, a.notFor, ...a.intro, ...a.verdict, a.pricing.intro, a.pricing.note ?? "", ...a.pros, ...a.cons, ...(a.keyTakeaways ?? []), ...a.faqs.map((f: any) => f.answer), ...a.pricing.tiers.flatMap((x: any) => [x.price, x.blurb ?? "", ...x.features]),
        ...a.sections.flatMap((s: any) => [...(s.paragraphs ?? []), ...(s.bullets ?? []).map((b: any) => b.text)])];
    } else {
      seoTitle = `${t.name} Review: ${t.tagline}`; metaDescription = t.description; legacy = undefined;
      body.push(P(t.description));
      if (t.idealFor) body.push(`**Best for:** ${P(t.idealFor)}`);
      body.push(`## Strengths\n\n${t.strengths.map((x: string) => `- ${P(x)}`).join("\n")}`);
      body.push(`## Weaknesses\n\n${t.weaknesses.map((x: string) => `- ${P(x)}`).join("\n")}`);
      body.push(`## Pricing\n\n${P(t.pricing)}`);
      if (t.verdict) body.push(`## Verdict\n\n${P(t.verdict)}`);
      pieces = [t.description, t.idealFor ?? "", ...t.strengths, ...t.weaknesses, t.pricing, t.verdict ?? ""];
    }
    const md = (uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body.join("\n\n") + "\n";
    const seen = firstSeen(a ? `toolId: "${t.id}"` : `"id": "${t.id}"`, a ? "src/data/reviewArticles.ts" : "src/data/tools.json");
    const checked = monthToIso(legacy) ?? seen.date;
    const sources = extractSources(pieces, checked, true);
    const tq = targetQuery(seoTitle);
    const needs = sources.length === 0;
    const fm: Record<string, unknown> = {
      title: cleanTitle(seoTitle), description: shorten(metaDescription, 155), slug: t.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}), reviewEvery: "90d", author: EDITORIAL, evidence: "research",
      sources, affiliates: isLive ? [t.id] : [], category: t.category, relatedTools: [t.id], ...(needs ? { needsSources: true } : {}), h1: `${t.name} Review`,
    };
    writeFileSync(join(root, "src/content/reviews", `${t.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.reviews++; if (seen.approx) stats.approxDates++;
    ledger.push([`/reviews/${t.id}/`, "keep", tq.q, "no GSC pages file: everything is keep; ratings and Review schema removed", "", TODAY, "proposed", String(wordsOf(md)), String(needs), a ? "review" : "review-thin", legacy ?? "", seen.date, tq.source]);
  }

  // ---- best-of hubs
  for (const h of d.hubs) {
    PAGE_KEY = `best/${h.id}`;
    const uses = { callout: false };
    const body: string[] = [];
    body.push(h.intro.map(P).join("\n\n"));
    if (h.criteria?.length) body.push(`## How the shortlist was ranked\n\n` + h.criteria.map((c: string) => `- ${P(c)}`).join("\n"));
    const picks = [...h.picks].sort((x: any, y: any) => x.rank - y.rank);
    body.push(`## The shortlist\n\n| Rank | Tool | Positioning | Best for |\n| --- | --- | --- | --- |\n` +
      picks.map((p: any) => { const t = TOOLS.find((x) => x.id === p.toolId); return `| ${p.rank} | [${cell(t?.name ?? p.toolId)}](/reviews/${p.toolId}/) | ${cell(p.badge)} | ${cell(p.bestFor)} |`; }).join("\n"));
    for (const p of picks) {
      const t = TOOLS.find((x) => x.id === p.toolId);
      body.push(`### ${p.rank}. ${esc(t?.name ?? p.toolId)}: ${esc(p.badge)}\n\n${P(p.why)}\n\n**Best for:** ${P(p.bestFor)}\n\n[Read the ${esc(t?.name ?? p.toolId)} review](/reviews/${p.toolId}/)`);
    }
    for (const s of h.sections ?? []) {
      body.push(`## ${esc(s.heading)}\n\n${(s.paragraphs ?? []).map(P).join("\n\n")}` + (s.bullets?.length ? `\n\n${s.bullets.map((b: string) => `- ${P(b)}`).join("\n")}` : ""));
    }
    if (h.keyTakeaways?.length) body.push(`## Key takeaways\n\n` + h.keyTakeaways.map((k: string) => `- ${P(k)}`).join("\n"));
    if (h.faqs?.length) body.push(faqSection(h.faqs));
    const rel = (h.relatedGuides ?? []).filter((id: string) => guideIds.has(id));
    if (rel.length) body.push(`## Further reading\n\n` + rel.map((id: string) => `- [${esc(guideTitle.get(id) as string)}](/guides/${id}/)`).join("\n"));
    const md = body.join("\n\n") + "\n";
    const seen = firstSeen(`id: "${h.id}"`, "src/data/hubArticles.ts");
    const legacy = h.lastUpdated as string | undefined;
    const checked = monthToIso(legacy) ?? seen.date;
    const pieces = [...h.intro, ...(h.criteria ?? []), ...h.picks.flatMap((p: any) => [p.why, p.bestFor, p.badge]), ...(h.sections ?? []).flatMap((s: any) => [...s.paragraphs, ...(s.bullets ?? [])]), ...(h.keyTakeaways ?? []), ...(h.faqs ?? []).map((f: any) => f.answer)];
    const sources = extractSources(pieces, checked, true);
    const hasPrices = PRICE_RE.test(pieces.join("\n"));
    const tq = targetQuery(h.seoTitle, BRIEF_QUERIES[`best/${h.id}`]);
    const fm: Record<string, unknown> = {
      title: cleanTitle(h.seoTitle), description: shorten(h.metaDescription, 155), slug: h.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}),
      ...(hasPrices ? { reviewEvery: "90d" } : {}), author: EDITORIAL, evidence: "research",
      sources, affiliates: goIds(md), category: h.category, relatedTools: picks.map((p: any) => p.toolId),
      ...(hasPrices && sources.length === 0 ? { needsSources: true } : {}), h1: stripYear(h.title),
    };
    writeFileSync(join(root, "src/content/best", `${h.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.hubs++; if (seen.approx) stats.approxDates++;
    ledger.push([`/best/${h.id}/`, "keep", tq.q, "no GSC pages file: everything is keep (overlap with a guide is proposed in LEDGER_REVIEW.md, not applied)", "", TODAY, "proposed", String(wordsOf(md)), String(!!fm.needsSources), "hub", legacy ?? "", seen.date, tq.source]);
  }

  // ---- static pages (hand-built in the design step; listed so the parity gate sees them)
  for (const sp of STATIC_PAGES) ledger.push([sp.url, "keep", "", sp.reason, "", TODAY, "proposed", "", "", sp.kind, "", "", ""]);

  // ---- data files
  const tools = d.tools.map(({ rating, referralUrl, ...rest }: any) => ({ ...rest, vendorUrl: LIVE.has(rest.id) ? undefined : referralUrl }));
  writeFileSync(join(root, "src/data/tools.json"), JSON.stringify(tools, null, 2) + "\n");
  writeFileSync(join(root, "src/data/affiliates.json"), JSON.stringify(affiliateRows, null, 2) + "\n");

  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_last_updated", "published", "target_query_source"];
  writeFileSync(join(root, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  const redirectLines = ledger.filter((r) => r[1] !== "keep" && r[4]).map((r) => `${r[0]} ${r[4]} 301`).sort();
  writeFileSync(join(root, "public/_redirects"), `# generated from content-ledger.csv by packages/tooling/src/migrate/storecartel.ts; do not edit\n${redirectLines.join("\n")}\n# old flat sitemap URL (submitted in Search Console)\n/sitemap.xml /sitemap-index.xml 301\n`);
  const by = (k: string) => ledger.filter((r) => r[1] === k).length;
  console.log(JSON.stringify({ ...stats, droppedShopifyCtas, ledger: ledger.length, keep: by("keep"), merge: by("merge"), cut: by("cut") }));
}
main();
