#!/usr/bin/env node
/**
 * Translate Chinese blog posts (src/data/blog/zh) to English (src/data/blog/en).
 *
 * Design for robustness (build never depends on live LLM):
 *  - Translations are written to disk; build only reads finished English md.
 *  - Each source file's content hash is cached in .translate-cache.json.
 *    Unchanged source => skipped. Changed/new => re-translated.
 *  - A single article failing is isolated: it is skipped (stays missing or stale),
 *    other articles still complete, and a re-run retries only the missing/changed ones.
 *  - Frontmatter is parsed; only translatable fields (title, description) and the
 *    body are sent to the model. Structural fields (date, slug, tags, author) are
 *    preserved verbatim so URLs and metadata never drift.
 *
 * Config via env (no hardcoded secrets):
 *   TRANSLATE_BASE_URL  (e.g. http://101.47.157.170:9999/v1)
 *   TRANSLATE_API_KEY
 *   TRANSLATE_MODEL     (e.g. gpt-5.5)
 *
 * Usage:
 *   node scripts/translate.mjs            # translate changed/missing
 *   node scripts/translate.mjs --force    # re-translate everything
 *   node scripts/translate.mjs --only mcp # one slug
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ZH_DIR = path.join(ROOT, "src/data/blog/zh");
const EN_DIR = path.join(ROOT, "src/data/blog/en");
const CACHE_FILE = path.join(ROOT, ".translate-cache.json");

const BASE_URL = process.env.TRANSLATE_BASE_URL;
const API_KEY = process.env.TRANSLATE_API_KEY;
const MODEL = process.env.TRANSLATE_MODEL || "gpt-5.5";

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!BASE_URL || !API_KEY) {
  die(
    "Missing env. Set TRANSLATE_BASE_URL and TRANSLATE_API_KEY (and optionally TRANSLATE_MODEL).",
  );
}

function sha(s) {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveCache(c) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(c, null, 2));
}

/** Split frontmatter block from body. Returns {fmRaw, fm, body}. */
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fmRaw: "", fm: {}, body: text };
  const fmRaw = m[1];
  const body = text.slice(m[0].length);
  const fm = {};
  let curKey = null;
  for (const line of fmRaw.split("\n")) {
    const kv = line.match(/^(\w[\w.]*):\s?(.*)$/);
    if (kv) {
      curKey = kv[1];
      fm[curKey] = kv[2];
    } else if (/^\s+-\s/.test(line) && curKey) {
      // list item — keep raw, we preserve the whole tags block anyway
    }
  }
  return { fmRaw, fm, body };
}

async function callLLM(messages) {
  const res = await fetch(`${BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.2 }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty completion");
  return content;
}

const SYS = `You are a professional technical translator. Translate Chinese technical blog content to fluent, natural English for a software-engineering audience.

Rules:
- Preserve ALL markdown structure exactly: headings, lists, code blocks, links, images, blockquotes, tables.
- NEVER translate code inside code blocks or inline code. Keep code verbatim.
- Keep URLs, file paths, and image references unchanged.
- Translate technical terms accurately (use standard English terms: 沙箱→sandbox, 鉴权→authentication, 模块包→module package, etc).
- Keep product/proper names as-is (MCP, UI-TARS, AIO Sandbox, ByteDance, Quartz, etc).
- Output ONLY the translated markdown body. No preamble, no explanation, no fences around the whole thing.`;

/** Replace the title/description values inside a frontmatter block, keep everything else. */
function rewriteFrontmatter(fmRaw, enTitle, enDesc) {
  const lines = fmRaw.split("\n");
  const out = lines.map((line) => {
    if (/^title:\s?/.test(line)) return `title: ${enTitle}`;
    if (/^description:\s?/.test(line)) return `description: ${enDesc}`;
    return line;
  });
  return out.join("\n");
}

async function translateOne(slug, srcText) {
  const { fmRaw, fm, body } = parseFrontmatter(srcText);
  const zhTitle = (fm.title || slug).trim();
  const zhDesc = (fm.description || "").trim();

  // 1) Title + description in one small call (cheap, structured)
  const metaOut = await callLLM([
    { role: "system", content: SYS },
    {
      role: "user",
      content: `Translate these two fields to English. Output exactly two lines, prefixed "TITLE: " and "DESC: ".\n\nTITLE: ${zhTitle}\nDESC: ${zhDesc}`,
    },
  ]);
  const enTitle =
    metaOut.match(/TITLE:\s*(.+)/)?.[1]?.trim() || zhTitle;
  const enDesc = metaOut.match(/DESC:\s*([\s\S]+)/)?.[1]?.trim() || zhDesc;

  // 2) Body
  const enBody = await callLLM([
    { role: "system", content: SYS },
    { role: "user", content: body },
  ]);

  const newFm = rewriteFrontmatter(fmRaw, enTitle, enDesc.replace(/\n+/g, " "));
  return `---\n${newFm}\n---\n\n${enBody.trim()}\n`;
}

async function main() {
  if (!fs.existsSync(ZH_DIR)) die(`No zh dir: ${ZH_DIR}`);
  fs.mkdirSync(EN_DIR, { recursive: true });
  const cache = loadCache();

  let files = fs
    .readdirSync(ZH_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  if (ONLY) files = files.filter((f) => f === `${ONLY}.md`);

  const results = { translated: [], skipped: [], failed: [] };

  for (const fn of files) {
    const slug = fn.slice(0, -3);
    const srcText = fs.readFileSync(path.join(ZH_DIR, fn), "utf-8");
    const hash = sha(srcText);
    const enPath = path.join(EN_DIR, fn);
    const upToDate =
      !FORCE && cache[slug] === hash && fs.existsSync(enPath);

    if (upToDate) {
      results.skipped.push(slug);
      console.log(`  ⏭  ${slug} (unchanged)`);
      continue;
    }

    try {
      console.log(`  🔄 ${slug} ...`);
      const enText = await translateOne(slug, srcText);
      fs.writeFileSync(enPath, enText);
      cache[slug] = hash;
      saveCache(cache); // persist after each success (resumable)
      results.translated.push(slug);
      console.log(`  ✓  ${slug}`);
    } catch (e) {
      results.failed.push({ slug, error: String(e.message || e) });
      console.error(`  ✗  ${slug}: ${e.message || e}`);
      // continue — one failure does not abort the rest
    }
  }

  console.log(
    `\nDone. translated=${results.translated.length} skipped=${results.skipped.length} failed=${results.failed.length}`,
  );
  if (results.failed.length) {
    console.log("Failed (re-run to retry just these):");
    for (const f of results.failed) console.log(`  - ${f.slug}: ${f.error}`);
    process.exitCode = 1; // signal partial failure, but artifacts are written
  }
}

main();
