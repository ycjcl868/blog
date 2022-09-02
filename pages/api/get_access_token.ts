import fetch from 'node-fetch'

export default async function handler(req, res) {
  const { body } = req

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', accept: 'application/json' }
  })
  const data = await response.json()

  res.status(200).json(data)
}
