/* eslint-disable camelcase */
import BLOG from '@/blog.config'

export const config = {
  runtime: 'edge'
}

interface NewCommentBody {
  type: 'new_comment'
  data: {
    by_nickname: string
    by_email: string
    content: string
    page_id: string
    page_title: string
    project_title: string
    approve_link: string
  }
}

export default async function handler(req: Request) {
  const { method } = req
  const { type, data } = (await req.json()) as NewCommentBody

  if (
    BLOG.comment.cusdisConfig.autoApproval &&
    method === 'POST' &&
    type === 'new_comment'
  ) {
    try {
      const { approve_link = '' } = data || {}
      const { search } = new URL(approve_link)

      if (search) {
        const ret = await fetch(`https://cusdis.com/api/open/approve${search}`)
        const data = await ret.text()

        return new Response(
          JSON.stringify({
            success: data === 'Approved!',
            message: data
          }),
          {
            status: ret.status
          }
        )
      }
      console.error('approve_link', approve_link)
    } catch (e) {
      console.error('ERROR', e)
    }
  }

  return new Response(
    JSON.stringify({
      success: false
    }),
    {
      status: 200
    }
  )
}
