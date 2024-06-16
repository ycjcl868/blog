import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'
import BLOG from '@/blog.config'

export const config = {
  runtime: 'edge'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, headers } = req
  const { url: queryUrl, ...query } = req.query

  const path = Array.isArray(queryUrl) ? queryUrl.join('/') : ''
  const params = new URLSearchParams(query as Record<string, string>).toString()
  const url = `https://api.github.com/${path}?${params}`

  console.error('url', url)

  const response = await ky(url, {
    method,
    ...(method === 'POST' ? { data: JSON.stringify(body) } : {}),
    headers: headers as any,
    credentials: 'include',
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set(
            'Authorization',
            `Basic ${btoa(
              `${BLOG.comment.gitalkConfig.clientID}:${BLOG.comment.gitalkConfig.clientSecret}`
            )}`
          )
        }
      ]
    }
  })

  const status = response.status
  const data = response.json()

  res.status(status).json(data)
}
