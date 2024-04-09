import wreck from '@hapi/wreck'

export async function request(method, url, options) {
  const response = await wreck.request(method, url, options)

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage)
  }

  const body = await wreck.read(response, options)

  return { response, body }
}

export function get(url, options) {
  return request('get', url, options)
}

export function post(url, options) {
  return request('post', url, options)
}

export function put(url, options) {
  return request('post', url, options)
}

export function del(url, options) {
  return request('delete', url, options)
}

export function getJson(url, options = {}) {
  return get(url, { json: true, ...options })
}

export function postJson(url, options = {}) {
  return post(url, { json: true, ...options })
}
