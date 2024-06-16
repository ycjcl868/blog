import ky from 'ky'

export const config = {
  runtime: 'edge'
}

export default async function handler(req, res) {
  const json = await ky.post(process.env.DEPLOY_BUILD_HOOK, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })

  res.status(200).json(json)
}
