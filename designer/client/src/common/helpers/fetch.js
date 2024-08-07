import { logger } from '~/src/common/helpers/logging/logger.js'

/**
 * @template {object} [RequestType={}]
 * @param {string} path
 * @param {Omit<RequestInit, 'body'> & { body?: RequestType }} [options]
 */
export async function request(path, options = {}) {
  const { body, ...init } = options

  try {
    const response = await window.fetch(path, {
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
      ...init
    })

    if (!response.ok) {
      throw Error(response.statusText)
    }

    return response
  } catch (error) {
    logger.error(error, 'fetch')
    throw error
  }
}

/**
 * @template {object} [RequestType={}]
 * @template {object} [ResponseType=RequestType]
 * @param {string} path
 * @param {Omit<RequestInit, 'body'> & { body?: RequestType }} [options]
 */
export async function fetch(path, options) {
  const response = await request(path, options)
  const json = /** @type {Promise<ResponseType>} */ (response.json())
  return json
}
