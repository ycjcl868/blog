#!/usr/bin/env node
/**
 * Download remote images referenced in blog markdown and rewrite the links to
 * local /img/<slug>/... paths, so the site never depends on an external host.
 *
 * - Scans src/data/blog/<locale>/*.md for image URLs (markdown + bare <img>).
 * - Downloads each unique URL once into public/img/<slug>/<hash><ext>.
 * - Rewrites the markdown in place to point at the local path.
 * - Honors HTTPS_PROXY/https_proxy from the environment (the image host may
 *   only be reachable through a proxy).
 * - Idempotent: an already-downloaded file is skipped; re-running only fetches
 *   what's missing. A failed download leaves the original URL untouched.
 *
 * Usage: node scripts/localize-images.mjs [--dry]
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG = path.join(ROOT, "src/data/blog");
const PUBLIC_IMG = path.join(ROOT, "public/img");
const DRY = process.argv.includes("--dry");

const IMG_RE = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)|<img[^>]+src=["'](https?:\/\/[^"']+)["']/g;

function extFromUrl(u) {
  const m = u.split("?")[0].match(/\.(png|jpe?g|gif|webp|svg|avif)$/i);
  return m ? "." + m[1].toLowerCase().replace("jpeg", "jpg") : ".png";
}

// Use curl so we inherit the user's proxy env (HTTPS_PROXY etc.) exactly the
// way it already works for them — no extra Node dependency, no proxy plumbing.
function download(url, dest) {
  execFileSync(
    "curl",
    ["-fsS", "--max-time", "30", "-L", "-o", dest, url],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  const size = fs.statSync(dest).size;
  if (size < 100) {
    fs.rmSync(dest, { force: true });
    throw new Error(`too small (${size}b)`);
  }
  return size;
}

async function processFile(fp, slug) {
  let text = fs.readFileSync(fp, "utf-8");
  const urls = new Set();
  for (const m of text.matchAll(IMG_RE)) {
    const u = m[1] || m[2];
    if (u && u.includes("images.rustc.cloud")) urls.add(u);
  }
  if (urls.size === 0) return { fetched: 0, failed: 0, rewritten: 0 };

  const dir = path.join(PUBLIC_IMG, slug);
  if (!DRY) fs.mkdirSync(dir, { recursive: true });

  let fetched = 0,
    failed = 0,
    rewritten = 0;
  for (const url of urls) {
    const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 10);
    const ext = extFromUrl(url);
    const fname = `${hash}${ext}`;
    const dest = path.join(dir, fname);
    const localRef = `/img/${slug}/${fname}`;

    if (!fs.existsSync(dest)) {
      if (DRY) {
        console.log(`  would fetch ${url} -> ${localRef}`);
        fetched++;
      } else {
        try {
          const size = download(url, dest);
          console.log(`  ✓ ${localRef} (${(size / 1024) | 0}KB)`);
          fetched++;
        } catch (e) {
          console.error(`  ✗ ${url}: ${e.message}`);
          failed++;
          continue; // leave original URL in place
        }
      }
    }
    if (!DRY) {
      const before = text;
      text = text.split(url).join(localRef);
      if (text !== before) rewritten++;
    }
  }
  if (!DRY) fs.writeFileSync(fp, text);
  return { fetched, failed, rewritten };
}

async function main() {
  const locales = fs.existsSync(BLOG) ? fs.readdirSync(BLOG) : [];
  let totals = { fetched: 0, failed: 0, rewritten: 0 };
  for (const locale of locales) {
    const dir = path.join(BLOG, locale);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const fn of fs.readdirSync(dir)) {
      if (!fn.endsWith(".md")) continue;
      const slug = fn.slice(0, -3);
      const r = await processFile(path.join(dir, fn), slug);
      if (r.fetched || r.failed)
        console.log(
          `${locale}/${fn}: fetched=${r.fetched} failed=${r.failed} rewritten=${r.rewritten}`
        );
      totals.fetched += r.fetched;
      totals.failed += r.failed;
      totals.rewritten += r.rewritten;
    }
  }
  console.log(
    `\nDone. fetched=${totals.fetched} failed=${totals.failed} rewritten=${totals.rewritten}`
  );
  if (totals.failed) process.exitCode = 1;
}

main();
