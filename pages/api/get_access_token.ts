import axios from 'axios'
import https from 'https'

const agent = new https.Agent({
  rejectUnauthorized: false
})

export default async function handler(req, res) {
  const { body } = req

  const response = await axios('https://github.com/login/oauth/access_token', {
    method: 'post',
    httpsAgent: agent,
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', accept: 'application/json' }
  })

  res.status(200).json(response.data)
}
