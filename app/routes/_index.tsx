import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/cloudflare'
import Container from '~/components/Container'
import BlogPost from '~/components/BlogPost'
import Pagination from '~/components/Pagination'
import { getAllPostsList } from '~/libs/notion'
import { useLoaderData } from '@remix-run/react'
import BLOG from '#/blog.config'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    {
      name: 'description',
      content: 'Welcome to Remix on Cloudflare!'
    }
  ]
}

export const loader = async (params: LoaderFunctionArgs) => {
  const { context } = params
  const { NOTION_ACCESS_TOKEN, NOTION_PAGE_ID } = context.cloudflare.env

  const posts = await getAllPostsList({
    includePages: false,
    notionPageId: NOTION_PAGE_ID,
    notionAccessToken: NOTION_ACCESS_TOKEN
  })

  const postsToShow = posts.slice(0, BLOG.postsPerPage)
  const totalPosts = posts.length
  const showNext = totalPosts > BLOG.postsPerPage

  return json({
    page: 1, // current page is 1
    postsToShow,
    showNext
  })
}

export default function Index() {
  const { page, postsToShow, showNext } = useLoaderData<typeof loader>()
  return (
    <Container title={BLOG.title} description={BLOG.description}>
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  )
}
