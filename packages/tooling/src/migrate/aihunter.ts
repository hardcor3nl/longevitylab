/**
 * AIHunterLabs content export.
 * usage: node --experimental-strip-types src/migrate/aihunter.ts --repo <old repo> --site <sites/aihunterlabs> --data <data/aihunterlabs/ai-content-tool-pricing>
 * Emits MDX (reviews, arena, blog), src/data JSON, content-ledger.csv, public/_redirects.
 * Body text is the old strings. Mechanical transforms only: link normalisation, MDX escaping, removal of
 * numeric-score sentences, word substitutions for banned phrases (each counted and logged).
 */
import { withTwins } from "../redirect-twins.ts";
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import YAML from "yaml";
import sharp from "sharp";
import { PRICE_RE } from "@portfolio/schema";
import { csvCell } from "../util.ts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const repo = opt("--repo", "C:/Users/michael/Projects/Websites/aihunterlabs");
const site = opt("--site", "../../sites/aihunterlabs");
const dataDir = opt("--data", "../../data/aihunterlabs/ai-content-tool-pricing");
const EDITORIAL = "AIHunterLabs editorial";
const TODAY = "2026-09-29";

const git = (a: string[]) => execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", maxBuffer: 1 << 28 }).trim();
const fileFirst = (file: string) => git(["log", "--diff-filter=A", "--format=%aI", "--", file]).split("\n").filter(Boolean).at(-1)?.slice(0, 10);
function firstSeen(needle: string, file: string): { date: string; approx: boolean } {
  const out = git(["log", "-S" + needle, "--format=%aI", "--reverse", "--", "src"]).split("\n").filter(Boolean);
  if (out.length) return { date: out[0].slice(0, 10), approx: false };
  return { date: fileFirst(file) ?? "2026-05-01", approx: true };
}

// ------------------------------------------------------------ text helpers
const subs: Record<string, number> = {};
const bump = (k: string) => (subs[k] = (subs[k] ?? 0) + 1);
const REPLACE: [RegExp, string][] = [
  [/\bseamless(ly)?\b/gi, "smooth$1"], [/\brobust\b/gi, "solid"],
  [/\bleverages\b/gi, "uses"], [/\bleveraged\b/gi, "used"], [/\bleveraging\b/gi, "using"], [/\bleverage\b/gi, "use"],
  [/\belevates\b/gi, "raises"], [/\belevated\b/gi, "raised"], [/\belevate\b/gi, "raise"],
  [/\bunlocks\b/gi, "opens up"], [/\bunlocked\b/gi, "opened up"], [/\bunlocking\b/gi, "opening up"], [/\bunlock\b/gi, "open up"],
  [/\bgame[- ]changer\b/gi, "big step"], [/\bin today's\b/gi, "in the current"], [/\bhands-on\b/gi, "practical"],
  [/\bin our experience\b/gi, "on the evidence"], [/\bdive in\b/gi, "start"], [/\bin conclusion\b/gi, "overall"], [/\bit's important to note\b/gi, "note"],
];
/** Sentences that carry a numeric score or claim of testing are dropped (owner rule: no N/10 scores, no testing claims). */
const DROP_SENTENCE = /\b\d+(\.\d+)?\s*(\/\s*10|out of 10|\/\s*5)\b|\bvalue score\b|\bscore of\b|\bwe (?:tested|used|ran|built|spent|compared)\b|\bwe've (?:tested|used)\b|\bin our (?:testing|tests|benchmark)\b|\bour benchmark\b|\bi tested\b|\b\d+[- ](?:day|month|week)s? (?:of|with|using)\b|\bafter (?:\d+|two|three|four|six) (?:days|weeks|months)\b/i;
function dropSentences(s: string): string {
  return s.split("\n").map((line) => {
    if (!line.trim() || /^\s*(#|\||```|---)/.test(line)) return line;
    const parts = line.split(/(?<=[.!?])(\s+)(?=[A-Z"'*])/); // sentences and their separators alternate
    const out: string[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      if (DROP_SENTENCE.test(parts[i])) { bump("sentence-dropped"); continue; }
      out.push(parts[i], parts[i + 1] ?? "");
    }
    return out.join("").trimEnd();
  }).join("\n");
}
function clean(s: string): string {
  let t = dropSentences(s);
  for (const [re, to] of REPLACE) t = t.replace(re, (m, g1) => { bump("word:" + re.source.slice(0, 18)); const out = to.replace("$1", typeof g1 === "string" ? g1 : ""); return m[0] === m[0].toUpperCase() ? out[0].toUpperCase() + out.slice(1) : out; });
  return t;
}
const esc = (s: string) =>
  s.split(/(`[^`\n]*`)/).map((part, i) => (i % 2 ? part : part.replace(/([{}])/g, "\\$1").replace(/<(?=[a-zA-Z/!])/g, "\\<"))).join("");
const cell = (s: string) => esc(clean(s)).replace(/\|/g, "\\|").replace(/\n/g, " ");
function normLinks(s: string): string {
  return s.replace(/\]\((\/[^)\s#?]*?)(?<!\/)([?#][^)\s]*)?\)/g, (_m, p, tail) => `](${p === "" ? "/" : p}/${tail ?? ""})`);
}
const P = (s: string) =>
  normLinks(esc(clean(s)))
    .replace(/^(\s*[-*]\s+)\[[ xX]\]\s+/gm, "$1")
    .replace(/ -- /g, " — ")
    .split("\n").map((l) => (l.trimStart().startsWith("|") ? l : l.replace(/ \| /g, " · "))).join("\n"); // task-list boxes, "--" and pipes would render differently from the source text
const wordsOf = (s: string) => s.replace(/```[\s\S]*?```/g, " ").replace(/[#>*|`\\\[\]()_-]/g, " ").split(/\s+/).filter(Boolean).length;
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const stripYear = (t: string) => t.replace(/\s+in\s+20\d\d/gi, "").replace(/\s*\(?\b20\d\d\b\)?/g, "").replace(/\s{2,}/g, " ").replace(/\s+([:,])/g, "$1").replace(/\s+(for|in|of|to)$/i, "").trim();
function shorten(s: string, n: number): string {
  const kept = s.split(/(?<=[.!?])\s+/).filter((x) => !PRICE_RE.test(x)).join(" ");
  s = kept || s.replace(/\$\d[\d,.]*(\/\s?(mo|month|yr|year))?/gi, "the price");
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const sentenceEnd = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("."));
  if (sentenceEnd > n * 0.5) return cut.slice(0, sentenceEnd + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:\s—-]+$/, "") + "…";
}
function frontmatterText(fm: Record<string, unknown>): string {
  return YAML.stringify(fm, { lineWidth: 0 }).replace(/^(\s*-?\s*)(published|updated|checked|date): (\d{4}-\d\d-\d\d\S*)$/gm, '$1$2: "$3"');
}

async function loadOld() {
  const r = (p: string) => JSON.stringify(join(repo, p));
  const out = await build({
    stdin: {
      contents: `
        export { getAllReviewSlugs, getReviewBySlug } from ${r("src/lib/reviews.ts")};
        export { tools, workflows, categoryGroups } from ${r("src/lib/data.ts")};
        export { arenaComparisons } from ${r("src/lib/arenaComparisons.ts")};
        export { blogArticles } from ${r("src/lib/blogArticles.ts")};
        export { articleStructuredContent } from ${r("src/lib/blogImages.ts")};
        export { articleCoverImages } from ${r("src/lib/blogCoverImages.ts")};
      `,
      resolveDir: repo, loader: "ts",
    },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  });
  const dir = mkdtempSync(join(tmpdir(), "aih-old-"));
  const file = join(dir, "old.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return (await import(pathToFileURL(file).href)) as any;
}

// dataset tool name -> review slug
const DATASET_REVIEW: Record<string, string> = {
  Jasper: "jasper", "Copy.ai": "copy-ai", Writesonic: "writesonic", Rytr: "rytr", Surfer: "surferseo", Frase: "frase",
  invideo: "invideo-ai", Synthesia: "synthesia", HeyGen: "heygen", Descript: "descript", Otter: "otter-ai", ElevenLabs: "elevenlabs", Lindy: "lindy",
};

async function main() {
  const d = await loadOld();
  const viteCfg = readFileSync(join(repo, "vite.config.ts"), "utf8");
  const arr = /const reviewSlugs = \[([\s\S]*?)\];/.exec(viteCfg)![1];
  const routed: string[] = [...arr.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
  const allSlugs: string[] = d.getAllReviewSlugs();
  const unrouted = allSlugs.filter((s) => !routed.includes(s));
  const root = site;
  for (const c of ["reviews", "arena", "blog"]) { rmSync(join(root, "src/content", c), { recursive: true, force: true }); mkdirSync(join(root, "src/content", c), { recursive: true }); }
  mkdirSync(join(root, "src/data/pricing"), { recursive: true });
  mkdirSync(join(root, "src/assets/blog"), { recursive: true });

  // ---- dataset copy
  const dataset = JSON.parse(readFileSync(join(dataDir, "ai-content-tool-pricing.json"), "utf8"));
  copyFileSync(join(dataDir, "ai-content-tool-pricing.json"), join(root, "src/data/pricing/plans.json"));
  for (const f of ["METHOD.md", "CHANGELOG.md", "GAPS.md"]) copyFileSync(join(dataDir, f), join(root, "src/data/pricing", f));
  const dsSources = (tool: string) => {
    const seen = new Map<string, any>();
    for (const r of dataset.filter((x: any) => x.tool === tool)) for (const u of r.sources) seen.set(u, { title: `${tool} pricing page`, url: u, checked: r.checked });
    return [...seen.values()];
  };

  // ---- tools directory
  const toolRows: any[] = d.tools.map((t: any) => {
    const slug = slugify(t.name);
    return { id: slug, name: t.name, description: t.description, group: t.category, category: t.subcategory, pricing: t.pricing, note: t.labNote, hasAPI: t.hasAPI, hasZapier: t.hasZapier, url: t.url && t.url !== "#" ? t.url : null, review: routed.includes(slug) ? slug : (routed.find((r) => slugify(r) === slug) ?? null) };
  });
  const seenIds = new Set<string>();
  for (let i = toolRows.length - 1; i >= 0; i--) { if (seenIds.has(toolRows[i].id)) toolRows.splice(i, 1); else seenIds.add(toolRows[i].id); }
  // review slug may differ from name slug (e.g. bolt-new for Bolt.new -> bolt-new): match via slugified name or fuzzy
  const nameByReview = (rs: string) => toolRows.find((t: any) => t.review === rs);
  writeFileSync(join(root, "src/data/tools.json"), JSON.stringify(toolRows, null, 2) + "\n");

  const ledger: string[][] = [];
  const stats = { reviews: 0, arena: 0, blog: 0, approx: 0, datasetReviews: 0, thinReviews: 0 };
  const thin: string[] = [];
  const affiliates: any[] = [];
  const reviewTitles = new Set<string>();

  // ---- reviews
  for (const slug of routed) {
    const r = d.getReviewBySlug(slug);
    if (!r) { console.error("MISSING review", slug); continue; }
    const toolData = d.tools.find((t: any) => slugify(t.name) === slug) ?? d.tools.find((t: any) => slugify(t.name).replace(/-/g, "") === slug.replace(/-/g, ""));
    const name = r.toolName;
    const verdict = r.verdict ?? r.tldr ?? r.subtitle ?? "";
    const whatItDoes: string[] = r.whatItDoes ?? r.pros ?? [];
    const features: { title: string; description: string }[] = r.keyFeatures ?? (r.features ?? []).map((f: any) => ({ title: f.name, description: f.description }));
    const body: string[] = [];
    if (verdict) body.push(P(verdict));
    body.push(`## What ${esc(name)} does\n\n` + whatItDoes.map(P).join("\n\n"));
    if (r.whoGetsTheMost?.length) body.push(`## Who it suits\n\n` + r.whoGetsTheMost.map(P).join("\n\n"));
    if (features.length) body.push(`## Key features\n\n` + features.map((f) => `### ${esc(clean(f.title))}\n\n${P(f.description)}`).join("\n\n"));
    if (r.realWorkflow) body.push(`## Example workflow: ${esc(clean(r.realWorkflow.title))}\n\n${P(r.realWorkflow.description)}`);
    if (r.cons?.length) body.push(`## Where it falls short\n\n` + r.cons.map((c: string) => `- ${P(c)}`).join("\n"));
    const dsTool = Object.entries(DATASET_REVIEW).find(([, v]) => v === slug)?.[0];
    const src: any[] = [];
    const vendor = toolData?.url && toolData.url !== "#" ? toolData.url : null;
    const published = firstSeen(`slug: '${slug}'`, "src/lib/reviews.ts");
    let needsSources = false;
    if (dsTool) {
      stats.datasetReviews++;
      body.push(`## Pricing\n\n<PlanTable tool="${dsTool}" />`); // old pricing note quoted unsourced prices
      src.push(...dsSources(dsTool));
    } else {
      const rows = (r.pricing ?? []) as { plan: string; price: string; features: string }[];
      if (rows.length) {
        body.push(`## Pricing\n\n*Plan prices below were recorded when this review was first written (${published.date.slice(0, 7)}) and have not been re-checked. Confirm on the vendor's pricing page before buying.*\n\n| Plan | Price | What it includes |\n| --- | --- | --- |\n` +
          rows.map((x) => `| ${cell(x.plan)} | ${cell(x.price)} | ${cell(x.features)} |`).join("\n") + (r.pricingNote ? `\n\n${P(r.pricingNote)}` : ""));
      }
      if (vendor) src.push({ title: `${name} official site`, url: vendor, checked: published.date, approx: true });
      else if (rows.some((x) => PRICE_RE.test(x.price))) needsSources = true;
    }
    if (r.comparisons?.length)
      body.push(`## How it compares\n\n` + r.comparisons.map((c: any) => `### Versus ${esc(clean(c.tool))}\n\n**Strengths:** ${P(c.strengths)}\n\n**Trade-offs:** ${P(c.weaknesses)}`).join("\n\n"));
    if (r.finalVerdict?.length) body.push(`## Verdict\n\n` + r.finalVerdict.map(P).filter(Boolean).join("\n\n"));
    const md = body.join("\n\n") + "\n";
    const imports = /<PlanTable/.test(md) ? `import PlanTable from "../../components/PlanTable.astro";\n\n` : "";
    let title = `${name} Review: Features and Pricing`;
    if (title.length > 60) title = `${name} Review and Pricing`;
    if (title.length > 60) title = `${name} Review`;
    let n = 1; while (reviewTitles.has(title.toLowerCase())) title = `${name} Review (${++n})`;
    reviewTitles.add(title.toLowerCase());
    const desc = shorten(clean(r.metaDescription ?? r.subtitle ?? r.tldr ?? `${name} review: features, pricing and who it suits.`).replace(/\b(in-depth )?(.+?) review for 2026\.?/i, "$2 review."), 155);
    const words = wordsOf(md);
    const fm: Record<string, unknown> = {
      title, description: desc, slug, targetQuery: `${name.toLowerCase()} review`,
      published: published.date, ...(published.approx ? { publishedApprox: true } : {}),
      reviewEvery: "90d", author: EDITORIAL, evidence: dsTool ? "compiled-data" : "research",
      sources: src, ...(needsSources ? { needsSources: true } : {}), category: toolData?.subcategory ?? "AI tools",
      h1: `${name} review`, ...(dsTool ? { pricingTool: dsTool } : {}),
    };
    writeFileSync(join(root, "src/content/reviews", `${slug}.mdx`), `---\n${frontmatterText(fm)}---\n\n${imports}${md}`);
    stats.reviews++; if (published.approx) stats.approx++;
    if (words < 500 && !dsTool) { stats.thinReviews++; thin.push(`${slug} (${words} words)`); }
    ledger.push([`/vault/${slug}/`, "keep", `${name.toLowerCase()} review`, dsTool ? "sourced pricing from the dataset" : "routed review; keep per no-GSC-file rule", "", TODAY, "proposed", String(words), String(needsSources), "review", "", published.date, "derived"]);
    affiliates.push({ id: slug, programme: name, network: "none", url: vendor ?? "https://aihunterlabs.com/", status: "none" });
  }

  // ---- arena
  for (const a of d.arenaComparisons) {
    const body: string[] = [P(a.verdict)];
    for (const s of a.sections) body.push(`## ${esc(clean(s.heading))}\n\n${P(s.content)}`);
    body.push(`## Best for ${esc(a.toolA)}\n\n` + a.toolABestFor.map((x: string) => `- ${P(x)}`).join("\n"));
    body.push(`## Best for ${esc(a.toolB)}\n\n` + a.toolBBestFor.map((x: string) => `- ${P(x)}`).join("\n"));
    const md = body.join("\n\n") + "\n";
    const published = firstSeen(`slug: '${a.slug}'`, "src/lib/arenaComparisons.ts");
    let title = stripYear(a.metaTitle.split(/\s[—|-]\s/)[0]);
    if (title.length > 60) title = title.slice(0, 60).replace(/\s\S*$/, "");
    const fm: Record<string, unknown> = {
      title, description: shorten(clean(a.metaDescription), 155), slug: a.slug, targetQuery: `${a.toolA} vs ${a.toolB}`.toLowerCase(),
      published: published.date, ...(published.approx ? { publishedApprox: true } : {}), reviewEvery: "90d", author: EDITORIAL, evidence: "research",
      sources: [], needsSources: true, category: a.category, h1: `${a.toolA} vs ${a.toolB}`,
      toolA: a.toolA, toolB: a.toolB,
    };
    writeFileSync(join(root, "src/content/arena", `${a.slug}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.arena++;
    ledger.push([`/arena/${a.slug}/`, "keep", String(fm.targetQuery), "routed comparison; keep per no-GSC-file rule", "", TODAY, "proposed", String(wordsOf(md)), "true", "arena", "", published.date, "derived"]);
  }

  // ---- blog
  const blogOut: any[] = [];
  for (const b of d.blogArticles.filter((x: any) => x.published)) {
    const raw = d.articleStructuredContent[b.slug];
    if (!raw) { console.error("NO BODY", b.slug); continue; }
    const md = P(raw).replace(/^---$/gm, "") + "\n";
    const published = firstSeen(`slug: '${b.slug}'`, "src/lib/blogArticles.ts");
    const cover = d.articleCoverImages[b.slug];
    if (cover) { const f = join(repo, "public", cover); if (existsSync(f) && !existsSync(join(root, "src/assets/blog", cover.split("/").pop()!.replace(/\.png$/, ".webp")))) await sharp(f).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(root, "src/assets/blog", cover.split("/").pop()!.replace(/\.png$/, ".webp"))); }
    let title = stripYear(b.title);
    if (title.length > 60) title = title.split(":")[0].trim();
    title = title.replace(/\s+(for|in|of|to|at)$/i, "");
    const fm: Record<string, unknown> = {
      title, description: shorten(clean(b.excerpt), 155), slug: b.slug, targetQuery: stripYear(b.title).split(/[:?]/)[0].toLowerCase(),
      published: published.date, ...(published.approx ? { publishedApprox: true } : {}), reviewEvery: "90d", author: EDITORIAL, evidence: "research",
      sources: [], needsSources: true, category: b.category, h1: b.title, cover: cover ? cover.split("/").pop().replace(/\.png$/, ".webp") : undefined,
      articleType: b.article_type, readingTime: b.reading_time, toolTags: b.tool_tags,
    };
    writeFileSync(join(root, "src/content/blog", `${b.slug}.mdx`), `---\n${frontmatterText(fm)}---\n\n${md}`);
    stats.blog++;
    blogOut.push(b.slug);
    ledger.push([`/blog/${b.slug}/`, "keep", String(fm.targetQuery), "routed article; keep per no-GSC-file rule", "", TODAY, "proposed", String(wordsOf(md)), "true", "blog", "", published.date, "derived"]);
  }

  // ---- static pages
  const statics: [string, string][] = [["/", "home"], ["/vault/", "new tool directory hub (old site had no /vault/ index)"], ["/arena/", "hub"], ["/blog/", "hub"], ["/lab/", "workflow blueprints hub"], ["/news/", "news page; live page never rendered content"], ["/pricing/", "new: AI Content Tool Pricing Tracker (dataset asset)"], ["/about/", "new trust page"], ["/affiliate-disclosure/", "new trust page"], ["/privacy/", "new trust page"]];
  for (const [u, why] of statics) ledger.push([u, "keep", "", why, "", TODAY, "proposed", "", "", "static", "", "", ""]);

  // ---- workflows
  writeFileSync(join(root, "src/data/workflows.json"), JSON.stringify(d.workflows, null, 2) + "\n");
  writeFileSync(join(root, "src/data/affiliates.json"), JSON.stringify(affiliates, null, 2) + "\n");
  writeFileSync(join(root, "src/data/unrouted.json"), JSON.stringify(unrouted, null, 2) + "\n");

  const head = ["url", "decision", "target_query", "reason", "redirect_target", "date", "status", "word_count", "needs_sources", "kind", "legacy_last_updated", "published", "target_query_source"];
  writeFileSync(join(root, "content-ledger.csv"), [head, ...ledger].map((r) => r.map(csvCell).join(",")).join("\n") + "\n");
  writeFileSync(join(root, "public/_redirects"), withTwins(readFileSync(join(repo, "public/_redirects"), "utf8")));
  writeFileSync(join(root, "thin-list.txt"), thin.join("\n") + "\n");
  console.log(JSON.stringify({ ...stats, routed: routed.length, unrouted: unrouted.length, ledger: ledger.length, subs }, null, 1));
}
main();
