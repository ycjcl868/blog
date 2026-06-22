export const SITE = {
  website: "https://rustc.cloud/",
  author: "信鑫",
  profile: "https://github.com/ycjcl868",
  ogImage: "",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
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

// giscus comments — fill these from https://giscus.app after enabling
// Discussions on your GitHub repo. Left empty => comments are hidden.
export const GISCUS = {
  repo: "", // e.g. "ycjcl868/blog"
  repoId: "",
  category: "Announcements",
  categoryId: "",
  mapping: "pathname",
} as const
