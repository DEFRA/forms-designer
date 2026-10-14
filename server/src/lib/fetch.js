import Boom from '@hapi/boom'
import Wreck from '@hapi/wreck'
import { StatusCodes } from 'http-status-codes'

/**
 * @template {object} [BodyType=Buffer]
 * @param {string} method
 * @param {URL} url
 * @param {Parameters<typeof Wreck.request>[2]} options
 */
export async function request(method, url, options) {
  const response = await Wreck.request(method, url.href, options)

  /** @type {BodyType} */
  const body = await Wreck.read(response, options)

  if (response.statusCode !== StatusCodes.OK) {
    const statusCode = response.statusCode
    let err

    if ('message' in body && typeof body.message === 'string' && body.message) {
      const cause = 'cause' in body ? body.cause : undefined
      err = new Error(body.message, { cause })
    } else {
      err = new Error(`HTTP status code ${statusCode}`)
    }

    throw Boom.boomify(err, { statusCode, data: body })
  }

  return { response, body }
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.get>[1]} options
 */
export function get(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('get', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.post>[1]} options
 */
export function post(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('post', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.patch>[1]} options
 */
export function patch(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('patch', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.put>[1]} options
 */
export function put(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('put', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.delete>[1]} options
 */
export function del(url, options) {
  const requestByType = /** @type {typeof request<BodyType>} */ (request)
  return requestByType('delete', url, options)
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.get>[1]} options
 */
export function getJson(url, options = {}) {
  const getByType = /** @type {typeof get<BodyType>} */ (get)
  return getByType(url, { json: true, ...options })
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.post>[1]} options
 */
export function postJson(url, options = {}) {
  const postByType = /** @type {typeof post<BodyType>} */ (post)
  return postByType(url, { json: true, ...options })
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.put>[1]} options
 */
export function putJson(url, options = {}) {
  const putByType = /** @type {typeof put<BodyType>} */ (put)
  return putByType(url, { json: true, ...options })
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.patch>[1]} options
 */
export function patchJson(url, options = {}) {
  const patchByType = /** @type {typeof patch<BodyType>} */ (patch)
  return patchByType(url, { json: true, ...options })
}

/**
 * @template {object} [BodyType=Buffer]
 * @param {URL} url
 * @param {Parameters<typeof Wreck.patch>[1]} options
 */
export function delJson(url, options = {}) {
  const delByType = /** @type {typeof patch<BodyType>} */ (del)
  return delByType(url, { json: true, ...options })
}
