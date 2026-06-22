#!/usr/bin/env bash
# One-touch publish: Obsidian -> blog-content -> push -> Cloudflare auto-deploys.
#
# Only blog-content needs updating. The blog repo (code) stays untouched —
# Cloudflare's prebuild clones the latest blog-content every time.
#
# Usage: npm run publish
set -euo pipefail

cd "$(dirname "$0")/.."
CONTENT_REPO="$HOME/github/blog-content"

echo "==> 1/4  Sync from Obsidian -> blog-content"
node scripts/sync-from-obsidian.mjs

echo ""
echo "==> 2/4  Fix code fence languages"
node scripts/infer-code-lang.mjs

echo ""
echo "==> 3/4  Local build (verify)"
npm run build

echo ""
echo "==> 4/4  Push blog-content"
cd "$CONTENT_REPO"
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "content: update $(date +%Y-%m-%d)"
  git push
  echo ""
  echo "✓ Done. Cloudflare will auto-build with latest content."
else
  echo "(no changes to publish)"
fi
