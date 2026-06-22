# Charles' Blog

Personal technical blog — AI Infrastructure, Agents, LLM Inference, Sandbox, MCP.

**Live:** [rustc.cloud](https://rustc.cloud)

## Stack

- [Astro](https://astro.build) + [AstroPaper i18n](https://github.com/yousef8/astro-paper-i18n)
- Content source: Obsidian (one-way sync)
- Languages: English (default) + Chinese (`/zh/`)
- Deploy: Cloudflare Pages

## Local Development

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # production build -> dist/
```

## Publishing Workflow

Content lives in Obsidian `5. Outputs/`. Each article is a folder:

```
5. Outputs/<Title>/
  <Title>.md          # Chinese (frontmatter: status, channels, slug, tags)
  <Title>.en.md       # English (optional)
  attachments/        # Images
```

Publish:

```bash
npm run publish      # sync + fix code fences + build + show git diff
git commit && push   # Cloudflare auto-deploys
```

## Key Scripts

| Script | Purpose |
|--------|---------|
| `npm run obsidian-sync` | One-way sync: Obsidian → blog repo |
| `npm run publish` | Full publish pipeline (sync + build + prompt push) |
| `node scripts/translate.mjs` | Generate English translations via LLM |
| `node scripts/infer-code-lang.mjs` | Auto-detect code fence languages for syntax highlighting |

## Config

- `.env` — machine-specific paths (see `.env.example`)
- `src/config.ts` — site metadata
- `src/i18n/config.ts` — locale settings
- `src/constants.ts` — social links
