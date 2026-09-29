/**
 * Build-time SVG charts. Static markup only, no client JS. Colours come from a theme object so each site
 * renders in its own palette. Every chart carries the domain as a small watermark bottom-right.
 */
import { escapeXml } from "../seo/sitemap.ts";

export interface ChartTheme { bg: string; ink: string; muted: string; grid: string; bar: string; bar2?: string; font: string }
export interface BarItem { label: string; value: number; highlight?: boolean }
export interface BarChartOpts {
  title: string; subtitle?: string; items: BarItem[]; domain: string; theme: ChartTheme;
  /** label for the value, e.g. "USD per month" */
  unit?: string; fmt?: (n: number) => string; width?: number; barHeight?: number;
}

export const DEFAULT_THEME: ChartTheme = { bg: "#ffffff", ink: "#111111", muted: "#555555", grid: "#dddddd", bar: "#2563eb", bar2: "#f59e0b", font: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" };

/** Horizontal bar chart. Returns a self-contained SVG string with role="img", title and description. */
export function barChartSvg(o: BarChartOpts): { svg: string; width: number; height: number; alt: string } {
  const W = o.width ?? 720, bh = o.barHeight ?? 26, gap = 10, top = o.subtitle ? 78 : 58, left = 190, right = 84, foot = 44;
  const fmt = o.fmt ?? ((n: number) => String(Math.round(n * 100) / 100));
  const max = Math.max(...o.items.map((i) => i.value), 1);
  const H = top + o.items.length * (bh + gap) + foot;
  const t = o.theme;
  const scale = (W - left - right) / max;
  const rows = o.items.map((it, i) => {
    const y = top + i * (bh + gap), w = Math.max(2, it.value * scale);
    const label = it.label.length > 26 ? it.label.slice(0, 25) + "…" : it.label;
    return `<text x="${left - 10}" y="${y + bh / 2 + 5}" text-anchor="end" font-size="14" fill="${t.ink}">${escapeXml(label)}</text>` +
      `<rect x="${left}" y="${y}" width="${w.toFixed(1)}" height="${bh}" rx="3" fill="${it.highlight ? (t.bar2 ?? t.bar) : t.bar}"/>` +
      `<text x="${(left + w + 8).toFixed(1)}" y="${y + bh / 2 + 5}" font-size="14" font-weight="600" fill="${t.ink}">${escapeXml(fmt(it.value))}</text>`;
  }).join("");
  const alt = `${o.title}. ` + o.items.map((i) => `${i.label}: ${fmt(i.value)}`).join("; ") + (o.unit ? ` (${o.unit})` : "") + ".";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d" font-family="${escapeXml(t.font)}">` +
    `<title id="t">${escapeXml(o.title)}</title><desc id="d">${escapeXml(alt)}</desc>` +
    `<rect width="${W}" height="${H}" fill="${t.bg}"/>` +
    `<text x="24" y="34" font-size="20" font-weight="700" fill="${t.ink}">${escapeXml(o.title)}</text>` +
    (o.subtitle ? `<text x="24" y="56" font-size="13" fill="${t.muted}">${escapeXml(o.subtitle)}</text>` : "") +
    `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${H - foot + 4}" stroke="${t.grid}"/>` +
    rows +
    (o.unit ? `<text x="24" y="${H - 16}" font-size="12" fill="${t.muted}">${escapeXml(o.unit)}</text>` : "") +
    `<text x="${W - 16}" y="${H - 16}" text-anchor="end" font-size="12" fill="${t.muted}" opacity=".85">${escapeXml(o.domain)}</text>` +
    `</svg>`;
  return { svg, width: W, height: H, alt };
}
