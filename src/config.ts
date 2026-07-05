export const SITE = {
  website: "https://rustc.cloud/",
  author: "信鑫",
  profile: "https://github.com/ycjcl868",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 8,
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    url: "",
  },
  dynamicOgImage: false,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const

// giscus comments config now lives in PUBLIC_GISCUS_* env vars
// (see the env schema in astro.config.ts), set on the Cloudflare Pages project.
