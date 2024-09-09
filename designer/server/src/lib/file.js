import Boom from '@hapi/boom'

import config from '~/src/config.js'
import { get, postJson } from '~/src/lib/fetch.js'

const submissionEndpoint = new URL('/file/', config.submissionUrl)

/**
 * @param {string} fieldId
 */
export async function checkFileStatus(fieldId) {
  const requestUrl = new URL(`./${fieldId}`, submissionEndpoint)

  try {
    const result = await get(requestUrl, {})
    return result.response.statusCode
  } catch (err) {
    if (Boom.isBoom(err)) {
      return err.output.statusCode
    }

    throw err
  }
}

/**
 * @param {string} fileId
 * @param {string} retrievalKey
 * @param {string} token
 */
export async function createFileLink(fileId, retrievalKey, token) {
  const requestUrl = new URL('link', submissionEndpoint)

  const postJsonByType = /** @type {typeof postJson<{ url: string }>} */ (
    postJson
  )
  const { body } = await postJsonByType(requestUrl, {
    payload: { fileId, retrievalKey },
    ...getAuthOptions(token)
  })
  return body
}

/**
 * @param {string} token
 * @returns {Parameters<typeof Wreck.request>[2]}
 */
function getAuthOptions(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

/**
 * @import Wreck from '@hapi/wreck'
 */
