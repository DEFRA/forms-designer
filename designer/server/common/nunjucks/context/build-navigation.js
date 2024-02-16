import config from '../../../config'

const appPathPrefix = config.appPathPrefix

function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: appPathPrefix,
      isActive: request.path === appPathPrefix
    }
  ]
}

export { buildNavigation }
