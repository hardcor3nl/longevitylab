// Job R: AI-pattern lint and near-duplicate detection.
// Pure functions over page body text. No file I/O here.

/** Strongest tells: a build FAIL. Generic AI filler that no honest page needs. */
export const STRONG_TELLS: { re: RegExp; label: string }[] = [
  { re: /\bdelv(?:e|es|ed|ing)\b/i, label: "delve" },
  { re: /\blook no further\b/i, label: "look no further" },
  { re: /\bin the ever[- ]evolving\b/i, label: "in the ever-evolving" },
  { re: /\brich tapestry\b|\btapestry of\b/i, label: "tapestry" },
  { re: /\ba testament to\b/i, label: "a testament to" },
  { re: /\bwhether you(?:'|’)re (?:a |an )?[^.,;:!?]{1,40}? or (?:a |an )?[^.,;:!?]{1,40}?(?=[,.;:!?])/i, label: "whether you're a ... or a ..." },
  { re: /\bnavigate the (?:complex )?landscape\b|\bnavigating the (?:complex )?landscape\b/i, label: "navigate the landscape" },
  { re: /\bbuckle up\b|\brest assured\b/i, label: "buckle up / rest assured" },
  { re: /\bin today(?:'|’)s (?:fast[- ]paced|digital|modern|ever)/i, label: "in today's fast-paced/digital" },
  { re: /\bin conclusion\b/i, label: "in conclusion" },
  { re: /\bit(?:'|’)s (?:important|worth) (?:to note|noting)\b/i, label: "it's important to note" },
  { re: /\bgame[- ]?changer\b/i, label: "game-changer" },
  { re: /\bhidden gems?\b|\btreasure trove\b/i, label: "hidden gem / treasure trove" },
];

/** Weaker stock phrasing: WARN, counted per page. */
export const WEAK_TELLS: RegExp[] = [
  /\bunlock(?:s|ed|ing)? (?:the|your|its|a)\b/i,
  /\belevate\b/i,
  /\bseamless(?:ly)?\b/i,
  /\brobust\b/i,
  /\bleverag(?:e|es|ed|ing)\b/i,
  /\bcutting[- ]edge\b/i,
  /\bstate[- ]of[- ]the[- ]art\b/i,
  /\bholistic\b/i,
  /\bempower(?:s|ed|ing)?\b/i,
  /\bstreamlin(?:e|es|ed|ing)\b/i,
  /\bwhen it comes to\b/i,
  /\bat the end of the day\b/i,
  /\bplays? a (?:crucial|vital|key|pivotal) role\b/i,
  /\bin the realm of\b/i,
  /\bto the next level\b/i,
  /\bdive (?:in|into|deeper)\b/i,
  /\bembark(?:s|ed|ing)? on\b/i,
  /\b(?:bustling|vibrant|thriving) (?:city|hub|scene|community|ecosystem|metropolis)\b/i,
  /\bcomprehensive guide\b/i,
  /\bnot just [^.]{1,60}, but\b/i,
  /\bthe ultimate (?:guide|tool|solution)\b/i,
  /\bmyriad\b|\bplethora\b/i,
  /\bfast[- ]paced\b/i,
  /\bever[- ]evolving\b/i,
];

const SUPERLATIVES =
  /\b(?:unbeatable|unmatched|unrivall?ed|world[- ]class|best[- ]in[- ]class|number one|#1|the (?:(?:best|fastest|most (?:powerful|reliable|comprehensive|secure)) (?:[^.\n]{0,70}?)(?:in the world|available|on the market|ever made|anywhere|of any|of all|bar none))|incredibl[ey]|amazing(?:ly)?|revolutionary|flawless(?:ly)?|second to none|perfect(?:ly)? (?:choice|fit|solution))\b/i;

export interface TellCounts {
  strong: { label: string; count: number }[];
  strongTotal: number;
  weakTotal: number;
  emDashes: number;
  emDashPer1k: number;
  emDashExcess: number;
  rhetoricalOpeners: number;
  superlatives: number;
  fillerParas: number;
  words: number;
  /** snippets for the offending text, for the rewriter */
  examples: string[];
  /** weighted score used to rank worst pages */
  score: number;
}

export function stripForText(body: string): string {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^import .*$/gm, " ")
    .replace(/^export .*$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/[’‘]/g, "'");
}

export function wordCount(body: string): number {
  const t = stripForText(body).replace(/^\|.*$/gm, " ").trim();
  return t ? t.split(/\s+/).length : 0;
}

function paragraphs(body: string): string[] {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("|") && !p.startsWith("<") && !p.startsWith("import ") && !p.startsWith("export ") && !p.startsWith("!["));
}

const STOP = new Set("the a an and or of to in for on with is are was were be it this that how what why when your you our we".split(" "));
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w && !STOP.has(w));

export function countTells(body: string): TellCounts {
  const text = stripForText(body);
  const strong: { label: string; count: number }[] = [];
  // Quoted wording (a vendor's own phrase, or a phrase the page tells writers to avoid) is a mention, not our prose: skip it for the FAIL tells.
  const unquoted = stripForText(body.replace(/^\s*>.*$/gm, " ")).replace(/"[^"\n]{1,200}"/g, " ").replace(/“[^”\n]{1,200}”/g, " ");
  for (const t of STRONG_TELLS) {
    const m = unquoted.match(new RegExp(t.re.source, "gi"));
    if (m) strong.push({ label: t.label, count: m.length });
  }
  const strongTotal = strong.reduce((a, b) => a + b.count, 0);
  const examples: string[] = [];
  let weakTotal = 0;
  for (const re of WEAK_TELLS) {
    const hits = [...text.matchAll(new RegExp(re.source, "gi"))];
    weakTotal += hits.length;
    for (const h of hits) examples.push("WEAK: ..." + text.slice(Math.max(0, (h.index ?? 0) - 50), (h.index ?? 0) + 60).replace(/\s+/g, " ") + "...");
  }

  const wc = Math.max(1, wordCount(body));
  // table cells use a lone dash as "none"; do not count those
  const emDashes = (text.replace(/^\s*\|.*$/gm, " ").match(/—/g) ?? []).length;
  const emDashPer1k = (emDashes / wc) * 1000;
  // Allow up to 3 per 1000 words; count the rest.
  const emDashExcess = Math.max(0, emDashes - Math.ceil((wc / 1000) * 3) - 1);

  const paras = paragraphs(body);
  let rhetoricalOpeners = 0;
  let filler = 0;
  let sup = 0;
  let lastHeading = "";
  const lines = body.replace(/```[\s\S]*?```/g, " ").split(/\r?\n/);
  // rhetorical question openers: paragraph whose first sentence is a question
  for (const p of paras) {
    if (p.startsWith("#")) continue;
    if (/^\s*[-*|]/.test(p) || /\n\s*[-*|]/.test(p)) continue;
    const sents = stripForText(p).split(/(?<=[.?!])\s/);
    const first = sents[0] ?? "";
    // a question answered in the next sentence (answer-first Q&A), or a colon list of questions, is not a rhetorical opener
    const answered = /^(?:yes|no|not|usually|often|it depends|the (?:short|accurate|direct|honest) answer|short answer)\b/i.test((sents[1] ?? "").trim());
    if (first.trim().endsWith("?") && !first.includes(":") && !answered && !/^(?:q:|\*\*q)/i.test(first)) { rhetoricalOpeners++; examples.push("Q-OPENER: " + first.trim().slice(0, 110)); }
  }
  // filler paragraph: first paragraph after a heading that mostly restates the heading
  for (let i = 0; i < lines.length; i++) {
    const h = /^#{2,4}\s+(.*)$/.exec(lines[i]);
    if (!h) continue;
    lastHeading = h[1];
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j >= lines.length || /^[#|<\-*\d>]/.test(lines[j].trim())) continue;
    const para = lines[j];
    const pw = words(stripForText(para));
    const hw = new Set(words(lastHeading));
    if (hw.size >= 2 && pw.length <= 45 && pw.length > 0) {
      const overlap = pw.filter((w) => hw.has(w)).length / hw.size;
      if (overlap >= 0.8 && pw.length <= 30 && new Set(pw.filter((w) => !hw.has(w))).size <= 7 && !/\d/.test(para)) { filler++; examples.push("FILLER under '" + lastHeading + "': " + stripForText(para).slice(0, 110)); }
    }
  }
  // superlatives: sentence with a superlative and no number, link, or "according to"
  const rawSentences = body.replace(/```[\s\S]*?```/g, " ").split(/(?<=[.!?])\s+/);
  for (const s of rawSentences) {
    // hedged or conditional sentences ("the best area depends on...") are not unsourced claims
    if (!/\*\*best for/i.test(s) && !/\b(?:not|never|depends?|usually|often|rarely|sometimes|if|unless|whether|choose|pick|one that|one where|one who|matches|fits)\b|\?|<summary>/i.test(s) && SUPERLATIVES.test(s.replace(/[’‘]/g, "'")) && !/\d/.test(s) && !/\]\(https?:/.test(s) && !/according to|reports?|per /i.test(s)) { sup++; examples.push("SUPERL: " + s.trim().slice(0, 240)); }
  }

  const score = strongTotal * 5 + weakTotal * 1.5 + emDashExcess * 0.5 + rhetoricalOpeners * 2 + sup * 1 + filler * 2;
  return { strong, strongTotal, weakTotal, emDashes, emDashPer1k, emDashExcess, rhetoricalOpeners, superlatives: sup, fillerParas: filler, words: wc, examples, score };
}

// ---------- near-duplicate and template detection ----------

export function shingles(body: string, k = 4): Set<string> {
  const w = stripForText(body)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + k <= w.length; i++) out.add(w.slice(i, i + k).join(" "));
  return out;
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** share of the smaller page's shingles found in the other (catches a short stub inside a long page) */
export function containment(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) inter++;
  return inter / s.size;
}

export interface DupPair { a: string; b: string; sim: number }

export function nearDuplicates(pages: { id: string; body: string }[], threshold = 0.6): DupPair[] {
  const sets = pages.map((p) => ({ id: p.id, s: shingles(p.body) }));
  const out: DupPair[] = [];
  for (let i = 0; i < sets.length; i++)
    for (let j = i + 1; j < sets.length; j++) {
      const sim = jaccard(sets[i].s, sets[j].s);
      if (sim > threshold) out.push({ a: sets[i].id, b: sets[j].id, sim });
    }
  return out;
}

export function clusters(pairs: DupPair[]): { ids: string[]; maxSim: number }[] {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    const p = parent.get(x)!;
    if (p === x) return x;
    const r = find(p);
    parent.set(x, r);
    return r;
  };
  for (const p of pairs) parent.set(find(p.a), find(p.b));
  const groups = new Map<string, Set<string>>();
  for (const p of pairs) for (const id of [p.a, p.b]) {
    const r = find(id);
    if (!groups.has(r)) groups.set(r, new Set());
    groups.get(r)!.add(id);
  }
  return [...groups.values()].map((g) => ({
    ids: [...g].sort(),
    maxSim: Math.max(...pairs.filter((p) => g.has(p.a) && g.has(p.b)).map((p) => p.sim)),
  })).sort((x, y) => y.ids.length - x.ids.length);
}

/** Skeleton of a sentence: lowercase, drop numbers and the page's own title/slug words, so swapped nouns still collide. */
function skeleton(sentence: string, own: Set<string>): string {
  return stripForText(sentence)
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w && !own.has(w))
    .join(" ");
}

export interface TemplateHit { kind: "intro" | "outro"; skeleton: string; ids: string[] }

/** Intro/outro sentences whose skeleton repeats across >= minPages pages. */
export function templatedEnds(pages: { id: string; title: string; slug: string; body: string }[], minPages = 3): TemplateHit[] {
  const map = new Map<string, string[]>();
  for (const p of pages) {
    const own = new Set(words(p.title + " " + p.slug.replace(/-/g, " ")));
    const paras = paragraphs(p.body).filter((x) => !x.startsWith("#") && !/^[-*\d>]/.test(x));
    if (!paras.length) continue;
    const intro = stripForText(paras[0]).split(/(?<=[.?!])\s/)[0] ?? "";
    const outro = stripForText(paras[paras.length - 1]).split(/(?<=[.?!])\s/)[0] ?? "";
    for (const [kind, s] of [["intro", intro], ["outro", outro]] as const) {
      const sk = skeleton(s, own);
      if (sk.split(" ").length < 5) continue;
      const key = kind + "|" + sk.split(" ").slice(0, 14).join(" ");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p.id);
    }
  }
  const out: TemplateHit[] = [];
  for (const [key, ids] of map) {
    if (ids.length >= minPages) {
      const [kind, sk] = key.split("|");
      out.push({ kind: kind as "intro" | "outro", skeleton: sk, ids });
    }
  }
  return out.sort((a, b) => b.ids.length - a.ids.length);
}

export interface PageShape { hasTable: boolean; hasComponent: boolean; sources: number; headings: number; lists: number }
export function pageShape(body: string, sources: number): PageShape {
  const b = body.replace(/```[\s\S]*?```/g, " ");
  return {
    hasTable: /^\|.*\|\s*$/m.test(b) && /^\|[\s:|-]+\|\s*$/m.test(b),
    hasComponent: /^\s*<[A-Z][A-Za-z]+/m.test(b),
    sources,
    headings: (b.match(/^#{2,4}\s/gm) ?? []).length,
    lists: (b.match(/^\s*(?:[-*]|\d+\.)\s/gm) ?? []).length,
  };
}
