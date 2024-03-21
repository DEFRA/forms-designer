import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { refreshAccessToken } from '~/src/common/helpers/auth/refresh-token.js'
import {
  removeUserSession,
  updateUserSession
} from '~/src/common/helpers/auth/user-session.js'

function authedFetcher(request) {
  return async (url, options = {}) => {
    const authedUser = await request.getUserSession()
    const token = authedUser?.token ?? null

    const fetchWithAuth = (token) =>
      fetch(url, {
        ...options,
        headers: {
          ...(options?.headers && options?.headers),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

    return fetchWithAuth(token).then(async (response) => {
      if (response.status === 401) {
        // Initial request has received a 401 from a call to an API. Refresh token and replay initial request
        const refreshTokenResponse = await refreshAccessToken(request)
        const refreshTokenResponseJson = await refreshTokenResponse.json()

        if (!refreshTokenResponse.ok) {
          removeUserSession(request)
        }

        if (refreshTokenResponse.ok) {
          await updateUserSession(request, refreshTokenResponseJson)

          const authedUser = await request.getUserSession()
          const newToken = authedUser?.token ?? null

          // Replay initial request with new token
          return await fetchWithAuth(newToken)
        }
      }

      const json = await response.json()

      if (response.ok) {
        return { json, response }
      }

      throw Boom.boomify(new Error(json.message), {
        statusCode: response.status
      })
    })
  }
}

export { authedFetcher }
