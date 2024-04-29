function buildEntry(request, text, url) {
  return {
    text,
    url,
    isActive: request.path === url
  }
}

function buildNavigation(request) {
  return [
    buildEntry(request, 'Home', '/'),
    buildEntry(request, 'Forms library', '/library')
  ]
}

export { buildNavigation }
