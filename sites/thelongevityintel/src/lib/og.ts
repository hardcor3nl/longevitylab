import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { renderOgImage, type OgBrand } from "@portfolio/core";
import site from "../../site.config.json";

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(join(require.resolve(`${pkg}/package.json`), "..", "files", file));

/** Brand style for Longevity Intel: cream paper, Instrument Serif headlines, DM Sans small text, deep green accent (mirrors global.css tokens). */
export const brand: OgBrand = {
  siteName: site.name, mark: "L",
  bg: "#f5f2eb", ink: "#0f1410", muted: "#566758", accent: "#1a6b3a", rule: "#ddd8ce",
  headingFont: "Instrument Serif", bodyFont: "DM Sans", headingWeight: 400,
  fonts: [
    { name: "Instrument Serif", data: font("@fontsource/instrument-serif", "instrument-serif-latin-400-normal.woff"), weight: 400 },
    { name: "DM Sans", data: font("@fontsource/dm-sans", "dm-sans-latin-600-normal.woff"), weight: 600 },
  ],
};
const cacheDir = join(process.cwd(), "node_modules", ".cache", "og");
export const ogPng = (title: string, eyebrow?: string, footer?: string) => renderOgImage({ title, eyebrow, footer: footer ?? new URL(site.origin).host }, brand, cacheDir);
export const ogUrl = (key: string) => new URL(`/og/${key}.png`, site.origin).toString();
