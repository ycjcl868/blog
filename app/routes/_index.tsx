import BLOG from '#/blog.config';
import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import BlogPost from '~/components/BlogPost';
import Container from '~/components/Container';
import Pagination from '~/components/Pagination';
import { getAllPostsList } from '~/libs/notion';
import { CACHE_KEY, withKVCache } from '~/libs/withCache';

export const loader = async (params: LoaderFunctionArgs) => {
  const { context } = params;
  const { NOTION_ACCESS_TOKEN, NOTION_PAGE_ID, KV } = context.cloudflare.env;

  const posts = await withKVCache(
    async () => {
      return await getAllPostsList({
        includePages: false,
        notionPageId: NOTION_PAGE_ID,
        notionAccessToken: NOTION_ACCESS_TOKEN,
      });
    },
    {
      KV,
      cacheKey: CACHE_KEY.blogList,
    }
  );

  const postsToShow = posts.slice(0, BLOG.postsPerPage);
  const totalPosts = posts.length;
  const showNext = totalPosts > BLOG.postsPerPage;

  return json(
    {
      page: 1, // current page is 1
      postsToShow,
      showNext,
    },
    {
      headers: {
        'Cache-Control': 'public, stale-while-revalidate=60',
      },
    }
  );
};

export default function Index() {
  const { page, postsToShow, showNext } = useLoaderData<typeof loader>();
  return (
    <Container description={BLOG.description}>
      {postsToShow.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={page} showNext={showNext} />}
    </Container>
  );
}
