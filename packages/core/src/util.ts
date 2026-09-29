export const canonicalUrl = (site: string, path: string, trailingSlash: "always" | "never") => {
  const clean = path === "/" ? "/" : trailingSlash === "always" ? path.replace(/\/?$/, "/") : path.replace(/\/$/, "");
  return new URL(clean, site).toString();
};
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
