import BLOG from '#/blog.config';
import { ActionFunctionArgs, json } from '@remix-run/cloudflare';

interface NewCommentBody {
  type: 'new_comment';
  data: {
    by_nickname: string;
    by_email: string;
    content: string;
    page_id: string;
    page_title: string;
    project_title: string;
    approve_link: string;
  };
}

export async function action(params: ActionFunctionArgs) {
  const { request } = params;
  const { type, data } = await request.json<NewCommentBody>();

  if (BLOG.comment.cusdisConfig.autoApproval && type === 'new_comment') {
    try {
      const { approve_link = '' } = data || {};
      const { search } = new URL(approve_link);

      if (search) {
        const ret = await fetch(`https://cusdis.com/api/open/approve${search}`);
        const data = await ret.text();

        return json({
          success: data === 'Approved!',
          message: data,
        });
      }
      console.error('approve_link', approve_link);
    } catch (e) {
      console.error('ERROR', e);
    }
  }

  return json({
    success: false,
  });
}
