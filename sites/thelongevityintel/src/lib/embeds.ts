import type { EmbedSpec, CiteSpec } from "@portfolio/core";
import site from "../../site.config.json";

export const EM_VARS = "--em-bg:#f5f2eb;--em-ink:#0f1410;--em-accent:#1a6b3a;--em-muted:#4a5a4c;--em-line:#c9c3b6;--em-radius:14px";

/** Trailing slash "never" on this site: paths carry none. */
export const cpdEmbed = (slug: string, name: string): EmbedSpec => ({
  origin: site.origin, embedPath: `/embed/cost-per-dose/${slug}`, pagePath: "/cost-per-dose",
  id: `cpd-${slug}`, title: `${name} cost per study dose`, height: 560, brand: "Supplement Cost per Study Dose by Longevity Intel",
  imagePath: `/embed/cost-per-dose/${slug}.png`, imageAlt: `${name} cost per study dose, from the Longevity Intel dataset`, imageWidth: 1200, imageHeight: 630,
});

export const cite = (o: { title: string; path: string; date: string }): CiteSpec => ({
  title: o.title, author: site.editorialName, site: site.name, url: site.origin + o.path, date: o.date,
});
