import config from '~/src/config.js'

const appPathPrefix = config.appPathPrefix

function buildEntry(request, text, url) {
  let appPathPrefixNoSlash = appPathPrefix

  if (appPathPrefix.lastIndexOf('/') == appPathPrefix.length) {
    appPathPrefixNoSlash = appPathPrefix.substring(0, appPathPrefix.length - 1)
  }

  url = `${appPathPrefixNoSlash}${url}`

  return {
    text,
    url,
    isActive: request.path === url
  }
}

function buildNavigation(request) {
  return [
    buildEntry(request, 'Home', ''),
    buildEntry(request, 'Form Builder', '/editor/dummy-id-for-demo')
  ]
}

export { buildNavigation }
