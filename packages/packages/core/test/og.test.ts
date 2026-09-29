import { expect, it } from "vitest";
import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";
import { headlineSize, ogCacheKey, renderOgImage, type OgBrand } from "../src/seo/og.ts";

const require = createRequire(import.meta.url);
// any woff in the workspace works for the smoke test: use the one shipped with fontsource in the vibe site
const fontPath = require.resolve("@fontsource/inter/files/inter-latin-600-normal.woff", { paths: [join(__dirname, "../../../sites/vibecodingintel")] });
const brand: OgBrand = { siteName: "Test Site", bg: "#faf9f6", ink: "#16181d", muted: "#5b606b", accent: "#0d6a61", rule: "#e2dfd6", headingFont: "Inter", bodyFont: "Inter", mark: "T",
  fonts: [{ name: "Inter", data: readFileSync(fontPath), weight: 600 }] };

it("renders a 1200x630 png and caches it", async () => {
  const dir = mkdtempSync(join(tmpdir(), "og-"));
  const a = await renderOgImage({ title: "Lovable pricing explained", eyebrow: "Guide" }, brand, dir);
  const m = await sharp(a).metadata();
  expect([m.width, m.height, m.format]).toEqual([1200, 630, "png"]);
  expect(readdirSync(dir)).toHaveLength(1);
  const b = await renderOgImage({ title: "Lovable pricing explained", eyebrow: "Guide" }, brand, dir);
  expect(b.equals(a)).toBe(true);
});
it("cache key changes with content and brand", () => {
  expect(ogCacheKey({ title: "a" }, brand)).not.toBe(ogCacheKey({ title: "b" }, brand));
  expect(ogCacheKey({ title: "a" }, brand)).not.toBe(ogCacheKey({ title: "a" }, { ...brand, accent: "#000" }));
});
it("long titles shrink", () => { expect(headlineSize("x".repeat(30))).toBeGreaterThan(headlineSize("x".repeat(90))); });
