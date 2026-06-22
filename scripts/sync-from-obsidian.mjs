#!/usr/bin/env node
/**
 * One-way sync: Obsidian outputs folder → AstroPaper content collections.
 *
 * Obsidian is the single source of truth. This script only READS the vault and
 * WRITES into the blog repo — it never writes back to Obsidian.
 *
 * Per article folder `<outputs>/<anything>/`:
 *   - main file: the `*.md` that is NOT `*.en.md` (Chinese source)
 *   - english:   any `*.en.md` (matched by suffix, not by name)
 *   - images:    `attachments/` (copied to public/img/<slug>/)
 *
 * Selection: only folders whose main file has
 *   status: published        (not draft / prepublish)
 *   channels: [..., blog]    (must include "blog")
 *
 * Routing by `type` frontmatter:
 *   type: page     → src/data/about/about.<locale>.md  (About and other pages)
 *   (default)      → src/data/blog/<locale>/<slug>.md   (articles)
 *
 * Config (no hardcoded paths): set OBSIDIAN_OUTPUTS_DIR in .env (see .env.example).
 * The blog repo root is derived from this script's own location.
 *
 * Usage: node scripts/sync-from-obsidian.mjs [--dry]
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// --- Load .env (minimal parser, no dependency) ---
const BLOG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function loadEnv() {
  const envPath = path.join(BLOG, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      )
        v = v.slice(1, -1);
      process.env[m[1]] = v;
    }
  }
}
loadEnv();

const VAULT_OUTPUTS = process.env.OBSIDIAN_OUTPUTS_DIR;
if (!VAULT_OUTPUTS) {
  console.error(
    "✗ OBSIDIAN_OUTPUTS_DIR is not set.\n" +
      "  Copy .env.example to .env and set OBSIDIAN_OUTPUTS_DIR to your\n" +
      "  Obsidian outputs folder (the one holding one folder per article)."
  );
  process.exit(1);
}
if (!fs.existsSync(VAULT_OUTPUTS)) {
  console.error(`✗ OBSIDIAN_OUTPUTS_DIR does not exist: ${VAULT_OUTPUTS}`);
  process.exit(1);
}

const CONTENT = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.resolve(process.env.HOME, "github/blog-content");
const ZH = path.join(CONTENT, "blog/zh");
const EN = path.join(CONTENT, "blog/en");
const ABOUT = path.join(CONTENT, "about");
const PUBLIC_IMG = path.join(CONTENT, "img");
const DRY = process.argv.includes("--dry");

function parseFm(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  let key = null;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w.]*):\s?(.*)$/);
    if (kv) {
      key = kv[1];
      let v = kv[2].trim();
      // inline array: [a, b]
      const arr = v.match(/^\[(.*)\]$/);
      if (arr) {
        fm[key] = arr[1]
          .split(",")
          .map(s => s.trim())
          .filter(Boolean);
      } else {
        fm[key] = v;
      }
    } else if (/^\s*-\s/.test(line) && key) {
      if (!Array.isArray(fm[key])) fm[key] = fm[key] ? [fm[key]] : [];
      fm[key].push(line.replace(/^\s*-\s/, "").trim());
    }
  }
  return { fm, body: text.slice(m[0].length) };
}

function unquote(s) {
  if (typeof s !== "string") return s;
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  )
    return s.slice(1, -1).replace(/\\"/g, '"');
  return s;
}

function quote(s) {
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function toAstroFm(fm, slug) {
  const title = unquote(fm.title || slug);
  const date = (fm.date || "2024-01-01").split("T")[0];
  const tags = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : [];
  const desc = unquote(fm.description || title);
  const lines = ["---"];
  lines.push("title: " + quote(title));
  lines.push("author: 信鑫");
  lines.push("pubDatetime: " + date + "T08:00:00Z");
  lines.push("draft: false");
  if (tags.length) {
    lines.push("tags:");
    for (const t of tags) lines.push("  - " + t);
  } else {
    lines.push("tags:\n  - others");
  }
  lines.push("description: " + quote(desc));
  lines.push("---");
  return lines.join("\n");
}

function rewriteImages(body, slug) {
  // 1. Standard markdown images: ![alt](attachments/<file>) -> ![alt](/img/<slug>/<file>)
  let out = body.replace(
    /(!\[[^\]]*\]\()attachments\/([^)]+)(\))/g,
    (_m, pre, file, post) => `${pre}/img/${slug}/${file}${post}`
  );
  // 2. Obsidian wikilink images: ![[file.png]] or ![[file.png|alt]] or ![[attachments/file.png]]
  //    Convert to standard markdown ![alt](/img/<slug>/<file>).
  //    Obsidian wikilinks reference by filename only (no path prefix) even when
  //    the file lives in attachments/. Strip any path prefix and point to /img/<slug>/.
  out = out.replace(
    /!\[\[([^\]|]+\.(png|jpe?g|gif|webp|svg|mp4|mov))(?:\|([^\]]*))?\]\]/gi,
    (_m, file, _ext, alt) => {
      const basename = file.replace(/^.*[/\\]/, "");
      return `![${alt || ""}](/img/${slug}/${basename})`;
    }
  );
  return out;
}

function isPublishedToBlog(fm) {
  const status = unquote(fm.status || "");
  const channels = Array.isArray(fm.channels)
    ? fm.channels
    : fm.channels
      ? [fm.channels]
      : [];
  return (
    status === "published" &&
    channels.map(c => unquote(c)).includes("blog")
  );
}

/** Pages (type: page) become the About content collection, keyed by slug.
 *  Only `about` is wired into the theme today; other page slugs are written
 *  too, but need a matching route to show up. */
function syncPage(dir, fm, body, enName) {
  const slug = unquote(fm.slug || "about");
  if (DRY) return { slug, isPage: true, hasEn: !!enName, skipped: false };
  fs.mkdirSync(ABOUT, { recursive: true });
  const title = unquote(fm.title || slug);
  const mk = (f, isEn) =>
    `---\ntitle: ${quote(unquote(f.title || title))}\n---\n`;
  fs.writeFileSync(
    path.join(ABOUT, `${slug}.zh.md`),
    mk(fm, false) + "\n" + body.trimStart()
  );
  if (enName) {
    const en = parseFm(fs.readFileSync(path.join(dir, enName), "utf-8"));
    fs.writeFileSync(
      path.join(ABOUT, `${slug}.en.md`),
      mk(en.fm, true) + "\n" + en.body.trimStart()
    );
  }
  return { slug, isPage: true, hasEn: !!enName, skipped: false };
}

function syncFolder(dir) {
  const files = fs.readdirSync(dir);
  const mainName = files.find(f => f.endsWith(".md") && !f.endsWith(".en.md"));
  if (!mainName) return null;
  const enName = files.find(f => f.endsWith(".en.md"));

  const mainText = fs.readFileSync(path.join(dir, mainName), "utf-8");
  const { fm, body } = parseFm(mainText);

  // Pages (About etc.) route to the about collection; still gated on published.
  if (unquote(fm.type || "") === "page") {
    if (unquote(fm.status || "") !== "published")
      return { slug: null, skipped: true };
    return syncPage(dir, fm, body, enName);
  }

  if (!isPublishedToBlog(fm)) return { slug: null, skipped: true };

  const slug = unquote(fm.slug || mainName.replace(/\.md$/, ""));

  // Copy images. Flatten any nested attachment subfolders (Obsidian may store
  // pasted images under a per-note subdir). Skip non-regular files such as
  // not-yet-downloaded iCloud placeholders (which appear as sockets and break
  // copyFileSync with ENOTSUP).
  const attDir = path.join(dir, "attachments");
  const destImg = path.join(PUBLIC_IMG, slug);
  let imgCount = 0;
  const copyTree = (srcDir, prefix = "") => {
    for (const name of fs.readdirSync(srcDir)) {
      const src = path.join(srcDir, name);
      let st;
      try {
        st = fs.statSync(src);
      } catch {
        continue; // unreadable (e.g. cloud placeholder)
      }
      if (st.isDirectory()) {
        copyTree(src, prefix + name + "__");
        continue;
      }
      if (!st.isFile()) continue; // sockets / fifos / devices
      const destName = prefix + name;
      if (!DRY) {
        try {
          fs.copyFileSync(src, path.join(destImg, destName));
        } catch (e) {
          console.warn(`  ⚠ skip image ${name}: ${e.code || e.message}`);
          continue;
        }
      }
      imgCount++;
    }
  };
  if (fs.existsSync(attDir)) {
    if (!DRY) {
      fs.rmSync(destImg, { recursive: true, force: true });
      fs.mkdirSync(destImg, { recursive: true });
    }
    copyTree(attDir);
  }

  // Write Chinese
  if (!DRY) {
    fs.mkdirSync(ZH, { recursive: true });
    fs.writeFileSync(
      path.join(ZH, slug + ".md"),
      toAstroFm(fm, slug) + "\n\n" + rewriteImages(body, slug).trimStart()
    );
  }

  // Write English (matched by *.en.md suffix)
  let hasEn = false;
  if (enName) {
    const enParsed = parseFm(fs.readFileSync(path.join(dir, enName), "utf-8"));
    if (!DRY) {
      fs.mkdirSync(EN, { recursive: true });
      fs.writeFileSync(
        path.join(EN, slug + ".md"),
        toAstroFm(enParsed.fm, slug) +
          "\n\n" +
          rewriteImages(enParsed.body, slug).trimStart()
      );
    }
    hasEn = true;
  }

  return { slug, imgCount, hasEn, skipped: false };
}

function main() {
  if (!fs.existsSync(VAULT_OUTPUTS)) {
    console.error(`No vault outputs dir: ${VAULT_OUTPUTS}`);
    process.exit(1);
  }
  const dirs = fs
    .readdirSync(VAULT_OUTPUTS)
    .map(d => path.join(VAULT_OUTPUTS, d))
    .filter(d => {
      try {
        return fs.statSync(d).isDirectory();
      } catch {
        return false;
      }
    });

  let published = 0,
    skipped = 0,
    images = 0;
  const synced = [];
  for (const dir of dirs) {
    const r = syncFolder(dir);
    if (!r) continue;
    if (r.skipped) {
      skipped++;
      continue;
    }
    published++;
    images += r.imgCount || 0;
    const kind = r.isPage ? "page" : "post";
    synced.push(`${r.slug} [${kind}]${r.hasEn ? " (zh+en)" : " (zh)"}`);
  }

  console.log(`Synced ${published} item(s), ${images} images:`);
  for (const s of synced) console.log(`  ✓ ${s}`);
  if (skipped) console.log(`Skipped ${skipped} (not published).`);
}

main();
