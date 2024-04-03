import Boom from '@hapi/boom'
import fetch from 'node-fetch'

/**
 *
 * @param url
 * @param options
 * @returns {Promise<{response: ({ok}|*), json: *}>}
 */
async function fetcher(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    method: options.method || 'get',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers && { headers: options.headers })
    }
  })
  const json = await response.json()

  if (response.ok) {
    return { json, response }
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetcher }
