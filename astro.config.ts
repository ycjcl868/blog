import { defineConfig, envField } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import sitemap from "@astrojs/sitemap"
import remarkToc from "remark-toc"
import remarkCollapse from "remark-collapse"
import rehypeExternalLinks from "rehype-external-links"
import { SITE } from "./src/config"
import { DEFAULT_LOCALE, LOCALES_TO_LANG, SUPPORTED_LOCALES } from "./src/i18n/config"

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  i18n: {
    locales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
  },
  integrations: [
    // llmsTxt(), // disabled: crashes on build:done hook; using manual llms.txt instead
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
    rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      // github-light has stronger contrast than min-light (which looked washed out)
      themes: { light: "github-light", dark: "night-owl" },
      wrap: true,
    },
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
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
})
