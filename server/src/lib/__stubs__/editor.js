import Boom from '@hapi/boom'

import config from '~/src/config.js'
import {
  delJson,
  getJson,
  patchJson,
  postJson,
  putJson
} from '~/src/lib/fetch.js'

export const mockedDelJson =
  /** @type {jest.MockedFunction<typeof delJson>} */ (delJson)
export const mockedGetJson =
  /** @type {jest.MockedFunction<typeof getJson>} */ (getJson)
export const mockedPostJson =
  /** @type {jest.MockedFunction<typeof postJson>} */ (postJson)
export const mockedPatchJson =
  /** @type {jest.MockedFunction<typeof patchJson>} */ (patchJson)
export const mockedPutJson =
  /** @type {jest.MockedFunction<typeof putJson>} */ (putJson)

/**
 * Creates a minimal mock response
 * @param {{statusCode?: number}} [props]
 * @returns {IncomingMessage}
 */
export function createMockResponse(props = {}) {
  return /** @type {IncomingMessage} */ ({
    statusCode: props.statusCode,
    headers: {}
  })
}

export const formsEndpoint = new URL('/forms/', config.managerUrl)

export const token = 'someToken'
export const baseOptions = {
  headers: { Authorization: `Bearer ${token}` }
}

/**
 * @param { string | undefined } message
 * @param { FormDefinitionErrorCause[] } cause
 */
export function buildInvalidFormDefinitionError(message, cause) {
  return Boom.boomify(new Error(message, { cause }), {
    statusCode: 400,
    data: {
      message,
      statusCode: 400,
      error: 'InvalidFormDefinitionError'
    }
  })
}

/**
 * @param { string | undefined } message
 * @param { ApiErrorCode | undefined } [errorCode]
 */
export function buildBoom409(message, errorCode) {
  return /** @type {Boom.Boom<{ message: string, statusCode: number, custom?: { errorCode?: string } }>} */ (
    Boom.boomify(new Error(message), {
      statusCode: 409,
      data: { message, statusCode: 409, custom: { errorCode } }
    })
  )
}

/**
 * @import { ApiErrorCode, FormDefinitionErrorCause } from '@defra/forms-model'
 * @import { IncomingMessage } from 'node:http'
 */
