const homeController = {
    handler: async (request, h) => {
        return h.view('home', {
            pageTitle: 'Home'
        })
    }
}

export { homeController }