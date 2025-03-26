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

  const { searchParams } = new URL(params.request.url);
  const updateCache = !!searchParams.get('update');

  console.log('updateCache', updateCache);

  const [posts, contentHash] = await withKVCache(
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
      updateCache,
    }
  );

  const page = Number(params?.params?.pageId) || 1;
  const startIdx = (page - 1) * BLOG.postsPerPage;
  const postsToShow = posts.slice(startIdx, startIdx + BLOG.postsPerPage);

  const totalPosts = posts.length;
  const showNext = startIdx + BLOG.postsPerPage < totalPosts;

  return json(
    {
      page,
      postsToShow,
      showNext,
    },
    {
      headers: {
        'X-Content-Hash': contentHash,
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
      <Pagination page={page} showNext={showNext} />
    </Container>
  );
}
