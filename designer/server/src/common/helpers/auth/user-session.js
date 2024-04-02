import jwt from '@hapi/jwt'
import { addSeconds } from 'date-fns'

function removeUserSession(request) {
  request.dropUserSession()
  request.cookieAuth.clear()
}

async function createUserSession(request, sessionId) {
  const expiresInSeconds = request.auth.credentials.expiresIn
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  const { profile } = request.auth.credentials

  await request.server.app.cache.set(sessionId, {
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    loginHint: profile.loginHint,
    isAuthenticated: request.auth.isAuthenticated,
    token: request.auth.credentials.token,
    refreshToken: request.auth.credentials.refreshToken,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })
}

async function updateUserSession(request, refreshedSession) {
  const refreshedPayload = jwt.token.decode(refreshedSession.access_token)
    .decoded.payload

  // Update userSession with new access token and new expiry details
  const expiresInSeconds = refreshedSession.expires_in
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  await request.server.app.cache.set(request.state.userSession.sessionId, {
    id: refreshedPayload.oid,
    email: refreshedPayload.preferred_username,
    displayName: refreshedPayload.name,
    loginHint: refreshedPayload.login_hint,
    isAuthenticated: true,
    token: refreshedSession.access_token,
    refreshToken: refreshedSession.refresh_token,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })

  return await request.getUserSession()
}

export { createUserSession, updateUserSession, removeUserSession }
