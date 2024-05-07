async function dropUserSession() {
  if (this?.state?.userSession?.sessionId) {
    await this.server.methods.session.drop(this.state.userSession.sessionId)
  }
}

export { dropUserSession }
