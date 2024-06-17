import { getAllPostsList, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'
import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'
import { PageConfig } from 'next'

export default function Tag({ tags, posts, currentTag }) {
  const locale = useLocale()

  return (
    <SearchLayout
      title={`${locale.TAG} ${currentTag} - ${BLOG.title}`}
      hiddenTags
      tags={tags}
      posts={posts}
      currentTag={currentTag}
    />
  )
}

export const config: PageConfig = {
  runtime: 'experimental-edge'
}

export async function getServerSideProps({ params, res }) {
  const currentTag = params.tag?.toLowerCase()
  const posts = await getAllPostsList({ includePages: false })
  const tags = getAllTagsFromPosts(posts)
  const filteredPosts = posts.filter(
    (post) =>
      post &&
      post.tags &&
      post.tags?.map((t) => t?.toLowerCase()).includes(currentTag)
  )
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, stale-while-revalidate=300'
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      currentTag
    }
  }
}
