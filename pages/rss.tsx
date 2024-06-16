import { getAllPostsList } from '@/lib/notion'
import { generateRss } from '@/lib/rss'
import path from 'path'
import fs from 'fs'

export async function getStaticProps() {
  const posts = await getAllPostsList({ includePages: false })
  const latestPosts = posts.slice(0, 10)
  const xmlFeed = generateRss(latestPosts)

  const publicDirectory = path.join(process.cwd(), 'public')
  const filePath = path.join(publicDirectory, 'rss.xml')
  // eslint-disable-next-line no-undef
  fs.writeFileSync(filePath, xmlFeed)

  return {
    props: {}
  }
}
const feed = () => null
export default feed
