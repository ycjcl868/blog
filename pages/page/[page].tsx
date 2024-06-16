import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPostsList } from '@/lib/notion'
import BLOG from '@/blog.config'
import { PageConfig } from 'next'

const Page = ({ postsToShow, page, showNext }) => {
  return (
    <Container>
      {postsToShow &&
        postsToShow.map((post) => <BlogPost key={post.id} post={post} />)}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}

export const config: PageConfig = {
  runtime: 'experimental-edge'
}

export async function getServerSideProps(context) {
  const { page } = context.params // Get Current Page No.
  const posts = await getAllPostsList({ includePages: false })
  const postsToShow = posts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )
  const totalPosts = posts.length
  const showNext = page * BLOG.postsPerPage < totalPosts
  return {
    props: {
      page, // Current Page
      postsToShow,
      showNext
    }
  }
}

export default Page
