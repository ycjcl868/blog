import axios from 'axios'

export default async function handler(req, res) {
  const { body } = req

  const response = await axios('https://github.com/login/oauth/access_token', {
    method: 'post',
    data: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', accept: 'application/json' }
  })

  res.status(200).json(response.data)
}
