export const ControllerTypes = [
  {
    name: 'StartPageController',
    path: './pages/start.js'
  },
  {
    name: 'HomePageController',
    path: './pages/home.js'
  },
  {
    name: 'PageController',
    path: './pages/page.js'
  },
  {
    name: 'FileUploadPageController',
    path: './pages/file-upload.js'
  },
  {
    name: 'SummaryPageController',
    path: './pages/summary.js'
  },
  {
    name: 'StatusPageController',
    path: './pages/status.js'
  }
]

export const ControllerNames = ControllerTypes.map(({ name }) =>
  name.toString()
)
