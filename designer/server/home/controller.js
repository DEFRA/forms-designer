const homeController = {
    handler: async (request, h) => {
        return h.view('home', {
            authedUser: await request.getUserSession()
        })
    }
}

export { homeController }