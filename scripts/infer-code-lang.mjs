#!/usr/bin/env node
/**
 * Infer a language tag for bare ``` code fences so Shiki can highlight them.
 *
 * Many migrated posts have unlabeled fences (```), which Shiki renders as
 * plain monochrome text. This walks each markdown file, finds bare opening
 * fences, sniffs the block content, and rewrites the fence to ```<lang>.
 * Fences that already declare a language are left untouched.
 *
 * Heuristic only — picks the most likely of: json, bash, ts, js, yaml, toml,
 * rust, go, python, html, css, diff. Unknown blocks stay bare (safe).
 *
 * Usage: node scripts/infer-code-lang.mjs [dir ...]
 *        defaults to src/data/blog/zh and src/data/blog/en
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const dirs =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : [
        path.join(ROOT, "src/data/blog/zh"),
        path.join(ROOT, "src/data/blog/en"),
      ];

function sniff(code) {
  const t = code.trim();
  if (!t) return null;

  // JSON: starts with { or [ and has "key":
  if (/^[{[]/.test(t) && /"[^"]+"\s*:/.test(t) && !/^\s*(import|const|export)/.test(t)) {
    // but package.json-style comments mean jsonc -> still json highlights fine
    return "json";
  }
  // Diff
  if (/^[+-] /m.test(t) && /^(\+|-){1}/m.test(t)) return "diff";
  // Shell: $ prompt, npm/pnpm/yarn/git/cd/mkdir/echo/export, or #!/bin/
  if (
    /^#!\/.*sh/.test(t) ||
    /^\s*\$\s/m.test(t) ||
    /^\s*(npm|pnpm|yarn|npx|git|cd|mkdir|rm|cp|mv|echo|export|sudo|brew|curl|wget|chmod|source|ssh|docker|kubectl)\s/m.test(t)
  )
    return "bash";
  // YAML: key: value with no braces, has --- or "- " items and colons
  if (/^[\w.-]+:\s/m.test(t) && !/[{};]/.test(t) && /:\s*\S/.test(t)) return "yaml";
  // TOML
  if (/^\[[\w.]+\]/m.test(t) && /^\w+\s*=/m.test(t)) return "toml";
  // Rust
  if (/\b(fn|let mut|impl|pub fn|use std::|->)\b/.test(t) && /[{};]/.test(t))
    return "rust";
  // Go
  if (/\bfunc\b/.test(t) && /\bpackage\s+\w+/.test(t)) return "go";
  // Python
  if (/^\s*(def|class|import|from)\s/m.test(t) && /:\s*$/m.test(t)) return "python";
  // TypeScript: type/interface/: type annotations/import from
  if (
    /\b(interface|type\s+\w+\s*=|: (string|number|boolean|void|any)|as const|enum)\b/.test(t) ||
    /import\s+.*\s+from\s+['"]/.test(t)
  )
    return "typescript";
  // JS: const/let/function/=>/require
  if (/\b(const|let|function|=>|require\(|module\.exports)\b/.test(t)) return "javascript";
  // HTML
  if (/^<(!DOCTYPE|html|div|span|head|body|script|a |p>|ul>)/m.test(t)) return "html";
  // CSS
  if (/^[.#]?[\w-]+\s*\{[^}]*:[^}]*\}/m.test(t) || /^\s*[\w-]+:\s*[^;]+;/m.test(t))
    return "css";
  return null;
}

function processFile(fp) {
  const text = fs.readFileSync(fp, "utf-8");
  const lines = text.split("\n");
  let inFence = false;
  let fenceStart = -1;
  let fenceHadLang = false;
  let changed = 0;
  const blockLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(\s*)```(.*)$/);
    if (m) {
      if (!inFence) {
        inFence = true;
        fenceStart = i;
        fenceHadLang = m[2].trim().length > 0;
        blockLines.length = 0;
      } else {
        // closing fence
        if (!fenceHadLang) {
          const lang = sniff(blockLines.join("\n"));
          if (lang) {
            lines[fenceStart] = lines[fenceStart].replace(/```\s*$/, "```" + lang);
            changed++;
          }
        }
        inFence = false;
      }
    } else if (inFence) {
      blockLines.push(line);
    }
  }

  if (changed > 0) {
    fs.writeFileSync(fp, lines.join("\n"));
  }
  return changed;
}

let total = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!fn.endsWith(".md")) continue;
    const c = processFile(path.join(dir, fn));
    if (c > 0) console.log(`  ${path.basename(dir)}/${fn}: +${c} lang tags`);
    total += c;
  }
}
console.log(`\nInferred ${total} code-fence languages.`);
