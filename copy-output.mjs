import { cpSync, existsSync, rmSync } from "node:fs";
const src = "sites/thelongevityintel/dist";
if (!existsSync(src)) { console.error("build output missing: " + src); process.exit(1); }
for (const d of ["dist", "out"]) { rmSync(d, { recursive: true, force: true }); cpSync(src, d, { recursive: true }); }
console.log("copied " + src + " to ./dist and ./out");
