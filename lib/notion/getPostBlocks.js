import { NotionAPI } from 'notion-client'
import BLOG from '@/blog.config'
import { getPreviewImageMap } from './preview-images'

export async function getPostBlocks(id) {
  const authToken = null
  const api = new NotionAPI({ authToken })
  const pageBlock = await api.getPage(id)

  // ref: https://github.com/transitive-bullshit/nextjs-notion-starter-kit/issues/279#issuecomment-1245467818
  if (pageBlock && pageBlock.signed_urls) {
    const signedUrls = pageBlock.signed_urls
    const newSignedUrls = {}
    for (const p in signedUrls) {
      if (signedUrls[p] && signedUrls[p].includes('.amazonaws.com/')) {
        console.log('skip : ' + signedUrls[p])
        continue
      }
      newSignedUrls[p] = signedUrls[p]
    }
    pageBlock.signed_urls = newSignedUrls
  }

  if (BLOG.isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(pageBlock)
    pageBlock.preview_images = previewImageMap
  }

  return pageBlock
}
