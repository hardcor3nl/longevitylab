import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

/**
 * Per-page Open Graph image: 1200x630 PNG rendered at build time with satori (text as vector paths, so the
 * output does not depend on system fonts) and rasterised with sharp. Results are cached on disk under
 * `cacheDir`, keyed by a hash of the inputs + brand + font bytes, so unchanged pages cost nothing on rebuild.
 * Sizing follows Google/Facebook guidance: 1.91:1, at least 1200 px wide.
 */
export const OG_WIDTH = 1200, OG_HEIGHT = 630;

export interface OgFont { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style?: "normal" }
export interface OgBrand {
  siteName: string;
  bg: string; ink: string; muted: string; accent: string; rule: string;
  /** font-family name in `fonts` used for the headline and for the small text */
  headingFont: string; bodyFont: string; headingWeight?: 400 | 500 | 600 | 700;
  fonts: OgFont[];
  /** optional short mark text (e.g. "V") drawn in an accent square next to the site name */
  mark?: string;
}
export interface OgInput { title: string; eyebrow?: string; footer?: string }

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style: { display: "flex", ...style }, children } });

/** Largest headline size that fits ~3 lines in the text box. */
export function headlineSize(title: string): number {
  const n = title.length;
  return n <= 40 ? 84 : n <= 70 ? 68 : n <= 100 ? 56 : 46;
}

export function ogTree(i: OgInput, b: OgBrand): Node {
  const size = headlineSize(i.title);
  return h("div", { width: OG_WIDTH, height: OG_HEIGHT, background: b.bg, flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", fontFamily: b.bodyFont, color: b.ink, borderTop: `14px solid ${b.accent}` }, [
    h("div", { alignItems: "center", gap: 16 }, [
      ...(b.mark ? [h("div", { width: 44, height: 44, background: b.accent, color: b.bg, alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 600, borderRadius: 4 }, b.mark)] : []),
      h("div", { fontSize: 30, fontWeight: 600, color: b.muted, letterSpacing: 0.5 }, b.siteName),
    ]),
    h("div", { flexDirection: "column", gap: 20 }, [
      ...(i.eyebrow ? [h("div", { fontSize: 26, fontWeight: 600, color: b.accent, textTransform: "uppercase", letterSpacing: 3 }, i.eyebrow)] : []),
      h("div", { fontFamily: b.headingFont, fontSize: size, fontWeight: b.headingWeight ?? 600, lineHeight: 1.1, letterSpacing: -1.2, color: b.ink }, i.title),
    ]),
    h("div", { justifyContent: "space-between", alignItems: "center", borderTop: `2px solid ${b.rule}`, paddingTop: 22, fontSize: 24, color: b.muted }, [
      h("div", {}, i.footer ?? ""), h("div", {}, ""),
    ]),
  ]);
}

export const ogCacheKey = (i: OgInput, b: OgBrand) =>
  createHash("sha256").update(JSON.stringify([i, { ...b, fonts: b.fonts.map((f) => [f.name, f.weight, createHash("sha256").update(f.data).digest("hex")]) }, "v1"])).digest("hex").slice(0, 24);

export async function renderOgImage(i: OgInput, b: OgBrand, cacheDir?: string): Promise<Buffer> {
  const file = cacheDir ? join(cacheDir, `${ogCacheKey(i, b)}.png`) : undefined;
  if (file && existsSync(file)) return readFileSync(file);
  const svg = await satori(ogTree(i, b) as any, {
    width: OG_WIDTH, height: OG_HEIGHT,
    fonts: b.fonts.map((f) => ({ name: f.name, data: f.data, weight: f.weight, style: f.style ?? "normal" })),
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  if (file) { mkdirSync(cacheDir!, { recursive: true }); writeFileSync(file, png); }
  return png;
}
