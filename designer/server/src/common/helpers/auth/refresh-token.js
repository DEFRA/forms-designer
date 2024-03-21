import fetch from 'node-fetch'

import config from '../../../config'

async function refreshAccessToken(request) {
  const authedUser = await request.getUserSession()
  const refreshToken = authedUser?.refreshToken ?? null
  const azureClientId = config.azureClientId
  const azureClientSecret = config.azureClientSecret
  const params = new URLSearchParams()

  params.append('client_id', azureClientId)
  params.append('client_secret', azureClientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)
  params.append(
    'scope',
    `api://${azureClientId}/forms.user openid profile email offline_access user.read`
  )

  request.logger.info('Azure OIDC access token expired, refreshing...')

  return await fetch(request.server.app.oidc.token_endpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    body: params
  })
}

export { refreshAccessToken }
