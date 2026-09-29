// Cloudflare Pages entry: "npm run build" (or "pnpm build"), output dist or out. Steps: corepack/pnpm, install, build the site, copy output.
import { spawnSync } from "node:child_process";
const sh = (cmd, soft) => { console.log("$ " + cmd); const r = spawnSync(cmd, { shell: true, stdio: "inherit" }); if (r.status !== 0 && !soft) process.exit(r.status ?? 1); return r.status === 0; };
sh("corepack enable", true);
const pnpm = sh("pnpm --version", true) ? "pnpm" : "npx --yes pnpm@10.33.0";
sh(pnpm + " install --frozen-lockfile");
sh(pnpm + " --filter thelongevityintel build");
sh("node copy-output.mjs");
