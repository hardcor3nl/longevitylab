/** Free-tools hub, API docs and press kit specs. Every number is computed from the cost-per-dose dataset at build time. YMYL: sourced figures only, no advice. */
import { inferFields, csvColumns, chartEntries, type HubSpec, type ApiSpec, type PressSpec } from "@portfolio/core";
import { cpdRecords, cpdFlat } from "./cpd";
import { stats, charts, money, slugify, shortCompound } from "./cpd-stats";
import { cpdEmbed, cite } from "./embeds";
import { GET as csvGet } from "../pages/data/longevity-cost-per-dose.csv.ts";
import site from "../../site.config.json";

export const PATHS = { hub: "/free-tools", api: "/api", press: "/press" } as const;
const brand = site.name;
const CHECKED = stats.checked;
const ch = chartEntries(charts, "/cost-per-dose-statistics");
const first = cpdRecords.find((r) => slugify(r.compound) === "creatine-monohydrate") ?? cpdRecords[0];
const csvText = await (csvGet({} as never) as Response).text();

export const hub: HubSpec = {
  origin: site.origin, brand, apiPath: PATHS.api, pressPath: PATHS.press,
  embeds: [{ name: "Supplement cost per study dose card", description: "List prices and what a month costs at the dose used in a cited human study, for one compound. Numbers only; the card says it is not dosing advice.", spec: cpdEmbed(slugify(first.compound), shortCompound(first.compound)), variants: `One card per compound: /embed/cost-per-dose/<slug> for all ${stats.compounds} compounds. The snippet below is for ${shortCompound(first.compound)}; change the slug for another compound.` }],
  charts: ch.hub,
  datasets: [{ name: "Supplement Cost per Study Dose", description: `${stats.products} products from ${stats.brands} brands covering ${stats.compounds} compounds, with list price and the computed monthly cost at the dose used in a cited human study. Numbers only, not dosing advice.`, pagePath: "/cost-per-dose", files: [{ label: "longevity-cost-per-dose.json", href: "/data/longevity-cost-per-dose.json" }, { label: "longevity-cost-per-dose.csv", href: "/data/longevity-cost-per-dose.csv" }] }],
  stats: [{ name: "Supplement cost-per-dose statistics", href: "/cost-per-dose-statistics", description: "median prices, cost at study doses and what brands say about testing, computed from the dataset." }],
  tools: [],
};

export const api: ApiSpec = {
  origin: site.origin, brand, hubPath: PATHS.hub, pressPath: PATHS.press,
  licenceNote: "Credit Longevity Intel and link to https://thelongevityintel.com/cost-per-dose. Study doses are context for comparing prices, not dosing advice.",
  cadence: "Rebuilt whenever a brand's product page is re-checked; each compound record carries its own checked date. Prices change without notice, so prices are as of the checked date.",
  endpoints: [
    { path: "/data/longevity-cost-per-dose.json", format: "json", title: "Supplement Cost per Study Dose", description: "One object per compound with the dose used in cited human studies and a products array (brand, price, servings, active amount per serving, computed monthly cost at the study dose, third-party testing statement and source).", checked: CHECKED, records: cpdRecords.length, fields: inferFields(cpdRecords), pagePath: "/cost-per-dose" },
    { path: "/data/longevity-cost-per-dose.csv", format: "csv", title: "Supplement Cost per Study Dose (CSV)", description: "One row per product, with its compound, price and computed monthly cost at the study dose.", checked: CHECKED, records: cpdFlat().length, fields: csvColumns(csvText).map((k) => ({ name: k, type: "", example: "", filled: "" })), pagePath: "/cost-per-dose" },
  ],
  cite: cite({ title: "Supplement Cost per Study Dose", path: "/cost-per-dose", date: CHECKED }),
};

const src = { sourceName: "Supplement Cost per Study Dose", sourcePath: "/cost-per-dose", checked: CHECKED };
const st = { sourceName: "Supplement cost-per-dose statistics", sourcePath: "/cost-per-dose-statistics", checked: CHECKED };
const s = stats;
export const press: PressSpec = {
  origin: site.origin, brand, hubPath: PATHS.hub, apiPath: PATHS.api, contactPath: "/contact", aboutPath: "/about",
  about: "Longevity Intel publishes evidence-focused longevity guides with visible sources, limitations and affiliate disclosures. The figures here are prices and study doses only. They are not dosing advice, and no medical review is claimed.",
  facts: [
    { value: `${s.products} products`, label: `from ${s.brands} brands covering ${s.compounds} compounds in the dataset`, method: "count of product rows, distinct brands and compounds.", ...src },
    { value: money(s.medianPrice)!, label: "median list price per product", method: "median of each product's list price in USD on the brand's own page, with no coupons or subscription discounts.", ...st },
    { value: money(s.medianCost)!, label: `median monthly cost at the dose used in a cited study, across ${s.costed} products with a computed cost`, method: "price per serving x (study dose / active amount per serving) x 30; products where this cannot be computed from the label are left out.", ...st },
    { value: `${money(s.lo.costPerStudyDosePerMonth)} to ${money(s.hi.costPerStudyDosePerMonth)}`, label: "range of monthly cost at the study dose", method: "lowest and highest computed cost among the products. Study doses differ by orders of magnitude between compounds.", ...st },
    { value: `${s.cls.named} of ${s.products}`, label: "products name a product certifier such as NSF Certified for Sport or IFOS", method: "testing statement as written on the product page; we tested no product.", ...st },
  ],
  charts: ch.press,
  datasets: [{ label: "longevity-cost-per-dose.json", href: "/data/longevity-cost-per-dose.json", note: "JSON, CC BY 4.0" }, { label: "longevity-cost-per-dose.csv", href: "/data/longevity-cost-per-dose.csv", note: "CSV, CC BY 4.0" }],
  logos: [{ label: "Icon, 512 x 512 PNG", href: "/icon-512.png" }, { label: "Icon, 192 x 192 PNG", href: "/icon-192.png" }, { label: "Icon, PNG", href: "/icon.png" }],
};
export const pressCite = cite({ title: "Supplement Cost per Study Dose", path: "/cost-per-dose", date: CHECKED });
