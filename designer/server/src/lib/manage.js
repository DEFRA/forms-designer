import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const usersEndpoint = new URL('/users/', config.entitlementUrl)
const rolesEndpoint = new URL('/roles/', config.entitlementUrl)

/**
 * List all roles
 * @param {string} token
 */
export async function getRoles(token) {
  const getJsonByType =
    /** @type {typeof getJson<{ roles: EntitlementRole[] }>} */ (getJson)

  const requestUrl = new URL(rolesEndpoint)

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body.roles
}

/**
 * Add a user
 * @param {string} token
 * @param {{ userId: string, roles: string[] }} userDetails
 */
export async function addUser(token, userDetails) {
  const postJsonByType =
    /** @type {typeof postJson<{ emailAddress: string, userRole: string }>} */ (
      postJson
    )

  const requestUrl = new URL(usersEndpoint)

  const { body } = await postJsonByType(requestUrl, {
    payload: userDetails,
    ...getHeaders(token)
  })

  return body
}

/**
 * @import { EntitlementRole } from '@defra/forms-model'
 */
