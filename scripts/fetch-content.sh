#!/usr/bin/env bash
# Fetch latest blog content from the blog-content repo.
# Runs as prebuild (CI) and before dev (local).
#
# On CI (Cloudflare Pages): clones via HTTPS + token.
# Locally: uses existing clone at ~/github/blog-content (symlink or copy).
set -euo pipefail

cd "$(dirname "$0")/.."
CONTENT_DIR="./content"

# If content/ already exists and has files, skip (local dev after first run)
if [ -d "$CONTENT_DIR/blog" ] && [ "$(ls "$CONTENT_DIR/blog/zh/" 2>/dev/null | wc -l)" -gt 0 ]; then
  # Just refresh images into public/
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  exit 0
fi

# Try local clone first (for development)
LOCAL_REPO="$HOME/github/blog-content"
if [ -d "$LOCAL_REPO/blog" ]; then
  echo "Using local blog-content: $LOCAL_REPO"
  rm -rf "$CONTENT_DIR"
  cp -r "$LOCAL_REPO" "$CONTENT_DIR"
  rm -rf "$CONTENT_DIR/.git"
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  exit 0
fi

# CI: clone from GitHub (needs CONTENT_REPO_URL or defaults to public)
REPO_URL="${CONTENT_REPO_URL:-https://github.com/ycjcl868/blog-content.git}"
echo "Cloning blog-content from $REPO_URL"
rm -rf "$CONTENT_DIR"
git clone --depth 1 "$REPO_URL" "$CONTENT_DIR"
rm -rf "$CONTENT_DIR/.git"
cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
