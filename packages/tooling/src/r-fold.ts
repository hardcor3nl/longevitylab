// Job R: fold thin pages into a stronger survivor page, record the 301, repoint internal links.
// usage: node --experimental-strip-types packages/tooling/src/r-fold.ts <site> <survivor collection/slug> <absorbed collection/slug[:Heading[=SurvivorSectionToReplace]]>... [--dry]
// Facts are moved, not rewritten: the absorbed body goes under a new H2 (its own H2s become H3).
import { existsSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { splitFrontmatter, walk } from "../../schema/src/index.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const dry = process.argv.includes("--dry");
const [site, survivorArg, ...absorbedArgs] = args;
const siteDir = join(ROOT, "sites", site);
const cfg = JSON.parse(readFileSync(join(siteDir, "site.config.json"), "utf8"));
const slash = cfg.trailingSlash === "always";
const urlOf = (coll: string, slug: string) => `${cfg.collectionRoutes[coll]}${slug}${slash ? "/" : ""}`;
const today = "2026-10-01";

function fileOf(spec: string): string {
  const [coll, slug] = spec.split("/");
  for (const ext of [".mdx", ".md"]) {
    const p = join(siteDir, "src/content", coll, slug + ext);
    if (existsSync(p)) return p;
  }
  throw new Error("missing " + spec);
}

function parseCsv(line: string): string[] {
  const out: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c;
  }
  out.push(cur);
  return out;
}
const csvCell = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

// survivor "@/some/url/" means: redirect only, the survivor is a data-driven page (no body merge)
const external = survivorArg.startsWith("@");
const sFile = external ? "" : fileOf(survivorArg);
let sSrc = external ? "" : readFileSync(sFile, "utf8");
const sSlug = external ? survivorArg.slice(1) : survivorArg.split("/")[1];
const sUrl = external ? survivorArg.slice(1) : urlOf(survivorArg.split("/")[0], sSlug);
const moved: string[] = [];
const redirects: [string, string][] = [];

for (const spec of absorbedArgs) {
  const [ref, headingPart] = spec.split(":");
  let heading = headingPart, replace: string | undefined;
  if (headingPart?.includes("=")) [heading, replace] = headingPart.split("=");
  const aFile = fileOf(ref);
  const { data, body } = splitFrontmatter(readFileSync(aFile, "utf8"));
  const fm = data as Record<string, any>;
  const title = heading ?? String(fm.h1 ?? fm.title);
  let b = body.replace(/\r\n/g, "\n").trim();
  // drop the boilerplate "See the sourced facts for X" line; the survivor keeps its own
  b = b.replace(/\n*See the sourced facts for [^\n]*$/m, "").trim();
  b = b.replace(/^## /gm, "### ");
  if (replace) {
    const re = new RegExp(`\\n## ${replace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n[\\s\\S]*?(?=\\n## |\\n*$)`);
    sSrc = sSrc.replace(re, "");
  }
  const section = `\n\n## ${title}\n\n${b}\n`;
  if (external) { moved.push(ref.split("/")[1]); redirects.push([urlOf(ref.split("/")[0], ref.split("/")[1]), sUrl]); if (!dry) rmSync(aFile); continue; }
  // insert before a trailing "See the sourced facts" line if present, else at the end
  const m = /\n\nSee the sourced facts[^\n]*\s*$/.exec(sSrc);
  if (m) sSrc = sSrc.slice(0, m.index) + section.trimEnd() + sSrc.slice(m.index);
  else sSrc = sSrc.trimEnd() + section;
  // frontmatter sources union
  const aSources: any[] = Array.isArray(fm.sources) ? fm.sources : [];
  if (aSources.length) {
    const add = aSources.map((s) => `  - title: ${JSON.stringify(s.title)}\n    url: ${s.url}\n    checked: "${String(s.checked).slice(0, 10)}"\n`).join("");
    if (/^sources: \[\]/m.test(sSrc)) sSrc = sSrc.replace(/^sources: \[\]/m, "sources:\n" + add.trimEnd());
    else sSrc = sSrc.replace(/^(sources:\n(?:  .*\n)+)/m, (x) => x + add);
  }
  moved.push(ref.split("/")[1]);
  redirects.push([urlOf(ref.split("/")[0], ref.split("/")[1]), sUrl]);
  if (!dry) rmSync(aFile);
}

// survivor frontmatter: updated + log
const logLine = `  - date: "${today}"\n    change: "Merged ${moved.length} short pages into this one (${moved.join(", ")}); their content now sits under its own headings."\n`;
if (/^updated:/m.test(sSrc)) sSrc = sSrc.replace(/^updated:.*$/m, `updated: "${today}"`);
else sSrc = sSrc.replace(/^(published:.*)$/m, `$1\nupdated: "${today}"`);
if (/^updateLog: \[\]/m.test(sSrc)) sSrc = sSrc.replace(/^updateLog: \[\]/m, "updateLog:\n" + logLine.trimEnd());
else if (/^updateLog:\n/m.test(sSrc)) sSrc = sSrc.replace(/^(updateLog:\n(?:  .*\n)+)/m, (x) => x + logLine);
else sSrc = sSrc.replace(/\n---\n/, `\nupdateLog:\n${logLine.trimEnd()}\n---\n`);
if (!dry && !external) writeFileSync(sFile, sSrc);

// ledger
const ledgerPath = join(siteDir, "content-ledger.csv");
if (existsSync(ledgerPath) && !dry) {
  const lines = readFileSync(ledgerPath, "utf8").split("\n");
  const head = parseCsv(lines[0]);
  const col = (n: string) => head.indexOf(n);
  const out = lines.map((l, i) => {
    if (i === 0 || !l.trim()) return l;
    const c = parseCsv(l);
    const hit = redirects.find(([from]) => c[0] === from || c[0] === from.replace(/\/$/, ""));
    if (!hit) return l;
    c[col("decision")] = "merge";
    c[col("redirect_target")] = hit[1];
    c[col("reason")] = "thin page on the same search task; folded into the stronger page (Job R)";
    c[col("date")] = today;
    c[col("status")] = "applied";
    return c.map(csvCell).join(",");
  });
  writeFileSync(ledgerPath, out.join("\n"));
}
// _redirects (both slash forms)
const rPath = join(siteDir, "public/_redirects");
if (!dry) {
  let add = "";
  for (const [from, to] of redirects) {
    const a = from.endsWith("/") ? from.slice(0, -1) : from, b = a + "/";
    add += `${a} ${to} 301\n${b} ${to} 301\n`;
  }
  const cur = existsSync(rPath) ? readFileSync(rPath, "utf8") : "";
  writeFileSync(rPath, cur.replace(/\n*$/, "\n") + "# Job R merges, 1 Oct 2026 (see content-ledger.csv)\n" + add);
}
// flatten chains: older redirects that pointed at an absorbed page now point at the survivor
if (!dry) {
  const map = new Map(redirects.map(([from, to]) => [from.replace(/\/$/, ""), to]));
  const fix = (t: string) => map.get(t.replace(/\/$/, "")) ?? t;
  if (existsSync(rPath)) {
    const out = readFileSync(rPath, "utf8").split("\n").map((l) => {
      if (!l.trim() || l.startsWith("#")) return l;
      const [from, to, st] = l.trim().split(/\s+/);
      return to && map.has(to.replace(/\/$/, "")) ? `${from} ${fix(to)} ${st}` : l;
    });
    writeFileSync(rPath, out.join("\n"));
  }
  if (existsSync(ledgerPath)) {
    const lines = readFileSync(ledgerPath, "utf8").split("\n");
    const ti = parseCsv(lines[0]).indexOf("redirect_target");
    writeFileSync(ledgerPath, lines.map((l, i) => {
      if (i === 0 || !l.trim()) return l;
      const c = parseCsv(l);
      if (c[ti] && map.has(c[ti].replace(/\/$/, "")) && !map.has(c[0].replace(/\/$/, ""))) { c[ti] = fix(c[ti]); return c.map(csvCell).join(","); }
      return l;
    }).join("\n"));
  }
}
// repoint internal links
let relinked = 0;
const walkAll = (d: string): string[] => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walkAll(p) : /\.(mdx?|astro|ts|tsx|json)$/.test(p) ? [p] : []; });
for (const f of walkAll(join(siteDir, "src"))) {
  let t = readFileSync(f, "utf8"); const o = t;
  for (const [from] of redirects) {
    const base = from.replace(/\/$/, "");
    t = t.replace(new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/?(?=[)\"'#?\\s<]|$)", "g"), sUrl);
  }
  if (t !== o) { relinked++; if (!dry) writeFileSync(f, t); }
}
console.log(`${dry ? "(dry) " : ""}folded ${moved.join(", ")} into ${sSlug}; ${redirects.length} redirects; ${relinked} files relinked`);
void walk; void appendFileSync;
