/* eslint-disable camelcase */
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import BLOG from '@/blog.config'

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const { type, data } = req.body as NewCommentBody
  console.log('req.body', req.body)

  if (
    BLOG.comment.cusdisConfig.autoApproval &&
    method === 'POST' &&
    type === 'new_comment'
  ) {
    try {
      const { approve_link = '' } = data || {}
      const { search } = new URL(approve_link)

      if (search) {
        const ret = await axios.post(
          `https://cusdis.com/api/open/approve${search}`
        )
        return res.status(ret.status).json(ret.data)
      }
      console.error('approve_link', approve_link)
    } catch (e) {
      console.error('ERROR', e)
    }
  }

  res.status(200).json({
    success: false
  })
}
