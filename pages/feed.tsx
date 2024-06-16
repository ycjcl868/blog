import { getAllPostsList } from '@/lib/notion'
import { generateRss } from '@/lib/rss'
import { PageConfig } from 'next'

export const config: PageConfig = {
  runtime: 'experimental-edge'
}

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  const posts = await getAllPostsList({ includePages: false })
  const latestPosts = posts.slice(0, 10)
  const xmlFeed = generateRss(latestPosts)
  res.write(xmlFeed)
  res.end()
  return {
    props: {}
  }
}
const feed = () => null
export default feed
