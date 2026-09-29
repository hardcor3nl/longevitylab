import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function parseCsv(src: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = ""; if (row.some((x) => x !== "")) rows.push(row); row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const [head, ...rest] = rows;
  return rest.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

export const csvCell = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export interface LedgerRow {
  url: string; decision: "keep" | "merge" | "cut"; target_query: string; reason: string;
  redirect_target: string; date: string; status: string; word_count?: string; needs_sources?: string;
}
export const readLedger = (path: string) => parseCsv(readFileSync(path, "utf8")) as unknown as LedgerRow[];

/** Path of a URL's built HTML, or null if the build lacks it. */
export function distFileFor(dist: string, urlPath: string): string | null {
  const p = urlPath.split(/[?#]/)[0];
  const cands = p.endsWith("/") ? [join(dist, p, "index.html")] : [join(dist, p), join(dist, p, "index.html"), join(dist, p + ".html")];
  return cands.find((c) => existsSync(c) && !c.endsWith("/")) ?? null;
}

export const pathOf = (u: string) => (u.startsWith("http") ? new URL(u).pathname : u);

export function parseRedirectsFile(path: string): Map<string, { to: string; status: number }> {
  const m = new Map<string, { to: string; status: number }>();
  if (!existsSync(path)) return m;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [from, to, status] = t.split(/\s+/);
    m.set(from, { to, status: Number(status ?? 302) });
  }
  return m;
}

export const htmlToText = (html: string) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/?(a|strong|em|b|i|code|span|mark|small|sub|sup|time|abbr)\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/…/g, "...").replace(/[’‘]/g, "'").replace(/[“”]/g, '"')
    .replace(/\s+/g, " ").trim().toLowerCase();
