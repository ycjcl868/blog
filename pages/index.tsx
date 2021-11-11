import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import dayjs from 'dayjs'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false })
  const postsToShow = posts
    .slice(0, BLOG.postsPerPage)
    .sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
  const totalPosts = posts.length
  const showNext = totalPosts > BLOG.postsPerPage
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

const blog = ({ postsToShow, page, showNext }) => {
  console.log('postsToShow', postsToShow)
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}

export default blog
