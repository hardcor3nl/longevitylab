import { build } from "esbuild";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** Bundle the Nomad Terminal repo's TS data layer (extensionless imports, "@/" alias) and import the result. */
export async function loadNomadData(repo: string, draftsRepo?: string) {
  const r = (p: string, base = repo) => JSON.stringify(join(base, p));
  const draftExports = draftsRepo
    ? [[35, "ThirtyFive"], [36, "ThirtySix"], [37, "ThirtySeven"]].map(([n, w]) => `export { cityGuideBlogPosts${w} as draft${n} } from ${r(`src/data/blog-city-guides-${n}.ts`, draftsRepo)};`).join("\n")
    : "";
  const out = await build({
    stdin: {
      contents: `
        export { regions } from ${r("src/data/regions.ts")};
        export { countries } from ${r("src/data/countries.ts")};
        export { cities } from ${r("src/data/cities.ts")};
        export { guides } from ${r("src/data/guides.ts")};
        export { blogPosts } from ${r("src/data/blog.ts")};
        export { visas } from ${r("src/data/visas.ts")};
        export { insuranceProviders } from ${r("src/data/insurance.ts")};
        export { insuranceFaqs } from ${r("src/data/insuranceFaqs.ts")};
        export { costBreakdowns } from ${r("src/data/costBreakdowns.ts")};
        export { coworkingSpaces } from ${r("src/data/coworking.ts")};
        export { thingsToDoByCity } from ${r("src/data/thingsToDo.ts")};
        export { cityNarratives } from ${r("src/data/cityNarratives.ts")};
        export { cityEvidence } from ${r("src/data/cityEvidence.ts")};
        export { cityHeroes, guideHeroes, blogHeroes, getCityHero, getGuideHero, getBlogHero, getCountryHero } from ${r("src/data/media.ts")};
        export { affiliates } from ${r("src/data/affiliates.ts")};
        ${draftExports}
      `,
      resolveDir: repo, loader: "ts",
    },
    alias: { "@": join(repo, "src") },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  });
  const dir = mkdtempSync(join(tmpdir(), "nomad-old-"));
  const file = join(dir, "old.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return (await import(pathToFileURL(file).href)) as Record<string, any>;
}
