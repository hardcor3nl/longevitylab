/**
 * SmartBikeWiki content export (Job M step 1 and 2).
 * usage: node --experimental-strip-types src/migrate/smartbike.ts --repo <old repo> --site <sites/smartbikewiki> --db <trainer-database.json>
 * Emits MDX (guides, reviews), data JSON, content-ledger.csv, _redirects. Never retypes content:
 * body text is the old strings, with mechanical link normalisation only. Scores are dropped (owner rule: no scores).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import YAML from "yaml";
import { PRICE_RE } from "@portfolio/schema";
import { csvCell } from "../util.ts";
import { fixDesc, fixTitle, lintFixBody } from "./smartbike-fix.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "C:/Users/michael/Projects/Websites/smartbikewiki");
const site = opt("--site", "sites/smartbikewiki");
const dbFile = opt("--db", "data/smartbikewiki/trainer-database/trainer-database.json");
const EDITORIAL = "SmartBikeWiki editorial";
const DATE = "2026-09-29";

/** review page id -> database record id (only where the database has the same product). */
export const REVIEW_DB: Record<string, string> = {
  "wahoo-kickr-bike-pro": "wahoo-kickr-bike-pro",
  "wahoo-kickr-bike-shift": "wahoo-kickr-bike-shift",
  "zwift-ride": "zwift-ride-kickr-core-2",
  "wahoo-kickr-v6": "wahoo-kickr-v6",
  "wahoo-kickr-core-2": "wahoo-kickr-core-2",
  "tacx-neo-2t": "tacx-neo-2t",
  "tacx-neo-3m": "tacx-neo-3m",
  "jetblack-victory": "jetblack-victory",
  "saris-h3": "saris-h3-plus",
};
/** amzn.to links are real tracked Amazon Associates links on the old site. */
const AMZN = /^https:\/\/amzn\.to\//;

const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
const fileFirst = (file: string) => git(["log", "--diff-filter=A", "--format=%aI", "--", file]).split("\n").filter(Boolean).at(-1)?.slice(0, 10);
function firstSeen(needle: string, file: string): { date: string; approx: boolean } {
  const out = git(["log", "-S" + needle, "--format=%aI", "--reverse", "--", "src"]).split("\n").filter(Boolean);
  if (out.length) return { date: out[0].slice(0, 10), approx: false };
  return { date: fileFirst(file) ?? "2026-07-01", approx: true };
}

const esc = (s: string) =>
  s.split(/(`[^`\n]*`)/).map((part, i) => (i % 2 ? part : part.replace(/([{}])/g, "\\$1").replace(/<(?=[a-zA-Z/!])/g, "\\<"))).join("");
const cell = (s: string) => esc(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
/** Two old relatedGuides links point at guides that never existed; repointed to the guide that covers the topic (logged in LEDGER_REVIEW). */
const LINK_FIX: Record<string, string> = { "/guides/cassette-freehub-compatibility": "/guides/cassette-freehub-guide", "/guides/shared-smart-bike-setup": "/guides/shared-indoor-cycling-setup" };
function normLinks(s: string): string {
  for (const [from, to] of Object.entries(LINK_FIX)) s = s.split("](" + from + ")").join("](" + to + ")");
  return s
    .replace(/\]\((\/[^)\s#?]*?)(?<!\/)([?#][^)\s]*)?\)/g, (_m, p, tail) => `](${p === "" ? "/" : p}/${tail ?? ""})`)
    .replace(/\]\((https?:\/\/[^)\s]+)\)/g, (m, url) => (AMZN.test(url) ? "](/go/amazon/)" : m));
}
const P = (s: string) => normLinks(esc(s));
const wordsOf = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;
function monthToIso(s?: string): string | null {
  const m = s && /([A-Za-z]+)\s+(\d{4})/.exec(s);
  if (!m) return null;
  const mo = ["january","february","march","april","may","june","july","august","september","october","november","december"].indexOf(m[1].toLowerCase());
  return mo < 0 ? null : `${m[2]}-${String(mo + 1).padStart(2, "0")}-01`;
}
function extractSources(raw: string[], checked: string, approx: boolean) {
  const seen = new Map<string, { title: string; url: string; checked: string; approx?: boolean }>();
  for (const text of raw)
    for (const m of text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
      const url = m[2].replace(/[.,;]$/, "");
      if (AMZN.test(url) || /smartbikewiki\.com/.test(url)) continue;
      if (!seen.has(url)) seen.set(url, { title: m[1].replace(/\*+/g, "").trim(), url, checked, ...(approx ? { approx: true } : {}) });
    }
  return [...seen.values()];
}
const frontmatterText = (fm: Record<string, unknown>) =>
  YAML.stringify(fm, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date): (\d{4}-\d\d-\d\d\S*)$/gm, '$1$2: "$3"');

function targetQuery(id: string, seoTitle: string): { q: string; source: string } {
  const brief: Record<string, string> = {
    "reviews/zwift-ride": "zwift ride", "reviews/wahoo-kickr-bike-shift": "wahoo kickr bike shift review",
    "guides/best-smart-bikes-2026": "smart bike", "guides/smart-bike-vs-trainer": "smart bike vs trainer",
    "guides/trainer-maintenance-noise": "smart bike maintenance", "guides/smart-trainer-power-accuracy": "smart trainer power accuracy",
    "guides/smart-trainer-calibration-spindown": "smart trainer spindown calibration", "guides/erg-mode-explained": "erg mode explained",
    "guides/zone-2-training-smart-trainer": "zone 2 training smart trainer",
    "guides/aerobic-decoupling-heart-rate-drift-cycling": "aerobic decoupling cycling",
  };
  if (brief[id]) return { q: brief[id], source: "brief" };
  const q = seoTitle.split(/[:|(]|\s[-–]\s/)[0].replace(/\b20\d\d\b/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  return { q, source: "derived" };
}

function renderSection(s: any, uses: { callout: boolean }): string {
  const out: string[] = [`## ${esc(s.heading)}`];
  for (const p of s.paragraphs ?? []) out.push(P(p));
  if (s.steps?.length) out.push(s.steps.map((st: any, i: number) => `${i + 1}. **${esc(st.title)}**: ${P(st.detail)}`).join("\n"));
  if (s.bullets?.length) out.push(s.bullets.map((b: any) => (typeof b === "string" ? `- ${P(b)}` : `- **${esc(b.label)}** ${P(b.text)}`)).join("\n"));
  if (s.table) {
    const t = s.table;
    out.push([`| ${t.headers.map(cell).join(" | ")} |`, `| ${t.headers.map(() => "---").join(" | ")} |`, ...t.rows.map((r: string[]) => `| ${r.map((c) => normLinks(cell(c))).join(" | ")} |`)].join("\n"));
    if (t.caption) out.push(`*${P(t.caption)}*`);
  }
  if (s.callout) {
    uses.callout = true;
    out.push(`<Callout type="${s.callout.type}">\n\n${P(s.callout.text)}\n\n</Callout>`);
  }
  return out.join("\n\n");
}
const faqSection = (faqs: any[]) => `## Common questions\n\n` + faqs.map((f) => `### ${esc(f.question)}\n\n${P(f.answer)}`).join("\n\n");

function textPieces(g: any): string[] {
  const t: string[] = [...(g.intro ?? []), ...(g.fastSummary ?? []), ...(g.keyTakeaways ?? []), ...(g.faqs ?? []).map((f: any) => f.answer), ...(g.verdict ?? [])];
  for (const s of g.sections ?? []) {
    t.push(...(s.paragraphs ?? []), ...(s.steps ?? []).map((x: any) => x.detail), ...(s.bullets ?? []).map((b: any) => (typeof b === "string" ? b : b.text)));
    if (s.table) t.push(...s.table.rows.flat(), s.table.caption ?? "");
    if (s.callout) t.push(s.callout.text);
  }
  return t;
}


async function loadOld() {
  const r = (p: string) => JSON.stringify(join(repo, p));
  const out = await build({
    stdin: {
      contents: `export { guides } from ${r("src/data/guides.ts")}; export { reviewArticles } from ${r("src/data/reviewArticles.ts")};
        export { default as products } from ${r("src/data/products.json")}; export { default as affiliates } from ${r("src/data/affiliates.json")};`,
      resolveDir: repo, loader: "ts",
    },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  });
  const f = join(mkdtempSync(join(tmpdir(), "sbw-old-")), "old.mjs");
  writeFileSync(f, out.outputFiles[0].text);
  return (await import(pathToFileURL(f).href)) as { guides: any[]; reviewArticles: any[]; products: any[]; affiliates: any };
}

/** Glossary terms live inside a TSX component; the array literal is plain JS, so read and evaluate just that. */
function loadGlossary() {
  const src = readFileSync(join(repo, "src/pages/Glossary.tsx"), "utf8");
  const m = /const TERMS[^=]*=\s*(\[[\s\S]*?\n\]);/.exec(src);
  if (!m) throw new Error("glossary array not found");
  return new Function(`return ${m[1]}`)() as { term: string; def: string; seeAlso?: { label: string; to: string } }[];
}

export const STATIC_PAGES: { url: string; reason: string }[] = [
  { url: "/", reason: "home (rebuilt)" }, { url: "/reviews/", reason: "reviews hub" }, { url: "/guides/", reason: "guides hub" },
  { url: "/compare/", reason: "compare tool island" }, { url: "/about/", reason: "about and method" }, { url: "/glossary/", reason: "glossary" },
  { url: "/affiliate-disclosure/", reason: "legal" }, { url: "/privacy/", reason: "legal" },
  { url: "/reviews/smart-bikes/", reason: "review category hub" }, { url: "/reviews/trainers/", reason: "review category hub" },
  { url: "/reviews/apps/", reason: "review category hub" }, { url: "/reviews/accessories/", reason: "review category hub" },
  { url: "/guides/getting-started/", reason: "guide category hub" }, { url: "/guides/buying-guides/", reason: "guide category hub" },
  { url: "/guides/setup/", reason: "guide category hub" }, { url: "/guides/training/", reason: "guide category hub" },
  { url: "/guides/comparisons/", reason: "guide category hub" }, { url: "/guides/roundups/", reason: "guide category hub" },
  { url: "/guides/maintenance/", reason: "guide category hub" },
];

async function main() {
  const d = await loadOld();
  const db = JSON.parse(readFileSync(dbFile, "utf8"));
  const root = site;
  for (const c of ["guides", "reviews"]) { rmSync(join(root, "src/content", c), { recursive: true, force: true }); mkdirSync(join(root, "src/content", c), { recursive: true }); }
  mkdirSync(join(root, "src/data"), { recursive: true });
  mkdirSync(join(root, "public"), { recursive: true });
  const ledger: string[][] = [];
  const stats = { guides: 0, reviews: 0, approxDates: 0 };

  // ---- guides
  for (const g of d.guides) {
    const uses = { callout: false };
    const body: string[] = [];
    if (g.fastSummary?.length) body.push(`## Short answer\n\n` + g.fastSummary.map((k: string) => `- ${P(k)}`).join("\n"));
    if (g.intro?.length) body.push(g.intro.map(P).join("\n\n"));
    for (const s of g.sections ?? []) body.push(renderSection(s, uses));
    if (g.keyTakeaways?.length) body.push(`## Key takeaways\n\n` + g.keyTakeaways.map((k: string) => `- ${P(k)}`).join("\n"));
    if (g.faqs?.length) body.push(faqSection(g.faqs));
    if (g.relatedGuides?.length) body.push(`## Related guides\n\n` + g.relatedGuides.map((l: any) => `- [${esc(l.label)}](${normLinks(`](${l.to})`).slice(2, -1)})`).join("\n"));
    const md = lintFixBody((uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body.join("\n\n") + "\n");
    const seen = firstSeen(`id: "${g.id}"`, "src/data/guides.ts");
    const checked = monthToIso(g.lastUpdated) ?? seen.date;
    const listed = (g.sources ?? []).map((s: any) => ({ title: [s.label, s.publisher].filter(Boolean).join(", "), url: s.url, checked, approx: true }));
    const inline = extractSources(textPieces(g), checked, true);
    const sources = [...new Map([...listed, ...inline].map((s) => [s.url, s])).values()];
    const hasPrices = PRICE_RE.test(md);
    const tq = targetQuery(`guides/${g.id}`, g.seoTitle);
    const fm: Record<string, unknown> = {
      title: fixTitle(g.seoTitle), description: fixDesc(g.metaDescription), slug: g.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}),
      ...(hasPrices ? { reviewEvery: "90d" } : {}), author: EDITORIAL, evidence: "research",
      sources, category: g.category, relatedTools: g.relatedProducts ?? [],
      ...(hasPrices && sources.length === 0 ? { needsSources: true } : {}), h1: g.title, readTime: g.readTime,
    };
    writeFileSync(join(root, "src/content/guides", `${g.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.guides++; if (seen.approx) stats.approxDates++;
    ledger.push([`/guides/${g.id}/`, "keep", tq.q, "no GSC pages file: no cuts or merges proposed; rebuild on sourced data", "", DATE, "proposed", String(wordsOf(md)), String(!!fm.needsSources), "guide", g.lastUpdated ?? "", seen.date, tq.source]);
  }

  // ---- reviews
  const affiliateRows: any[] = [];
  const affMap = d.affiliates.links as Record<string, string>;
  const products = d.products.map(({ rating, referralUrl, ...rest }: any) => ({ ...rest, vendorUrl: referralUrl }));
  for (const id of Object.keys(affMap)) if (AMZN.test(affMap[id])) affiliateRows.push({ id: `amazon-${id}`, product: id, programme: "Amazon Associates", network: "Amazon", url: affMap[id], status: "live" });
  for (const p of d.products) {
    const a = d.reviewArticles.find((r: any) => r.productId === p.id);
    if (!a) throw new Error("no article for " + p.id);
    const uses = { callout: false };
    const dbId = REVIEW_DB[p.id];
    const rec = dbId ? db.find((r: any) => r.id === dbId) : undefined;
    const body: string[] = [];
    body.push(P(a.heroSummary));
    body.push(`## Who it suits\n\n**Best for:** ${P(a.bestFor)}\n\n**Not ideal for:** ${P(a.notFor)}`);
    body.push(a.intro.map(P).join("\n\n"));
    for (const s of a.sections) body.push(renderSection(s, uses));
    if (a.keyTakeaways?.length) body.push(`## Key takeaways\n\n` + a.keyTakeaways.map((k: string) => `- ${P(k)}`).join("\n"));
    if (!rec) {
      body.push(`## Pricing\n\n${P(a.pricing.intro)}\n\n| Plan | Price | What it includes |\n| --- | --- | --- |\n` +
        a.pricing.tiers.map((x: any) => `| ${cell(x.name)} | ${cell(x.price + (x.period ? " " + x.period : ""))} | ${cell([x.blurb, ...x.features].filter(Boolean).join("; "))} |`).join("\n") + (a.pricing.note ? `\n\n${P(a.pricing.note)}` : ""));
    }
    body.push(`## Trade-offs\n\n**In its favour**\n\n${a.pros.map((x: string) => `- ${P(x)}`).join("\n")}\n\n**Against**\n\n${a.cons.map((x: string) => `- ${P(x)}`).join("\n")}`);
    body.push(faqSection(a.faqs));
    body.push(`## Bottom line\n\n${a.verdict.map(P).join("\n\n")}`);
    const pieces = [a.heroSummary, a.bestFor, a.notFor, ...a.intro, ...a.verdict, ...(rec ? [] : [a.pricing.intro, a.pricing.note ?? ""]), ...a.pros, ...a.cons, ...a.faqs.map((f: any) => f.answer),
      ...a.sections.flatMap((s: any) => [...(s.paragraphs ?? []), ...(s.bullets ?? []).map((b: any) => b.text), ...(s.table?.rows.flat() ?? [])])];
    const md = lintFixBody((uses.callout ? `import Callout from "@portfolio/core/components/Callout.astro";\n\n` : "") + body.join("\n\n") + "\n");
    const seen = firstSeen(`productId: "${p.id}"`, "src/data/reviewArticles.ts");
    const checked = monthToIso(a.lastUpdated) ?? seen.date;
    const dbSources = rec ? rec.sources.map((u: string) => ({ title: sourceTitle(u), url: u, checked: rec.checked })) : [];
    const inline = extractSources(pieces, checked, true);
    const sources = [...new Map([...dbSources, ...inline].map((s) => [s.url, s])).values()];
    const tq = targetQuery(`reviews/${p.id}`, a.seoTitle);
    const isAff = !!affMap[p.id] && AMZN.test(affMap[p.id]);
    const fm: Record<string, unknown> = {
      title: fixTitle(a.seoTitle), description: fixDesc(a.metaDescription), slug: p.id, targetQuery: tq.q,
      published: seen.date, ...(seen.approx ? { publishedApprox: true } : {}), reviewEvery: "90d", author: EDITORIAL,
      evidence: rec ? "compiled-data" : "research", sources, affiliates: isAff ? [`amazon-${p.id}`] : [],
      category: p.category, relatedTools: [p.id, ...(a.alternatives ?? [])], ...(sources.length === 0 ? { needsSources: true } : {}),
      h1: p.name, readTime: a.readTime, ...(dbId ? { dbId } : {}),
    };
    writeFileSync(join(root, "src/content/reviews", `${p.id}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.reviews++; if (seen.approx) stats.approxDates++;
    ledger.push([`/reviews/${p.id}/`, "keep", tq.q, rec ? "no GSC pages file: keep; rebuilt as database-backed product page" : "no GSC pages file: keep; no database record yet, old research retained", "", DATE, "proposed", String(wordsOf(md)), String(sources.length === 0 && PRICE_RE.test(md)), rec ? "review-db" : "review", a.lastUpdated ?? "", seen.date, tq.source]);
  }
  for (const sp of STATIC_PAGES) ledger.push([sp.url, "keep", "", sp.reason, "", DATE, "proposed", "", "", "static", "", "", ""]);
  ledger.push(["/database/", "keep", "smart trainer database", "NEW page: link-earning asset, audited dataset data/smartbikewiki/trainer-database", "", DATE, "proposed", "", "", "static-new", "", "", ""]);

  // ---- data files
  writeFileSync(join(root, "src/data/products.json"), JSON.stringify(products, null, 2) + "\n");
  writeFileSync(join(root, "src/data/affiliates.json"), JSON.stringify(affiliateRows, null, 2) + "\n");
  writeFileSync(join(root, "src/data/review-db-map.json"), JSON.stringify(REVIEW_DB, null, 2) + "\n");
  writeFileSync(join(root, "src/data/glossary.json"), JSON.stringify(loadGlossary(), null, 2) + "\n");
  for (const f of ["trainer-database.json", "METHOD.md", "CHANGELOG.md", "GAPS.md"]) writeFileSync(join(root, "src/data", f), readFileSync(join(dbFile, "..", f)));
  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_last_updated", "published", "target_query_source"];
  writeFileSync(join(root, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  writeFileSync(join(root, "public/_redirects"), `# generated from content-ledger.csv by packages/tooling/src/migrate/smartbike.ts; do not edit\n# no merges or cuts (no GSC pages file): nothing redirects\n`);
  console.log(JSON.stringify({ ...stats, ledger: ledger.length }));
}
function sourceTitle(u: string): string {
  const host = new URL(u).hostname.replace(/^www\./, "");
  const map: Record<string, string> = { "dcrainmaker.com": "DC Rainmaker review", "wahoofitness.com": "Wahoo product page", "elite-it.com": "Elite product page", "saris.com": "Saris product page", "wattbike.com": "Wattbike product page", "us.zwift.com": "Zwift store page", "garmin.com": "Garmin", "jetblackcycling.com": "JetBlack" };
  return map[host] ?? host;
}
main();
