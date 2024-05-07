/**
 * @this {{ server: import('@hapi/hapi').Server, state?: { userSession?: { sessionId?: string } } }}
 * @returns {Promise<UserSession | undefined>}
 */
async function getUserSession() {
  return this.state?.userSession?.sessionId
    ? await this.server.methods.session.get(this.state.userSession.sessionId)
    : {}
}

export { getUserSession }

/**
 * @typedef {object} UserSession
 * @property {string} id - User ID
 * @property {string} email - User email address
 * @property {string} displayName - User display name
 * @property {string} loginHint - User login hint
 * @property {boolean} isAuthenticated - User is authenticated
 * @property {string} token - User token
 * @property {string} refreshToken - User refresh token
 * @property {number} expiresIn - User session expiry time remaining
 * @property {Date} expiresAt - User session expiry time
 */
