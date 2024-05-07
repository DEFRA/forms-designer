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

  await request.server.methods.session.set(sessionId, {
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

export { createUserSession, removeUserSession }
