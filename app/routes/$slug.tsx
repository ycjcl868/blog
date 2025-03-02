import BLOG from '#/blog.config';
import {
  json,
  LinksFunction,
  MetaFunction,
  type LoaderFunctionArgs,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import katexStyles from 'katex/dist/katex.min.css?url';
import { Block, PageBlock } from 'notion-types';
import {
  getPageImageUrls,
  getPageTableOfContents,
  uuidToId,
} from 'notion-utils';
import 'prismjs';
import { Theme } from 'remix-themes';
import Layout from '~/layouts/layout';
import { getPost, getPostBlocks } from '~/libs/notion';
import { mapImageUrl } from '~/libs/utils';
import { CACHE_KEY, withKVCache } from '~/libs/withCache';
import { themeSessionResolver } from '~/sessions.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: katexStyles },
];

const BlogPost = () => {
  const { post, coverImage, blockMap, tableOfContent } =
    useLoaderData<typeof loader>();
  if (!post) return null;
  return (
    <Layout
      blockMap={blockMap}
      coverImage={coverImage}
      tableOfContent={tableOfContent}
      frontMatter={post}
      fullWidth={post.fullWidth}
    />
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.post?.title || BLOG.title;
  const description = data?.post?.description || BLOG.description;
  const url = `${BLOG.link}/${data?.post?.slug}`;
  const image =
    data?.coverImage ||
    `${BLOG.ogImageGenerateURL}/${encodeURIComponent(BLOG.title)}.png?theme=${
      data?.theme === Theme.DARK ? 'dark' : 'light'
    }&md=1&fontSize=125px&images=https%3A%2F%2Fnobelium.vercel.app%2Flogo-for-dark-bg.svg`;

  return [
    { title: title },
    {
      name: 'description',
      content: description,
    },
    { title: title },
    { property: 'og:title', content: title },
    { name: 'twitter:title', content: title },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      property: 'og:url',
      content: url,
    },
    ...(image
      ? [
          {
            name: 'twitter:image',
            content: image,
          },
          {
            property: 'og:image',
            content: image,
          },
        ]
      : []),
  ];
};

export const loader = async (params: LoaderFunctionArgs) => {
  const { slug } = params.params;
  const { NOTION_ACCESS_TOKEN, NOTION_PAGE_ID, KV } =
    params.context.cloudflare.env;
  const { getTheme } = await themeSessionResolver(params.request);

  if (!slug) {
    throw new Response('404 Not Found', { status: 404 });
  }

  const [post] = await withKVCache(
    async () => {
      return await getPost({
        slug,
        notionPageId: NOTION_PAGE_ID,
        notionAccessToken: NOTION_ACCESS_TOKEN,
      });
    },
    {
      KV,
      cacheKey: CACHE_KEY.getBlogDetail(slug),
    }
  );
  console.log('post', post);

  if (!post) {
    throw new Response('', { status: 404 });
  }

  const blockMap = await withKVCache(
    async () => {
      return await getPostBlocks(post.id, {
        notionToken: NOTION_ACCESS_TOKEN,
      });
    },
    {
      KV,
      cacheKey: CACHE_KEY.getBlogBlocks(slug, post.id),
      getContentForHash: (data) => {
        // @ts-ignore
        return data?.raw?.page?.last_edited_time;
      },
    }
  );

  const [coverImage = ''] =
    getPageImageUrls(blockMap, {
      mapImageUrl: (url: string, block: Block) => {
        if (block.format?.page_cover) {
          return mapImageUrl(url, block);
        }
      },
    }) || [];

  const keys = Object.keys(blockMap?.block || {});
  const block = blockMap?.block?.[keys[0]]?.value as PageBlock;

  const tableOfContent =
    getPageTableOfContents(block, blockMap)?.map(
      ({ id, text, indentLevel }) => ({
        id: uuidToId(id),
        text,
        indentLevel,
      })
    ) || [];

  return json(
    { post, blockMap, coverImage, tableOfContent, theme: getTheme() },
    {
      headers: {
        'Cache-Control': 'public, stale-while-revalidate=60',
      },
    }
  );
};

export default BlogPost;
