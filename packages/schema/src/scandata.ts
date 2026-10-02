import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { STRONG_TELLS } from "./aitells.ts";

export interface DataIssue { severity: "fail" | "warn"; rule: string; file: string; message: string }

const SKIP_DIRS = new Set(["node_modules", "dist", ".astro", ".git"]);
const DATA_ROOTS = ["src/data", "src/legacy", "src/content/pages", "src/components", "src/pages"];
const EXT = /\.(json|tsx|astro)$/;

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    if (SKIP_DIRS.has(n)) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(n)) out.push(p);
  }
  return out;
}

// Em-dashes used alone as an "empty value" (a quoted, tagged or table cell value) are placeholders, not prose.
const PLACEHOLDER = /(["'`>|]\s*)—(\s*["'`<|,])/g;

/** Scan data JSON, legacy TSX and astro templates for prose em-dashes and strong AI tells. */
export function scanDataFiles(root: string): DataIssue[] {
  const issues: DataIssue[] = [];
  for (const r of DATA_ROOTS) {
    for (const f of walk(join(root, r))) {
      const text = readFileSync(f, "utf8");
      const rel = f.slice(root.length + 1).split("\\").join("/");
      const prose = text
        .split(/\r?\n/)
        .filter((l) => !/^\s*\|/.test(l) && !/^\s*(\/\/|\*|\/\*)/.test(l))
        .join("\n")
        .replace(PLACEHOLDER, "$1$2");
      const n = (prose.match(/—/g) ?? []).length;
      if (n) issues.push({ severity: "fail", rule: "data-em-dash", file: rel, message: `${n} em-dash(es) in data or template prose; use plain punctuation` });
      if (f.endsWith(".json")) {
        let strongTotal = 0;
        for (const t of STRONG_TELLS) strongTotal += (text.match(new RegExp(t.re.source, "gi")) ?? []).length;
        if (strongTotal) issues.push({ severity: "warn", rule: "data-ai-tell", file: rel, message: `${strongTotal} strong tell phrase(s)` });
      }
    }
  }
  return issues;
}
