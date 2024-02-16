const homeController = {
    handler: async (request, h) => {
        return h.view('home', {
            pageTitle: 'Home',
            authedUser: await request.getUserSession()
        })
    }
}

export { homeController }