import { getAllPostsList } from '~/libs/notion';
import { generateRss } from '~/libs/rss';

import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { NOTION_ACCESS_TOKEN, NOTION_PAGE_ID } = context.cloudflare.env;
  const posts = await getAllPostsList({
    includePages: false,
    notionPageId: NOTION_PAGE_ID,
    notionAccessToken: NOTION_ACCESS_TOKEN,
  });
  const latestPosts = posts.slice(0, 10);
  const xmlFeed = generateRss(latestPosts);

  return new Response(xmlFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, stale-while-revalidate=60',
    },
  });
};
