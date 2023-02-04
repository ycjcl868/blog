import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from '@/layouts/layout'
import { getPostBlocks, getAllPostsList } from '@/lib/notion'
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

  // ref: https://github.com/transitive-bullshit/nextjs-notion-starter-kit/issues/279#issuecomment-1245467818
  if (blockMap && blockMap.signed_urls) {
    const signedUrls = blockMap.signed_urls
    const newSignedUrls = {}
    for (const p in signedUrls) {
      if (signedUrls[p] && signedUrls[p].includes('.amazonaws.com/')) {
        console.log('skip : ' + signedUrls[p])
        continue
      }
      newSignedUrls[p] = signedUrls[p]
    }
    blockMap.signed_urls = newSignedUrls
  }

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
    revalidate: 1
  }
}

export default BlogPost
