/** Audited cost-per-study-dose dataset (data/thelongevityintel/longevity-cost-per-dose/). One loader for the page, the JSON/CSV downloads and the sitemap. */
const json = import.meta.glob("../../../../data/thelongevityintel/longevity-cost-per-dose/longevity-cost-per-dose.json", { eager: true, import: "default" }) as Record<string, any[]>;
const raw = import.meta.glob("../../../../data/thelongevityintel/longevity-cost-per-dose/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

export const cpdRecords: any[] = Object.values(json)[0] ?? [];
export const cpdDoc = (name: string) => Object.entries(raw).find(([k]) => k.endsWith(`/${name}.md`))?.[1];
export const cpdRows = () => cpdRecords.flatMap((r: any) => r.products.map((p: any) => ({ compound: r.compound, dose: r.studyDoses[0], studyDoses: r.studyDoses, checked: r.checked, ...p })));
/** Latest date across the records' `checked` and the CHANGELOG entries. */
export const cpdModified = () => {
  const ds = [...cpdRecords.map((r) => String(r.checked ?? "")), ...(cpdDoc("CHANGELOG")?.match(/\d{4}-\d{2}-\d{2}/g) ?? [])].filter(Boolean).sort();
  return ds.pop() ?? "2026-09-28";
};
export const CPD_COLUMNS = ["compound", "brand", "product", "price_usd", "servings", "active_per_serving", "study_dose_basis", "study", "study_year", "study_url", "cost_per_month_at_study_dose_usd", "third_party_testing_stated", "testing_source_url", "price_source_url", "checked", "note"] as const;
export const cpdFlat = () => cpdRows().map((r) => ({
  compound: r.compound, brand: r.brand, product: r.product, price_usd: r.price ?? "", servings: r.servings ?? "",
  active_per_serving: r.activePerServing == null ? "" : `${r.activePerServing} ${r.activeUnit ?? ""}`.trim(),
  study_dose_basis: r.costBasisDose ?? "", study: r.dose?.study ?? "", study_year: r.dose?.year ?? "", study_url: r.dose?.sourceUrl ?? "",
  cost_per_month_at_study_dose_usd: r.costPerStudyDosePerMonth ?? "", third_party_testing_stated: r.thirdPartyTesting ?? "",
  testing_source_url: r.thirdPartyTestingSource ?? "", price_source_url: r.priceSourceUrl ?? "", checked: r.checked ?? "", note: r.note ?? "",
}));
