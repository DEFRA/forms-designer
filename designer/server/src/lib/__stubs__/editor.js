import config from '~/src/config.js'
import { delJson, patchJson, postJson, putJson } from '~/src/lib/fetch.js'

export const mockedDelJson =
  /** @type {jest.MockedFunction<typeof delJson>} */ (delJson)
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
 * @import { IncomingMessage } from 'node:http'
 */
