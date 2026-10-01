/**
 * Free-tools hub, API docs and press-kit specs (Job L3). Pure helpers, no Astro imports, unit-tested.
 * Every figure shown on those pages is passed in by the site, computed from its own dataset.
 */
import type { EmbedSpec } from "./embed.ts";

export interface HubEmbed { name: string; description: string; spec: EmbedSpec; /** e.g. "one card per provider: /embed/vpn-audit/<slug>/" */ variants?: string }
export interface HubChart { title: string; imgPath: string; pagePath: string; alt: string; width?: number; height?: number }
export interface HubDataset { name: string; description: string; pagePath: string; files: { label: string; href: string }[]; /** public GitHub repo URL, set by the orchestrator after the open-data repo is published */ repoUrl?: string }
export interface HubLink { name: string; href: string; description: string }
export interface HubTool { name: string; description: string; href: string; /** public GitHub repo URL, set after the open-source repo is published */ repoUrl?: string }
export interface HubSpec { origin: string; brand: string; embeds: HubEmbed[]; charts: HubChart[]; datasets: HubDataset[]; stats: HubLink[]; tools: HubTool[]; apiPath: string; pressPath: string; /** heading for the pages list, default "Statistics pages" */ statsTitle?: string }

export interface ApiField { name: string; type: string; example: string; filled: string }
export interface ApiEndpoint { path: string; format: "json" | "csv"; title: string; description: string; /** ISO date the data was last checked */ checked: string; records: number; fields: ApiField[]; pagePath: string }
export interface ApiSpec { origin: string; brand: string; licenceNote: string; cadence: string; endpoints: ApiEndpoint[]; hubPath: string; pressPath: string; cite: import("./embed.ts").CiteSpec }

export interface PressFact { value: string; label: string; /** how it was computed, plain words */ method: string; sourceName: string; sourcePath: string; checked: string }
export interface PressFile { label: string; href: string; note?: string }
export interface PressSpec { origin: string; brand: string; about: string; facts: PressFact[]; charts: PressFile[]; logos: PressFile[]; datasets: PressFile[]; hubPath: string; apiPath: string; contactPath: string; aboutPath: string }

const typeOf = (v: unknown): string => v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
const show = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  const s = typeof v === "string" ? v : JSON.stringify(v);
  const one = s.replace(/\s+/g, " ");
  return one.length > 60 ? one.slice(0, 57) + "..." : one;
};

/**
 * Infer a field table from real records: union of top-level keys, the type(s) seen, a short example from the
 * first non-null value, and how many records have a non-null value. Nothing is invented; it describes the served file.
 */
export function inferFields(records: Record<string, unknown>[]): ApiField[] {
  const keys: string[] = [];
  for (const r of records) for (const k of Object.keys(r)) if (!keys.includes(k)) keys.push(k);
  return keys.map((k) => {
    const vals = records.map((r) => r[k]);
    const nonNull = vals.filter((v) => v !== null && v !== undefined);
    const types = [...new Set(nonNull.map(typeOf))];
    const ex = nonNull.find((v) => typeof v !== "object") ?? nonNull[0];
    return { name: k, type: (types.length ? types.join(" or ") : "null") + (nonNull.length < records.length ? " (nullable)" : ""), example: nonNull.length ? show(ex) : "null", filled: `${nonNull.length} of ${records.length}` };
  });
}

/** Header names of a CSV text, first line only (quoted names handled). */
export function csvColumns(text: string): string[] {
  const line = text.split(/\r?\n/, 1)[0] ?? "";
  const out: string[] = []; let cur = ""; let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c;
  }
  if (line) out.push(cur);
  return out;
}

/** A JavaScript fetch example for an endpoint; keeps copy-paste snippets consistent across sites. */
export function fetchSnippet(origin: string, path: string, format: "json" | "csv"): string {
  const url = origin.replace(/\/$/, "") + path;
  return format === "json"
    ? `const res = await fetch("${url}");\nconst data = await res.json();\nconsole.log(Array.isArray(data) ? data.length : Object.keys(data));`
    : `const res = await fetch("${url}");\nconst rows = (await res.text()).trim().split(/\r?\n/);\nconsole.log(rows.length - 1, "rows");`;
}

/** Median of a list of numbers (used by press facts). */
export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** barChartSvg() puts "<title>. <values>" in alt; this returns the title part. */
export const chartTitle = (alt: string, fallback = "Chart"): string => (alt.split(/\.\s/)[0] || fallback).replace(/\.$/, "");

/** Hub and press entries for a site's `charts` object ({ name: { alt, width, height } }), served at /charts/<name>.svg. */
export function chartEntries(charts: Record<string, { alt: string; width?: number; height?: number }>, pagePath: string) {
  return {
    hub: Object.entries(charts).map(([k, c]) => ({ title: chartTitle(c.alt), imgPath: `/charts/${k}.svg`, pagePath, alt: chartTitle(c.alt), width: c.width, height: c.height })),
    press: Object.entries(charts).map(([k, c]) => ({ label: chartTitle(c.alt), href: `/charts/${k}.svg`, note: "SVG, CC BY 4.0" })),
  };
}
