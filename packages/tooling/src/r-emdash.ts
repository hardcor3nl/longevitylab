// Job R: replace em-dashes in prose with commas/colons. Never touches tables, code, headings, or lone placeholder dashes.
// usage: node --experimental-strip-types packages/tooling/src/r-emdash.ts <site> [--dry]
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { walk } from "../../schema/src/index.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const DASH = /\s?—\s?|&mdash;/;

/** Convert one line of prose. `yaml` lines may not gain ": " (breaks unquoted scalars). */
export function fixLine(line: string, yaml: boolean): string {
  if (!/—|&mdash;/.test(line)) return line;
  if (/^\s*#{1,6}\s/.test(line)) return line.replace(/\s?—\s?/, ": ").replace(/\s?—\s?/g, ", ");
  if (/^\s*\|/.test(line) || /^\s*(import|export) /.test(line) || /^\s*<[^>]*—[^>]*>\s*$/.test(line)) return line;
  // lone placeholder dash (e.g. "| — |" cells, "n/a — ")
  if (/^\s*—\s*$/.test(line)) return line;
  // protect link/inline-code/url contents
  const holds: string[] = [];
  let s = line.replace(/`[^`]*`|\]\([^)]*\)|https?:\/\/\S+/g, (m) => { holds.push(m); return `\u0000${holds.length - 1}\u0000`; });
  const parts = s.split(/\s?—\s?|&mdash;/);
  if (parts.length === 1) return line;
  // sentence-aware: handle each dash in order
  let out = parts[0];
  let open = false;
  const dashesInSentence = (txt: string) => txt;
  for (let i = 1; i < parts.length; i++) {
    const rest = parts[i];
    // is this dash part of a pair (another dash follows before sentence end)?
    const nextDashBeforeEnd = i < parts.length - 1 && !/[.!?]\s+[A-Z]/.test(rest);
    const before = out;
    const lastTerm = /\*\*[^*]+\*\*$|^\s*[-*]\s+\*\*[^*]+\*\*$|^\s*[-*]\s+[^,.:;]{1,40}$/.test(before.trimEnd());
    const tail = rest.split(/(?<=[.!?])\s/)[0];
    const tailWords = tail.trim().split(/\s+/).length;
    let sep: string;
    if (open) { sep = ", "; open = false; }
    else if (nextDashBeforeEnd) { sep = ", "; open = true; }
    else if (/^(?:and|but|or|so|yet|which|while|although|though)\b/i.test(rest.trim())) sep = ", ";
    else if (!yaml && /^(?:it|this|that|they|you|there|we|these|those|he|she|i|each|most|some|none|no|not|only|do|does|don't|doesn't)\b|^the (?:[\w'-]+ ){1,3}?(?:is|are|was|were|has|have|had|can|will|would|does|do|did|means|makes|reduces|produces)\b/i.test(rest.trim()) && tailWords >= 3 && !/^\s*[-*]\s/.test(before)) {
      out = out.replace(/[,;:]\s*$/, "") + ". " + rest.trim().replace(/^./, (c) => c.toUpperCase());
      continue;
    }
    else if (/^(?:\s*,|\s*\))/.test(rest)) sep = "";
    else if (lastTerm && !yaml) sep = ": ";
    else if (tailWords <= 9 || yaml) sep = ", ";
    else sep = ": ";
    // after a colon the next word keeps its case unless it is "I"/proper; lowercase start is fine
    out += sep + rest.replace(/^\s+/, "");
    void dashesInSentence;
  }
  return out.replace(/\u0000(\d+)\u0000/g, (_, n) => holds[Number(n)]);
}

export function fixFile(src: string): string {
  const m = /^(---\r?\n[\s\S]*?\r?\n---\r?\n?)([\s\S]*)$/.exec(src);
  const [head, body] = m ? [m[1], m[2]] : ["", src];
  let inFence = false;
  const lines = body.split("\n").map((l) => {
    if (/^\s*```/.test(l)) { inFence = !inFence; return l; }
    return inFence ? l : fixLine(l, false);
  });
  const hl = head.split("\n").map((l, idx) => (idx === 0 || /^---\s*$/.test(l) ? l : fixLine(l, true)));
  return hl.join("\n") + lines.join("\n");
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].split("\\").join("/")}`).href) {
  const site = process.argv[2];
  const dry = process.argv.includes("--dry");
  let changed = 0, before = 0, after = 0;
  for (const f of walk(join(ROOT, "sites", site, "src/content"))) {
    const src = readFileSync(f, "utf8");
    const out = fixFile(src);
    before += (src.match(/—/g) ?? []).length;
    after += (out.match(/—/g) ?? []).length;
    if (out !== src) { changed++; if (!dry) writeFileSync(f, out); }
  }
  console.log(`${site}: ${changed} files changed, em-dashes ${before} -> ${after}${dry ? " (dry)" : ""}`);
}
