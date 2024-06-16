import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPostsList } from '@/lib/notion'
import BLOG from '@/blog.config'
import { PageConfig } from 'next'

export const config: PageConfig = {
  runtime: 'experimental-edge'
}

export async function getgetServerSideProps() {
  console.log('aaaaaaaaaaa')
  const posts = await getAllPostsList({ includePages: false })
  console.log('bbbbbbbbbbbbbb')
  const postsToShow = posts.slice(0, BLOG.postsPerPage)
  console.log('ccccccccccc')
  const totalPosts = posts.length
  const showNext = totalPosts > BLOG.postsPerPage
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext
    }
  }
}

const Blog = ({ postsToShow, page, showNext }) => {
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}

export default Blog
