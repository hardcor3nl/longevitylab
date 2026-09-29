import data from "../../data/supplements.json";

export type EvidenceLevel = "Strong" | "Moderate" | "Emerging" | "Weak";
export type Goal = string;
export type Category = string;
export interface Supplement {
  id: string;
  name: string;
  aliases: string[];
  category: Category;
  goals: Goal[];
  evidenceLevel: EvidenceLevel;
  summary: string;
  mechanism: string;
  dosage: string;
  timing: string;
  stacksWith: string[];
  avoid: string[];
  affiliateUrl: string;
  reviewSlug?: string;
  [k: string]: unknown;
}
export const supplements = data as unknown as Supplement[];
export const evidenceBadge: Record<EvidenceLevel, string> = {
  Strong: "bg-green/10 text-green-bright border-green/25",
  Moderate: "bg-amber/10 text-amber border-amber/25",
  Emerging: "bg-blue-500/10 text-blue-500 border-blue-500/25",
  Weak: "bg-red-500/10 text-red-400 border-red-500/25",
};
export const getSupplementById = (id: string) => supplements.find((s) => s.id === id) ?? null;
export const getSupplementsByGoal = (g: Goal) => supplements.filter((s) => s.goals.includes(g));
export const getSupplementsByCategory = (c: Category) => supplements.filter((s) => s.category === c);
