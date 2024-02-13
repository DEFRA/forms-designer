const homeController = {
    handler: async (request, h) =>
        h.view('home', {
            loggedInUser: request.auth.isAuthenticated ? request.auth.credentials.displayName : "NOT_LOGGED_IN",
            authedUser: await request.getUserSession()
        })
}

export { homeController }