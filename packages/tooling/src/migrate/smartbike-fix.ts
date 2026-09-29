/** Mechanical lint fixes only: year and "tested" out of titles (no updateLog entries invented), length caps, one banned verb. */
export function fixTitle(t: string): string {
  const x = t
    .replace(/\s*\|\s*SmartBikeWiki$/i, "")
    .replace(/\s*\(?(?<!\d)20\d\d(?!\d)\)?/g, "")
    .replace(/Tested Picks/i, "Researched Picks")
    .replace(/\(\s*\)/g, "")
    .replace(/:\s*:/g, ":")
    .replace(/\s+/g, " ")
    .replace(/\s+([:,])/g, "$1")
    .replace(/^[\s:]+|[\s:]+$/g, "");
  if (x.length <= 60) return x;
  const head = x.split(/:\s/)[0];
  if (head.length >= 20 && head.length <= 60) return head;
  const cut = x.slice(0, 60);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,:;\s-]+$/, "");
}

export function fixDesc(d: string): string {
  if (d.length <= 155) return d;
  const cut = d.slice(0, 154);
  const at = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "), cut.lastIndexOf(", "), cut.lastIndexOf(" "));
  return cut.slice(0, at).replace(/[,:;\s-]+$/, "") + ".";
}

export const lintFixBody = (s: string) => s.replace(/\bunlocks\b/g, "enables").replace(/\bunlock\b/g, "enable");
