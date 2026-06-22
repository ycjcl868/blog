import rss from "@astrojs/rss"
import getSortedPosts from "@/utils/getSortedPosts"
import { SITE } from "@/config"
import { getRelativeLocalePath, translateFor } from "@/i18n/utils"
import type { APIContext, InferGetStaticParamsType } from "astro"
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/i18n/config"
import { getPostsGroupedByLocale } from "@/utils/posts"
import { getPath } from "@/utils/getPath"

export async function getStaticPaths() {
  return SUPPORTED_LOCALES.map((locale) => ({
    params: { locale: locale === DEFAULT_LOCALE ? undefined : locale },
  }))
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>

export async function GET(context: APIContext) {
  const { locale = DEFAULT_LOCALE } = context.params as Params

  const t = translateFor(locale)

  const postsByLocale = await getPostsGroupedByLocale({
    allowedLocales: SUPPORTED_LOCALES,
  })
  const posts = postsByLocale[locale]
  const sortedPosts = getSortedPosts(posts)

  return rss({
    title: t("site.title"),
    description: t("site.desc"),
    site: new URL(getRelativeLocalePath(locale), SITE.website).href,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getRelativeLocalePath(locale, getPath(id, filePath)),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  })
}
