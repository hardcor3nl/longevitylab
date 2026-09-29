import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * Cloudflare Pages matches a `_redirects` source literally: `/old/ /new/ 301` does NOT match `/old`.
 * Old sites and Google's index used both forms, so every redirect source must exist in both.
 * `twinOf` returns the other slash form of a source, or null when there is none (files, splats, placeholders, the root).
 */
export function twinOf(from: string): string | null {
  if (from === "/" || !from.startsWith("/") || /[*:]/.test(from)) return null;
  if (from.endsWith("/")) return from.replace(/\/+$/, "") || null;
  if (/\.[a-z0-9]+$/i.test(from.split("/").pop() ?? "")) return null;
  return from + "/";
}

/** Both slash forms of a path (the path itself first). */
export const slashForms = (p: string): string[] => {
  const t = twinOf(p);
  return t ? [p, t] : [p];
};

/** Adds the missing slash twin next to every redirect line. Idempotent; comments and other lines stay untouched. */
export function withTwins(text: string): string {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const present = new Set<string>();
  for (const l of lines) { const t = l.trim(); if (t && !t.startsWith("#")) present.add(t.split(/\s+/)[0]); }
  const out: string[] = [];
  for (const l of lines) {
    out.push(l);
    const t = l.trim();
    if (!t || t.startsWith("#")) continue;
    const [from, ...rest] = t.split(/\s+/);
    if (rest.length < 2) continue;
    const tw = twinOf(from);
    if (tw && !present.has(tw)) { present.add(tw); out.push([tw, ...rest].join(" ")); }
  }
  return out.join(eol);
}

/** Writes the twin-completed file in place when it changed; returns how many rules were added. */
export function twinFile(path: string): number {
  if (!existsSync(path)) return 0;
  const src = readFileSync(path, "utf8");
  const next = withTwins(src);
  if (next === src) return 0;
  writeFileSync(path, next);
  return next.split(/\r?\n/).length - src.split(/\r?\n/).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const f of process.argv.slice(2)) console.log(`${f}: +${twinFile(f)} twin rules`);
}
