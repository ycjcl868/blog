import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '@/layouts/layout'
import { getPostBlocks, getAllPostsList } from '@/lib/notion'
import {
  getPageTableOfContents,
  uuidToId,
  getPageImageUrls
} from 'notion-utils'
import { PageBlock, Block } from 'notion-types'
import { mapCoverUrl } from '@/lib/utils'
import BLOG from '@/blog.config'

const BlogPost = ({ post, coverImage, blockMap, tableOfContent }) => {
  if (!post) return null
  return (
    <Layout
      blockMap={blockMap}
      coverImage={coverImage}
      tableOfContent={tableOfContent}
      frontMatter={post}
      fullWidth={post.fullWidth}
    />
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPostsList({ includePages: true })
  return {
    paths: posts.map((row) => `${BLOG.path}/${row.slug}`),
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const posts = await getAllPostsList({ includePages: true })
  const post = posts.find((t) => t.slug === slug)

  if (!post) {
    return {
      notFound: true
    }
  }

  const blockMap = await getPostBlocks(post.id)
  const [coverImage = ''] =
    getPageImageUrls(blockMap, {
      mapImageUrl: (url: string, block: Block) => {
        if (block.format?.page_cover) {
          return !url?.startsWith('http') ? mapCoverUrl(url) : url
        }
      }
    }) || []

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
    props: { post, blockMap, coverImage, tableOfContent },
    revalidate: 1
  }
}

export default BlogPost
