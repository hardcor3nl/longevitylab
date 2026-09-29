import type { APIRoute } from "astro";
import { cpdFlat, CPD_COLUMNS } from "../../lib/cpd";
const q = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export const GET: APIRoute = () => new Response([CPD_COLUMNS.join(","), ...cpdFlat().map((r) => CPD_COLUMNS.map((c) => q((r as any)[c])).join(","))].join("\n") + "\n", { headers: { "content-type": "text/csv; charset=utf-8" } });
