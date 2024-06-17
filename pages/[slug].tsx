import { GetStaticPaths, GetStaticProps, PageConfig } from 'next'
import Layout from '@/layouts/layout'
import { getPostBlocks, getPost, getAllPostsList } from '@/lib/notion'
import {
  getPageTableOfContents,
  uuidToId,
  getPageImageUrls
} from 'notion-utils'
import { PageBlock, Block } from 'notion-types'
import { mapImageUrl } from '@/lib/utils'
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

export const config: PageConfig = {
  runtime: 'experimental-edge'
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPostsList({ includePages: true })
  return {
    paths: posts.map((row) => `${BLOG.path}/${row.slug}`),
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  const [post] = await getPost({ slug })

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
          return mapImageUrl(url, block)
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
    revalidate: 10
  }
}

export default BlogPost
