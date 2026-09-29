#!/bin/bash
# Full local gate run for sites/gtasixguide (build must be done; preview on :4394 serving dist).
#   bash packages/tooling/scripts/gta-gates.sh
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
SITE="$ROOT/sites/gtasixguide"; T="$ROOT/packages/tooling"
export CHROME_PATH="${CHROME_PATH:-C:/Users/michael/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe}"
OUT="$ROOT/program/audits/design/gtasixguide/gates"; mkdir -p "$OUT"
echo "== axe (dark, only theme: site has no light mode)"
(cd "$T" && THEMES=dark node scripts/axe.mjs http://127.0.0.1:4394 "$(cygpath -m "$SITE/dist")") > "$OUT/axe.log" 2>&1; tail -1 "$OUT/axe.log" | cut -c1-300
echo "== lighthouse mobile"
for p in / /news/ /news/technical-showdown/; do
  n=$(echo "$p" | sed 's#/#_#g'); [ "$n" = "_" ] && n=_home
  node "$T/node_modules/lighthouse/cli/index.js" "http://127.0.0.1:4394$p" --quiet --output json --output-path "$OUT/lh$n.json" --chrome-flags="--headless=new --no-sandbox" --only-categories=performance,accessibility,best-practices,seo > /dev/null 2>&1
  node -e '
const r=require(process.argv[1]);const c=r.categories;const a=r.audits;
console.log(process.argv[2],"perf",Math.round(c.performance.score*100),"a11y",Math.round(c.accessibility.score*100),"bp",Math.round(c["best-practices"].score*100),"seo",Math.round(c.seo.score*100),"LCP",a["largest-contentful-paint"].displayValue,"CLS",a["cumulative-layout-shift"].displayValue,"TBT",a["total-blocking-time"].displayValue)' "$OUT/lh$n.json" "$p"
done
echo "== links"
(cd "$SITE" && node --experimental-strip-types "$T/src/links.ts" --dist dist --sample 0 --redirects public/_redirects 2>&1 | tail -4)
echo GATES-DONE
