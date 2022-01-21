import Layout from '@/layouts/layout'
import { getPostBlocks, getAllPostsList } from '@/lib/notion'
import BLOG from '@/blog.config'

const BlogPost = ({ post, blockMap }) => {
  if (!post) return null
  return (
    <Layout blockMap={blockMap} frontMatter={post} fullWidth={post.fullWidth} />
  )
}

export async function getStaticPaths() {
  const posts = await getAllPostsList({ includePages: true })
  return {
    paths: posts.map((row) => `${BLOG.path}/${row.slug}`),
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  const posts = await getAllPostsList({ includePages: true })
  const post = posts.find((t) => t.slug === slug)
  const blockMap = await getPostBlocks(post.id)

  return {
    props: { post, blockMap },
    revalidate: 1
  }
}

export default BlogPost
