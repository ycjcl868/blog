import type { LoaderFunction } from 'remix'
import blogConfig from '~/blog.config'
const configLoader: LoaderFunction = () => {
  return {
    ...blogConfig,
    notionPageId: process.env.NOTION_PAGE_ID, // DO NOT CHANGE THIS！！！
    notionAccessToken: process.env.NOTION_ACCESS_TOKEN, // Useful if you prefer not to make your database public
    isProd: process.env.NODE_ENV === 'production'
  }
}

export default configLoader
