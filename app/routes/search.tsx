import BLOG from '#/blog.config';
import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import SearchLayout from '~/layouts/search';
import { getAllPostsList, getAllTagsFromPosts } from '~/libs/notion';

export const meta: MetaFunction = () => {
  return [{ title: `Search - ${BLOG.title}` }];
};

export const loader = async (params: LoaderFunctionArgs) => {
  const { context } = params;
  const { NOTION_ACCESS_TOKEN, NOTION_PAGE_ID } = context.cloudflare.env;

  const posts = await getAllPostsList({
    includePages: false,
    notionPageId: NOTION_PAGE_ID,
    notionAccessToken: NOTION_ACCESS_TOKEN,
  });
  const tags = getAllTagsFromPosts(posts);
  return {
    tags,
    posts,
  };
};

export default function Search() {
  const { posts, tags } = useLoaderData<typeof loader>();
  return <SearchLayout tags={tags} posts={posts} />;
}
