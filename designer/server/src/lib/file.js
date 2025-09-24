import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const submissionEndpoint = new URL('/file/', config.submissionUrl)

/**
 * @param {string} fieldId
 * @returns {Promise<{ statusCode: StatusCodes, emailIsCaseSensitive: boolean, filename: string }>}
 */
export async function checkFileStatus(fieldId) {
  const requestUrl = new URL(`./${fieldId}`, submissionEndpoint)

  try {
    /** @type {{ response: import('http').IncomingMessage, body: { retrievalKeyIsCaseSensitive: boolean, filename: string } }} */
    const result = await getJson(requestUrl, {})

    const statusCode = /** @type {StatusCodes} */ (
      result.response.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
    )

    return {
      statusCode,
      emailIsCaseSensitive: result.body.retrievalKeyIsCaseSensitive,
      filename: result.body.filename
    }
  } catch (err) {
    if (Boom.isBoom(err)) {
      return {
        statusCode: err.output.statusCode,
        emailIsCaseSensitive: false,
        filename: ''
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
    ...getHeaders(token)
  })
  return body
}
