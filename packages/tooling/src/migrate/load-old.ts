import { build } from "esbuild";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** Bundle the old repo's TS data files (extensionless imports, JSON) and import the result. */
export async function loadOldData(repo: string) {
  const r = (p: string) => JSON.stringify(join(repo, p));
  const out = await build({
    stdin: {
      contents: `
        export { guides } from ${r("src/data/guides.ts")};
        export { reviewArticles } from ${r("src/data/reviewArticles.ts")};
        export { default as tools } from ${r("src/data/tools.json")};
        export { default as prompts } from ${r("src/data/prompts.json")};
        export { inspirationGuides } from ${r("src/data/inspirationGuides.ts")};
        export { projectStories } from ${r("src/data/projectStories.ts")};
      `,
      resolveDir: repo, loader: "ts",
    },
    bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  });
  const dir = mkdtempSync(join(tmpdir(), "vibe-old-"));
  const file = join(dir, "old.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return (await import(pathToFileURL(file).href)) as {
    guides: any[]; reviewArticles: any[]; tools: any[]; prompts: any[]; inspirationGuides: any[]; projectStories: any[];
  };
}
