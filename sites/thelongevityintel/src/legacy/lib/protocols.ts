import data from "../../data/protocols.json";

export interface ProtocolSupplement { [k: string]: any }
export interface ProtocolSection { [k: string]: any }
export interface Protocol {
  id: string;
  expert: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  role: string;
  website: string;
  approach: string;
  keyPhilosophy: string[];
  expertImage: string;
  expertImageCredit: ImageCredit;
  [k: string]: any;
}
/** Attribution for a Creative Commons portrait (required by the licence). */
export interface ImageCredit { author: string; license: string; licenseUrl: string; source: string; sourceUrl: string }
export const creditLine = (c: ImageCredit) => `Photo: ${c.author}, ${c.license}, via ${c.source}`;
export const protocols = data as unknown as Protocol[];
export const getProtocolById = (id: string) => protocols.find((p) => p.id === id) ?? null;
