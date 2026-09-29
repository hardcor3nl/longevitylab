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
  [k: string]: any;
}
export const protocols = data as unknown as Protocol[];
export const getProtocolById = (id: string) => protocols.find((p) => p.id === id) ?? null;
