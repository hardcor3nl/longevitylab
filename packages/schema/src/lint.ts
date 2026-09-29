import { frontmatterSchema, type Frontmatter } from "./frontmatter.ts";

export type Severity = "fail" | "warn";
export interface Issue {
  file: string;
  rule: string;
  severity: Severity;
  message: string;
}

export interface LintContext {
  /** Site editorial name; the only allowed author (owner decision 28 Sept). */
  editorialName: string;
  trailingSlash: "always" | "never";
  /** Canonical internal routes, e.g. "/guides/base44-vs-lovable/". Omit to skip link resolution. */
  routes?: Set<string>;
  /** Resolve an ownerEvidence path; return true if the file exists. */
  fileExists?: (path: string) => boolean;
  /** Extra phrases on top of the CONTENT_STANDARD list. */
  extraBanned?: string[];
  /** Fixed clock for the overdue check (tests). */
  now?: Date;
}

export interface Doc {
  file: string;
  frontmatter: unknown;
  body: string;
}

/** CONTENT_STANDARD.md "Banned outright" filler list. */
export const BANNED_PHRASES = [
  "in today's fast-paced world",
  "in today's",
  "game-changer",
  "game changer",
  "unlock",
  "dive in",
  "navigate the landscape",
  "whether you're a beginner or a pro",
  "it's important to note",
  "in conclusion",
  "the ever-evolving",
  "seamless",
  "robust",
  "leverage",
  "elevate",
];

/** Claims of first-hand testing; allowed only on owner-tested pages. */
export const TESTING_CLAIMS = [
  "we tested",
  "we've tested",
  "hands-on",
  "in our testing",
  "in our experience",
  "i tested",
  "we built",
  "our benchmark",
];

export const PRICE_RE = /(?:[$€£]\s?\d|\b\d[\d,.]*\s?(?:USD|EUR|GBP)\b|\/\s?(?:mo|month|yr|year)\b)/i;

/** Strip fenced code so phrases inside code samples are not flagged. */
function prose(body: string): string {
  return body.replace(/```[\s\S]*?```/g, " ").replace(/`[^`\n]*`/g, " ");
}

function findPhrase(text: string, phrase: string): boolean {
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "iu");
  return re.test(text.replace(/[’‘]/g, "'"));
}

export function internalLinks(body: string): string[] {
  const out: string[] = [];
  const re = /\]\((\/[^)\s]*)\)|href="(\/[^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prose(body)))) out.push(m[1] ?? m[2]);
  return out;
}

export function lintDocument(doc: Doc, ctx: LintContext): Issue[] {
  const issues: Issue[] = [];
  const add = (rule: string, severity: Severity, message: string) =>
    issues.push({ file: doc.file, rule, severity, message });

  const parsed = frontmatterSchema.safeParse(doc.frontmatter);
  if (!parsed.success) {
    for (const i of parsed.error.issues) add("schema", "fail", `${i.path.join(".") || "frontmatter"}: ${i.message}`);
    return issues;
  }
  const fm: Frontmatter = parsed.data;
  const text = prose(doc.body);

  if (fm.author !== ctx.editorialName)
    add("author", "fail", `author must be the editorial name "${ctx.editorialName}", got "${fm.author}"`);

  if (fm.evidence === "owner-tested") {
    const files = fm.ownerEvidence ?? [];
    const missing = files.filter((f) => !(ctx.fileExists?.(f) ?? false));
    if (files.length === 0) add("owner-evidence", "fail", "evidence: owner-tested requires ownerEvidence files");
    else if (missing.length) add("owner-evidence", "fail", `ownerEvidence files not found: ${missing.join(", ")}`);
  } else {
    for (const p of TESTING_CLAIMS)
      if (findPhrase(text, p)) add("testing-claim", "fail", `"${p}" on a page not marked owner-tested`);
  }

  for (const p of [...BANNED_PHRASES, ...(ctx.extraBanned ?? [])]) {
    if (fm.allowPhrases?.includes(p)) continue;
    if (findPhrase(text, p) || findPhrase(fm.title + " " + fm.description, p))
      add("banned-phrase", "fail", `banned phrase "${p}"`);
  }

  // Prices with no sources
  const hasPrices = PRICE_RE.test(text);
  if (hasPrices && fm.sources.length === 0 && !fm.needsSources)
    add("sources", "fail", "page states prices but has no sources");
  else if (hasPrices && fm.sources.length === 0)
    add("sources", "warn", "page states prices, no sources yet (needsSources)");
  if (hasPrices) {
    for (const line of text.split("\n")) {
      if (line.trim().startsWith("|") && PRICE_RE.test(line) && !/\]\(https?:\/\//.test(line) && fm.sources.length === 0)
        add("table-row-source", "warn", `price row without a source link: ${line.trim().slice(0, 60)}`);
    }
  }

  // Title year needs an update log
  if (/\b20\d\d\b/.test(fm.title) && fm.updateLog.length === 0)
    add("title-year", "fail", "title carries a year but the page has no updateLog");

  // Links
  for (const link of internalLinks(doc.body)) {
    const path = link.split(/[?#]/)[0];
    if (path === "/" || path.startsWith("/go/")) continue;
    const isFile = /\.[a-z0-9]+$/i.test(path);
    if (!isFile) {
      const slash = path.endsWith("/");
      if (ctx.trailingSlash === "always" && !slash) add("link-canonical", "fail", `non-canonical internal link ${link}`);
      if (ctx.trailingSlash === "never" && slash) add("link-canonical", "fail", `non-canonical internal link ${link}`);
    }
    if (ctx.routes && !isFile && !ctx.routes.has(path)) add("link-resolve", "fail", `internal link does not resolve: ${link}`);
  }

  // Freshness
  if (fm.reviewEvery) {
    const days = parseInt(fm.reviewEvery, 10);
    const last = new Date(fm.updated ?? fm.published).getTime();
    const now = (ctx.now ?? new Date()).getTime();
    if (now - last > days * 86400000) add("review-overdue", "warn", `review overdue (every ${fm.reviewEvery})`);
  }

  return issues;
}

/** Cross-document rules: duplicate titles / targetQuery within a site. */
export function lintCorpus(docs: Doc[], ctx: LintContext): Issue[] {
  const issues: Issue[] = [];
  const titles = new Map<string, string>();
  const queries = new Map<string, string>();
  for (const d of docs) {
    issues.push(...lintDocument(d, ctx));
    const p = frontmatterSchema.safeParse(d.frontmatter);
    if (!p.success) continue;
    const t = p.data.title.trim().toLowerCase();
    const q = p.data.targetQuery.trim().toLowerCase();
    if (titles.has(t)) issues.push({ file: d.file, rule: "duplicate-title", severity: "fail", message: `same title as ${titles.get(t)}` });
    else titles.set(t, d.file);
    if (queries.has(q)) issues.push({ file: d.file, rule: "duplicate-target-query", severity: "fail", message: `same targetQuery as ${queries.get(q)}` });
    else queries.set(q, d.file);
  }
  return issues;
}
