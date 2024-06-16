import { getAllPostsList, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'
import { useLocale } from '@/lib/locale'
import BLOG from '@/blog.config'
import { PageConfig } from 'next'

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

export const config: PageConfig = {
  runtime: 'experimental-edge'
}

export async function getServerSideProps() {
  const posts = await getAllPostsList({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  return {
    props: {
      tags,
      posts
    }
  }
}
