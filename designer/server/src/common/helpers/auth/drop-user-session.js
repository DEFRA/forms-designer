import {
  getUserSession,
  hasUser
} from '~/src/common/helpers/auth/get-user-session.js'

/**
 * @param {Request | Request<{ AuthArtifactsExtra: AuthArtifacts }> | Request<{ Query: { logoutHint?: string } }> } request
 */
export async function dropUserSession(request) {
  const { cookieAuth, server } = request

  const credentials = await getUserSession(request)

  // Remove user session from Redis
  if (hasUser(credentials)) {
    await server.methods.session.drop(credentials.user.id)
  }

  // Clear authentication cookie
  cookieAuth.clear()
}

/**
 * @import { AuthArtifacts, Request } from '@hapi/hapi'
 */
