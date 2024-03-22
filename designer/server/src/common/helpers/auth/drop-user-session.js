function dropUserSession() {
  if (this?.state?.userSession?.sessionId) {
    this.server.app.cache.drop(this.state.userSession.sessionId)
  }
}

export { dropUserSession }
