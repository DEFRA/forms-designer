import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const entitlementEndpoint = new URL('/users/', config.entitlementUrl)

/**
 * List all users
 * @param {string} token
 */
export async function getUsers(token) {
  const getJsonByType =
    /** @type {typeof getJson<{ entities: EntitlementUser[] }>} */ (getJson)

  const requestUrl = new URL(entitlementEndpoint)

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body.entities
}

/**
 * @import {EntitlementUser} from '@defra/forms-model'
 */
