import Layout from '@/layouts/layout'
import { getPostBlocks, getAllPostsList } from '@/lib/notion'
import { getPageTableOfContents, uuidToId } from 'notion-utils'
import { PageBlock } from 'notion-types'
import BLOG from '@/blog.config'

const BlogPost = ({ post, blockMap, tableOfContent }) => {
  if (!post) return null
  return (
    <Layout
      blockMap={blockMap}
      tableOfContent={tableOfContent}
      frontMatter={post}
      fullWidth={post.fullWidth}
    />
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

  const keys = Object.keys(blockMap?.block || {})
  const block = blockMap?.block?.[keys[0]]?.value as PageBlock

  const tableOfContent =
    getPageTableOfContents(block, blockMap)?.map(
      ({ id, text, indentLevel }) => ({
        id: uuidToId(id),
        text,
        indentLevel
      })
    ) || []

  return {
    props: { post, blockMap, tableOfContent },
    revalidate: 1
  }
}

export default BlogPost
