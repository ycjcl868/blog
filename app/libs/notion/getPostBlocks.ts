import { Client } from '@notionhq/client';
import { NotionCompatAPI } from 'notion-compat';

export async function getPostBlocks(
  id: string,
  options: {
    notionToken: string;
  }
) {
  console.log('getPostBlocks');
  const notion = new NotionCompatAPI(new Client({ auth: options.notionToken }));
  const pageBlock = await notion.getPage(id);
  console.log('pageBlock', pageBlock.notion_user);

  // ref: https://github.com/transitive-bullshit/nextjs-notion-starter-kit/issues/279#issuecomment-1245467818
  if (pageBlock && pageBlock.signed_urls) {
    const signedUrls = pageBlock.signed_urls;
    const newSignedUrls = {};
    for (const p in signedUrls) {
      if (signedUrls[p] && signedUrls[p].includes('.amazonaws.com/')) {
        console.log('skip : ' + signedUrls[p]);
        continue;
      }
      newSignedUrls[p] = signedUrls[p];
    }
    pageBlock.signed_urls = newSignedUrls;
  }

  return pageBlock;
}
