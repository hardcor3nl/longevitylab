import data from "../../data/products.json";
import cats from "../../data/productCategories.json";

export type EvidenceLevel = "Strong" | "Moderate" | "Emerging" | "Weak";
export type ProductCategory = string;
export type Goal = string;
export interface Product {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  category: ProductCategory;
  goals: Goal[];
  evidenceLevel: EvidenceLevel;
  price: string;
  badge?: string;
  summary: string;
  keyBenefits: string[];
  bestFor: string;
  affiliateUrl: string;
  reviewSlug?: string;
  reviewLabel?: string;
  [k: string]: unknown;
}
export const products = data as unknown as Product[];
export const getProductById = (id: string) => products.find((p) => p.id === id) ?? null;
export const getProductsByCategory = (cat: ProductCategory) => products.filter((p) => p.category === cat);
export const getProductsByGoal = (g: Goal) => products.filter((p) => p.goals.includes(g));
export const allCategories = cats.allCategories as ProductCategory[];
export const categoryGroups = cats.categoryGroups as { label: string; categories: ProductCategory[] }[];
export const evidenceBadgeColors: Record<EvidenceLevel, string> = {
  Strong: "bg-green/10 text-green-bright border-green/25",
  Moderate: "bg-amber/10 text-amber border-amber/25",
  Emerging: "bg-blue-500/10 text-blue-500 border-blue-500/25",
  Weak: "bg-red-500/10 text-red-400 border-red-500/25",
};
export const badgeColors: Record<string, string> = {
  "Best Pick": "bg-green/10 text-green-bright border-green/25",
  "Runner-Up": "bg-amber/10 text-amber border-amber/25",
  Budget: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Editor's Choice": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Premium: "bg-amber/10 text-amber border-amber/20",
};
