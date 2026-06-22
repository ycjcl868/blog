#!/usr/bin/env bash
# Fetch latest blog content from the blog-content repo.
# Runs as prebuild (CI) and before dev (local).
set -euo pipefail

cd "$(dirname "$0")/.."
CONTENT_DIR="./content"

# Already fetched? Skip (local dev after first run)
if [ -d "$CONTENT_DIR/blog" ] && [ "$(ls "$CONTENT_DIR/blog/zh/" 2>/dev/null | wc -l)" -gt 0 ]; then
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  exit 0
fi

# Local dev: use existing clone
LOCAL_REPO="$HOME/github/blog-content"
if [ -d "$LOCAL_REPO/blog" ]; then
  echo "Using local blog-content: $LOCAL_REPO"
  rm -rf "$CONTENT_DIR"
  cp -r "$LOCAL_REPO" "$CONTENT_DIR"
  rm -rf "$CONTENT_DIR/.git"
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  exit 0
fi

# CI: download tarball via GitHub API (avoids git credential conflicts)
# CONTENT_REPO_TOKEN must be a GitHub PAT with Contents:read on blog-content
TOKEN="${CONTENT_REPO_TOKEN:-}"
REPO="ycjcl868/blog-content"
BRANCH="main"

if [ -n "$TOKEN" ]; then
  echo "Downloading blog-content tarball from GitHub API"
  rm -rf "$CONTENT_DIR"
  mkdir -p "$CONTENT_DIR"
  curl -fsSL \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/tarball/$BRANCH" \
    | tar xz --strip-components=1 -C "$CONTENT_DIR"
  cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
  echo "Content fetched: $(ls "$CONTENT_DIR/blog/zh/" | wc -l | tr -d ' ') articles"
  exit 0
fi

# Fallback: try git clone (public repo or pre-configured credentials)
REPO_URL="${CONTENT_REPO_URL:-https://github.com/$REPO.git}"
echo "Cloning blog-content from $REPO_URL"
rm -rf "$CONTENT_DIR"
GIT_TERMINAL_PROMPT=0 git clone --depth 1 "$REPO_URL" "$CONTENT_DIR"
rm -rf "$CONTENT_DIR/.git"
cp -r "$CONTENT_DIR/img" public/img 2>/dev/null || true
