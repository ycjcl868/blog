import ky from 'ky'

export const config = {
  runtime: 'edge'
}

export default async function handler(req, res) {
  const { body } = req

  const data = await ky
    .post('https://github.com/login/oauth/access_token', {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      }
    })
    .json()

  res.status(200).json(data)
}
