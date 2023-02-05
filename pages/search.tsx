import { getAllPostsList, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'
import { useLocale } from '@/lib/locale'
import BLOG from '@/blog.config'

export default function Search({ tags, posts }) {
  const locale = useLocale()

  return (
    <SearchLayout
      title={`${locale.NAV.SEARCH} - ${BLOG.title}`}
      tags={tags}
      posts={posts}
    />
  )
}
export async function getStaticProps() {
  const posts = await getAllPostsList({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  return {
    props: {
      tags,
      posts
    },
    revalidate: 10
  }
}
