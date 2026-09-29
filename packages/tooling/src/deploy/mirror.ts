import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Exports a self-contained copy of ONE site (plus the workspace packages it uses) into a folder that can
 * be committed to that site's existing repo. Cloudflare Pages then builds it with whatever command and
 * output directory the old project has: `npm run build`, `pnpm build`, output `dist` or `out`.
 *
 *   node --experimental-strip-types packages/tooling/src/deploy/mirror.ts <site> <outDir> [--no-lock]
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const SKIP_DIRS = new Set(["node_modules", "dist", "out", ".astro", ".wrangler", ".cache", "research"]);
const SITE_DOCS = /^(BRIEF|CONTENT_PLAN|DESIGN|LEDGER_[A-Z_0-9]+)\.md$/;

const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"));

/** Workspace packages a site needs: workspace:* dependencies (transitively) and any ../../packages/<name> path used by its scripts. */
export function usedPackages(root: string, site: string): string[] {
  const seen = new Set<string>();
  const byName = new Map<string, string>();
  for (const d of readdirSync(join(root, "packages"))) {
    const pj = join(root, "packages", d, "package.json");
    if (existsSync(pj)) byName.set(readJson(pj).name, d);
  }
  const visit = (pkgJson: { dependencies?: Record<string, string>; devDependencies?: Record<string, string>; scripts?: Record<string, string> }) => {
    for (const deps of [pkgJson.dependencies, pkgJson.devDependencies])
      for (const [n, v] of Object.entries(deps ?? {})) {
        const d = byName.get(n);
        if (d && String(v).startsWith("workspace:") && !seen.has(d)) { seen.add(d); visit(readJson(join(root, "packages", d, "package.json"))); }
      }
    for (const s of Object.values(pkgJson.scripts ?? {}))
      for (const m of s.matchAll(/packages\/([\w-]+)/g))
        if (byName.has(readJson(join(root, "packages", m[1], "package.json")).name) && !seen.has(m[1])) { seen.add(m[1]); visit(readJson(join(root, "packages", m[1], "package.json"))); }
  };
  visit(readJson(join(root, "sites", site, "package.json")));
  return [...seen].sort();
}

const filter = (isSite: boolean) => (src: string) => {
  const parts = src.split(sep);
  const base = parts[parts.length - 1];
  if (SKIP_DIRS.has(base)) return false;
  if (isSite && SITE_DOCS.test(base)) return false;
  if (isSite && base === "wrangler.toml") return false; // placeholder D1 id; Pages settings own bindings
  return true;
};

export function buildMirror(site: string, out: string, opts: { lock?: boolean; root?: string } = {}): { packages: string[]; out: string } {
  const root = opts.root ?? ROOT;
  const siteDir = join(root, "sites", site);
  if (!existsSync(join(siteDir, "package.json"))) throw new Error(`no such site: ${site}`);
  const pkgs = usedPackages(root, site);
  const rootPkg = readJson(join(root, "package.json"));
  const pm: string = rootPkg.packageManager ?? "pnpm@10.33.0";
  const outDir = resolve(out);
  if (existsSync(outDir) && readdirSync(outDir).some((n) => n !== ".git")) throw new Error(`${outDir} is not empty`);
  mkdirSync(outDir, { recursive: true });

  cpSync(siteDir, join(outDir, "sites", site), { recursive: true, filter: filter(true) });
  for (const p of pkgs) cpSync(join(root, "packages", p), join(outDir, "packages", p), { recursive: true, filter: filter(false) });
  // site datasets imported from the repo root (e.g. ../../../../data/<site>/...) keep their relative location
  if (existsSync(join(root, "data", site))) cpSync(join(root, "data", site), join(outDir, "data", site), { recursive: true });

  // Pages Functions live at the repo root; their relative imports of site files are rewritten to match.
  const fnSrc = join(outDir, "sites", site, "functions");
  if (existsSync(fnSrc)) {
    cpSync(fnSrc, join(outDir, "functions"), { recursive: true });
    rmSync(fnSrc, { recursive: true, force: true });
    const rewrite = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) rewrite(p);
        else if (/\.ts$/.test(e.name)) {
          const s = readFileSync(p, "utf8");
          const n = s.replace(/(from\s+")((?:\.\.\/)+)src\//g, (_m, a, ups) => `${a}${ups}sites/${site}/src/`);
          if (n !== s) writeFileSync(p, n);
        }
      }
    };
    rewrite(join(outDir, "functions"));
  }

  const version = pm.split("@")[1];
  const rootOut = {
    name: `${site}-site`,
    private: true,
    packageManager: pm,
    engines: { node: ">=22" },
    scripts: { build: "node build.mjs" },
    // @portfolio/core at the root lets the Pages Functions bundler resolve it from ./functions
    dependencies: { "@portfolio/core": "workspace:*" },
  };
  writeFileSync(join(outDir, "package.json"), JSON.stringify(rootOut, null, 2) + "\n");
  writeFileSync(join(outDir, "pnpm-workspace.yaml"), `packages:\n  - packages/*\n  - sites/*\nonlyBuiltDependencies:\n  - esbuild\n  - sharp\n  - workerd\n`);
  writeFileSync(join(outDir, ".node-version"), "22\n");
  writeFileSync(join(outDir, ".npmrc"), "engine-strict=true\n");
  writeFileSync(join(outDir, ".gitignore"), "node_modules\ndist\nout\n.astro\n.wrangler\n.DS_Store\n*.log\n");
  writeFileSync(join(outDir, "copy-output.mjs"), `import { cpSync, existsSync, rmSync } from "node:fs";
const src = "sites/${site}/dist";
if (!existsSync(src)) { console.error("build output missing: " + src); process.exit(1); }
for (const d of ["dist", "out"]) { rmSync(d, { recursive: true, force: true }); cpSync(src, d, { recursive: true }); }
console.log("copied " + src + " to ./dist and ./out");
`);
  writeFileSync(join(outDir, "build.mjs"), `// Cloudflare Pages entry: "npm run build" (or "pnpm build"), output dist or out. Steps: corepack/pnpm, install, build the site, copy output.
import { spawnSync } from "node:child_process";
const sh = (cmd, soft) => { console.log("$ " + cmd); const r = spawnSync(cmd, { shell: true, stdio: "inherit" }); if (r.status !== 0 && !soft) process.exit(r.status ?? 1); return r.status === 0; };
sh("corepack enable", true);
const pnpm = sh("pnpm --version", true) ? "pnpm" : "npx --yes pnpm@${version}";
sh(pnpm + " install --frozen-lockfile");
sh(pnpm + " --filter ${site} build");
sh("node copy-output.mjs");
`);

  if (opts.lock !== false) {
    const r = spawnSync("pnpm install --lockfile-only", { cwd: outDir, shell: true, stdio: "inherit" });
    if (r.status !== 0) throw new Error("pnpm install --lockfile-only failed");
  }
  return { packages: pkgs, out: outDir };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [site, out, ...flags] = process.argv.slice(2);
  if (!site || !out) { console.error("usage: mirror <site> <outDir> [--no-lock]"); process.exit(2); }
  const r = buildMirror(site, out, { lock: !flags.includes("--no-lock") });
  console.log(`mirrored ${site} (+ packages: ${r.packages.join(", ")}) to ${r.out}`);
}
