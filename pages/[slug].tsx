import { GetServerSideProps } from 'next'
import Layout from '@/layouts/layout'
import { getPostBlocks, getPost } from '@/lib/notion'
import {
  getPageTableOfContents,
  uuidToId,
  getPageImageUrls
} from 'notion-utils'
import { PageBlock, Block } from 'notion-types'
import { mapImageUrl } from '@/lib/utils'

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

export const getServerSideProps: GetServerSideProps = async ({
  params: { slug }
}) => {
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
    props: { post, blockMap, coverImage, tableOfContent }
  }
}

export default BlogPost
