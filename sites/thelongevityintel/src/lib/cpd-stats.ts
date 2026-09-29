/** Figures computed from data/thelongevityintel/longevity-cost-per-dose at build time. Numbers only: no advice, no dosing. */
import { cpdRecords, cpdRows, cpdModified } from "./cpd";
import { barChartSvg, DEFAULT_THEME, type BarItem } from "@portfolio/core";
import site from "../../site.config.json";

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const money = (n: number | null | undefined) => (n == null ? null : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export const shortCompound = (c: string) => c.replace(/ \(.*\)$/, "");

export type Testing = "named" | "unnamed" | "none";
/** Product certification by a named certifier, a brand-stated test with no named certifier or a self-published result, or nothing stated. */
export const testingClass = (t: string | null | undefined): Testing => {
  if (!t || /^none stated/i.test(t)) return "none";
  if (/NSF Certified for Sport|IFOS/i.test(t)) return "named";
  return "unnamed";
};
export const TESTING_LABEL: Record<Testing, string> = { named: "Named product certification (NSF Certified for Sport or IFOS)", unnamed: "Testing stated by the brand; certifier unnamed, generic or self-published", none: "No testing stated" };

const rows = cpdRows();
const costed = rows.filter((r) => r.costPerStudyDosePerMonth != null);
const byCompound = cpdRecords.map((rec: any) => {
  const ps = rec.products as any[];
  const c = ps.filter((p) => p.costPerStudyDosePerMonth != null).map((p) => p.costPerStudyDosePerMonth as number);
  const prices = ps.map((p) => p.price as number).filter((x) => x != null);
  return { compound: rec.compound as string, slug: slugify(rec.compound), products: ps.length, costed: c.length, medianCost: c.length ? median(c) : null, minCost: c.length ? Math.min(...c) : null, maxCost: c.length ? Math.max(...c) : null, minPrice: Math.min(...prices), maxPrice: Math.max(...prices), basis: rec.studyDoses[0]?.doseText as string, checked: rec.checked as string };
});
const cls = { named: 0, unnamed: 0, none: 0 } as Record<Testing, number>;
for (const r of rows) cls[testingClass(r.thirdPartyTesting)]++;
const lo = costed.reduce((a, b) => (a.costPerStudyDosePerMonth <= b.costPerStudyDosePerMonth ? a : b)), hi = costed.reduce((a, b) => (a.costPerStudyDosePerMonth >= b.costPerStudyDosePerMonth ? a : b));
const brands = new Set(rows.map((r) => r.brand));
const namedCosted = costed.filter((r) => testingClass(r.thirdPartyTesting) === "named");
const otherCosted = costed.filter((r) => testingClass(r.thirdPartyTesting) !== "named");

export const stats = {
  checked: cpdModified(), compounds: cpdRecords.length, products: rows.length, costed: costed.length, brands: brands.size,
  medianCost: median(costed.map((r) => r.costPerStudyDosePerMonth)), medianPrice: median(rows.map((r) => r.price)),
  lo, hi, cls, byCompound,
  medianNamed: namedCosted.length ? median(namedCosted.map((r) => r.costPerStudyDosePerMonth)) : null, nNamed: namedCosted.length,
  medianOther: otherCosted.length ? median(otherCosted.map((r) => r.costPerStudyDosePerMonth)) : null, nOther: otherCosted.length,
  under10: costed.filter((r) => r.costPerStudyDosePerMonth < 10).length, over100: costed.filter((r) => r.costPerStudyDosePerMonth > 100).length,
};

const theme = { ...DEFAULT_THEME, bg: "#f5f2eb", bar: "#1a6b3a", bar2: "#8a5300" };
const domain = site.origin.replace("https://", "");
const costItems: BarItem[] = byCompound.filter((c) => c.medianCost != null).sort((a, b) => a.medianCost! - b.medianCost!).map((c) => ({ label: shortCompound(c.compound), value: c.medianCost! }));
const testItems: BarItem[] = (["named", "unnamed", "none"] as Testing[]).map((k) => ({ label: k === "named" ? "Named certification" : k === "unnamed" ? "Unnamed or self-stated" : "None stated", value: cls[k], highlight: k === "none" }));
export const charts = {
  "supplement-cost-per-study-dose": { ...barChartSvg({ title: "Monthly cost at the dose used in a cited study", subtitle: `Median across products per compound, ${costItems.length} compounds, USD, checked ${stats.checked}`, items: costItems, domain, theme, fmt: (n) => money(n) ?? "", unit: "Price and dose quoted from the cited study; not a dosing recommendation" }), title: "Monthly cost at the dose used in a cited study", caption: `Median monthly cost of the products for each compound, at the dose used in the study cited on the dataset page (${stats.costed} products, ${costItems.length} compounds). Study doses are context, not advice.` },
  "supplement-testing-statements": { ...barChartSvg({ title: "Third-party testing stated by the brand", subtitle: `${stats.products} products from ${stats.brands} brands, as stated on the product page, checked ${stats.checked}`, items: testItems, domain, theme, fmt: (n) => `${n} products`, unit: "Statements as the brand wrote them; we did not test any product" }), title: "Third-party testing stated by the brand", caption: `How the ${stats.products} products describe their testing: ${cls.named} name a certifier, ${cls.unnamed} state testing without one, ${cls.none} state none.` },
} as const;
export type ChartKey = keyof typeof charts;
