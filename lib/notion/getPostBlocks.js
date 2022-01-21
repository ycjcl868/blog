import { NotionAPI } from 'notion-client'

export async function getPostBlocks(id) {
  const authToken = null
  const api = new NotionAPI({ authToken })
  const pageBlock = await api.getPage(id)
  return pageBlock
}
