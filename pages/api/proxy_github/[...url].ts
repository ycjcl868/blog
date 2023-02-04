import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import queryString from 'query-string'
import BLOG from '@/blog.config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, headers } = req
  const { url: queryUrl, ...query } = req.query

  const path = Array.isArray(queryUrl) ? queryUrl.join('/') : ''
  const url = `https://api.github.com/${path}?${queryString.stringify(query)}`

  console.log('url', url)

  const response = await axios(url, {
    method,
    ...(method === 'POST' ? { data: JSON.stringify(body) } : {}),
    headers: headers as any,
    auth: {
      username: BLOG.comment.gitalkConfig.clientID,
      password: BLOG.comment.gitalkConfig.clientSecret
    }
  })

  const status = response.status

  res.status(status).json(response.data)
}
