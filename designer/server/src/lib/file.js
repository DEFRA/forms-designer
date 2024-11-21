import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'

const submissionEndpoint = new URL('/file/', config.submissionUrl)

/**
 * @param {string} fieldId
 * @returns {Promise<{ statusCode: StatusCodes, emailIsCaseSensitive: boolean }>}
 */
export async function checkFileStatus(fieldId) {
  const requestUrl = new URL(`./${fieldId}`, submissionEndpoint)

  try {
    /** @type {{ response: import('http').IncomingMessage, body: { retrievalKeyIsCaseSensitive: boolean } }} */
    const result = await getJson(requestUrl, {})

    const statusCode = /** @type {StatusCodes} */ (
      result.response.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
    )

    return {
      statusCode,
      emailIsCaseSensitive: result.body.retrievalKeyIsCaseSensitive
    }
  } catch (err) {
    if (Boom.isBoom(err)) {
      return {
        statusCode: err.output.statusCode,
        emailIsCaseSensitive: false
      }
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
