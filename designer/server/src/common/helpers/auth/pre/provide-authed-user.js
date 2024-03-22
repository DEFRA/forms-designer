const provideAuthedUser = {
  method: async (request) => (await request.getUserSession()) ?? null,
  assign: 'authedUser'
}

export { provideAuthedUser }
