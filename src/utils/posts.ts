import { BLOG_PATH } from "@/content.config"
import { type LocaleKey } from "@/i18n/config"
import { getCollection, type CollectionEntry } from "astro:content"

type GetPostsOptions = {
  draft?: boolean
  allowedLocales?: LocaleKey[]
  blogPath?: string
}

type groupPostsByLocaleOptions = {
  allowedLocales?: LocaleKey[]
  blogPath?: string
}

/**
 * Retrieves blog posts for a specific locale.
 *
 * @param locale - The locale to retrieve posts for.
 * @param options - Options for retrieving posts.
 * @returns Array of blog posts for the specified locale.
 */
export const getPostsByLocale = async (
  locale: LocaleKey,
  { draft = true }: { draft?: boolean } = {},
) => {
  const postsByLocale = await getPostsGroupedByLocale({
    draft,
    allowedLocales: [locale],
  })
  return postsByLocale[locale] || []
}

/**
 * Retrieves blog posts grouped by locale.
 *
 * @param options - Options for retrieving and grouping posts.
 * @returns Object with locales as keys and arrays of blog posts as values.
 */
export const getPostsGroupedByLocale = async ({ draft, allowedLocales }: GetPostsOptions = {}) =>
  groupPostsByLocale(await getPosts({ draft, allowedLocales }), {
    allowedLocales,
  })

/**
 * Retrieves all blog posts with optional filtering.
 *
 * @param options - Options for retrieving posts.
 * @returns Array of blog posts.
 */
export const getPosts = async ({
  draft = true,
  allowedLocales = [],
  blogPath = BLOG_PATH,
}: GetPostsOptions = {}): Promise<CollectionEntry<"blog">[]> =>
  getCollection("blog", ({ filePath, data }) => {
    // TODO: helper function to get locale from post
    const locale = filePath?.replace(blogPath, "")?.replace(/^\/+/, "")?.split("/")[0] // for collections with file loaders this always exist

    return (
      (draft || !data.draft) &&
      (!allowedLocales.length || allowedLocales.includes(locale as LocaleKey))
    )
  })

/**
 * Groups an array of blog posts by their locale.
 *
 * @param posts - Array of blog posts to group.
 * @param options - Options for grouping posts.
 * @param [options.allowedLocales=[]] - Array of locales to filter posts by.
 * @returns - Object with locales as keys and arrays of blog posts as values.
 */
export const groupPostsByLocale = (
  posts: CollectionEntry<"blog">[],
  { allowedLocales = [], blogPath = BLOG_PATH }: groupPostsByLocaleOptions = {},
) => {
  const postsByLocale = posts.reduce(
    (acc, post) => {
      const locale = post.filePath?.replace(blogPath, "")?.replace(/^\/+/, "")?.split("/")[0] || "" // for collections with file loaders this always exist

      return {
        ...acc,
        [locale]: [...(acc[locale] || []), post],
      }
    },
    {} as Record<string, CollectionEntry<"blog">[]>,
  )

  if (!allowedLocales.length) {
    return postsByLocale
  }

  const filteredPostsByLocale = Object.fromEntries(
    Object.entries(postsByLocale).filter(([locale]) =>
      allowedLocales.includes(locale as LocaleKey),
    ),
  )

  const result: Record<string, CollectionEntry<"blog">[]> = {}

  for (const locale of allowedLocales) {
    result[locale] = postsByLocale[locale] || []
  }

  return { ...result, ...filteredPostsByLocale }
}
