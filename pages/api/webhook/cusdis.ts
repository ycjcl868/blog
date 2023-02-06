import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import queryString from 'query-string'
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
  const { method, headers } = req
  const { type, data } = req.body as NewCommentBody
  console.log('req.body', req.body)

  if (method === 'POST' && type === 'new_comment') {
    console.log('approve_link', data.approve_link)
  }

  res.status(200).json({})
}
