import Wreck from '@hapi/wreck'

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} method
 * @param {string} url
 * @param {RequestOptions} options
 */
export async function request(method, url, options) {
  const response = await Wreck.request(method, url, options)

  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage)
  }

  /** @type {BodyType} */
  const body = await Wreck.read(response, options)

  return { response, body }
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} url
 * @param {RequestOptions} options
 */
export function get(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('get', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} url
 * @param {RequestOptions} options
 */
export function post(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('post', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} url
 * @param {RequestOptions} options
 */
export function put(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('put', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} url
 * @param {RequestOptions} options
 */
export function del(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('delete', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} url
 * @param {RequestOptions} options
 */
export function getJson(url, options = {}) {
  const getByType = /** @type {typeof get<BodyType>} */ (get)
  return getByType(url, { json: true, ...options })
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} url
 * @param {RequestOptions} options
 */
export function postJson(url, options = {}) {
  const postByType = /** @type {typeof post<BodyType>} */ (post)
  return postByType(url, { json: true, ...options })
}

/**
 * @typedef {Parameters<typeof Wreck.defaults>[0]} RequestOptions
 */
