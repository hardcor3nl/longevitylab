import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { Doc } from "./lint.ts";

export function splitFrontmatter(src: string): { data: unknown; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(src);
  if (!m) return { data: undefined, body: src };
  return { data: parse(m[1]), body: m[2] };
}

export function walk(dir: string, exts = [".md", ".mdx"]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

export function loadDocs(dir: string): Doc[] {
  return walk(dir).map((file) => {
    const { data, body } = splitFrontmatter(readFileSync(file, "utf8"));
    return { file, frontmatter: data, body };
  });
}
