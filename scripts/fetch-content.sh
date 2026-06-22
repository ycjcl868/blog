#!/usr/bin/env bash
# Fetch latest blog content. Local dev uses ~/github/blog-content, CI uses GitHub API tarball.
set -euo pipefail

cd "$(dirname "$0")/.."
CONTENT_DIR="./content"

# Already fetched? Just sync images.
if [ -d "$CONTENT_DIR/blog" ] && [ "$(ls "$CONTENT_DIR/blog/zh/" 2>/dev/null | wc -l)" -gt 0 ]; then
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  exit 0
fi

# Local dev
LOCAL_REPO="$HOME/github/blog-content"
if [ -d "$LOCAL_REPO/blog" ]; then
  echo "Using local blog-content"
  rm -rf "$CONTENT_DIR"
  cp -r "$LOCAL_REPO" "$CONTENT_DIR"
  rm -rf "$CONTENT_DIR/.git"
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  exit 0
fi

# CI: GitHub API tarball (env: CONTENT_REPO_TOKEN)
TOKEN="${CONTENT_REPO_TOKEN:?Set CONTENT_REPO_TOKEN env var with a GitHub PAT}"
echo "Downloading blog-content via GitHub API"
rm -rf "$CONTENT_DIR"
mkdir -p "$CONTENT_DIR"
curl -fsSL \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/ycjcl868/blog-content/tarball/main" \
  | tar xz --strip-components=1 -C "$CONTENT_DIR"
cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
echo "Content fetched: $(ls "$CONTENT_DIR/blog/zh/" | wc -l) articles"
