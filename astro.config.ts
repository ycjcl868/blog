import { defineConfig, envField } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import sitemap from "@astrojs/sitemap"
import expressiveCode from "astro-expressive-code"
import remarkToc from "remark-toc"
import remarkCollapse from "remark-collapse"
import rehypeExternalLinks from "rehype-external-links"
import { SITE } from "./src/config"
import { DEFAULT_LOCALE, LOCALES_TO_LANG, SUPPORTED_LOCALES } from "./src/i18n/config"

// Native lazy-loading + async decoding for markdown images. public/ images
// bypass astro:assets, so <img>s from ![]() need these hints added by hand.
type HastNode = {
  tagName?: string
  properties?: Record<string, string>
  children?: HastNode[]
}
function rehypeLazyImages() {
  const visit = (node: HastNode) => {
    if (node.tagName === "img" && node.properties) {
      node.properties.loading ??= "lazy"
      node.properties.decoding ??= "async"
    }
    if (node.children) node.children.forEach(visit)
  }
  return (tree: HastNode) => visit(tree)
}

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  i18n: {
    locales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
  },
  integrations: [
    // llmsTxt(), // disabled: crashes on build:done hook; using manual llms.txt instead
    // Rich code blocks (copy button, frames, markers). Follows the site's
    // data-theme toggle instead of the OS media query.
    expressiveCode({
      themes: ["github-light", "night-owl"],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) =>
        theme.type === "dark" ? '[data-theme="dark"]' : ':root:not([data-theme="dark"])',
      defaultProps: { wrap: true },
      // Content fences use capitalized names (```Bash); map them to the lowercase
      // ids Shiki expects so highlighting works without editing every post.
      shiki: {
        langAlias: {
          Bash: "bash",
          Shell: "shell",
          Sh: "sh",
          Zsh: "zsh",
          Python: "python",
          JavaScript: "javascript",
          TypeScript: "typescript",
          Go: "go",
          Rust: "rust",
          Java: "java",
          JSON: "json",
          YAML: "yaml",
          HTML: "html",
          CSS: "css",
          SQL: "sql",
          Dockerfile: "dockerfile",
          Diff: "diff",
          Markdown: "markdown",
          TOML: "toml",
          XML: "xml",
        },
      },
    }),
    sitemap({
      filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: LOCALES_TO_LANG,
      },
    }),
  ],
  markdown: {
    remarkPlugins: [
      // remarkObsidian disabled: renders frontmatter as visible Properties block
      // and conflicts with Shiki syntax highlighting. Obsidian-specific syntax
      // (wikilinks, image embeds) is converted by the sync script instead.
      [
        remarkToc,
        {
          heading: "(table[ -]of[ -])?contents?|toc|محتويات|المحتويات|جدول المحتويات",
        },
      ],
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
      rehypeLazyImages,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      // giscus comments — set these in the Cloudflare Pages project. Absent =>
      // the comment section renders nothing.
      PUBLIC_GISCUS_REPO: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
      PUBLIC_GISCUS_REPO_ID: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
})
