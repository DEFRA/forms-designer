import config from '~/src/config.js'
import { delJson, getJson, postJson, putJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const usersEndpoint = new URL('/users/', config.entitlementUrl)

/**
 * Get user
 * @param {string} token
 * @param {string} userId
 */
export async function getUser(token, userId) {
  const getJsonByType =
    /** @type {typeof getJson<{ entity: EntitlementUser }>} */ (getJson)

  const requestUrl = new URL(userId, usersEndpoint)

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body.entity
}

/**
 * Add a user
 * @param {string} token
 * @param {{ email: string, roles: Roles[] }} userDetails
 */
export async function addUser(token, userDetails) {
  const postJsonByType =
    /** @type {typeof postJson<{ id: string, email: string, displayName: string, entity: EntitlementUser }>} */ (
      postJson
    )

  const requestUrl = new URL(usersEndpoint)

  const { body } = await postJsonByType(requestUrl, {
    payload: {
      email: userDetails.email,
      roles: userDetails.roles
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * Update a user
 * @param {string} token
 * @param {{ userId: string, roles: Roles[] }} userDetails
 */
export async function updateUser(token, userDetails) {
  const putJsonByType = /** @type {typeof putJson<{ id: string }>} */ (putJson)

  const requestUrl = new URL(userDetails.userId, usersEndpoint)

  const { body } = await putJsonByType(requestUrl, {
    payload: {
      roles: userDetails.roles
    },
    ...getHeaders(token)
  })

  return body
}

/**
 * Delete a user
 * @param {string} token
 * @param {string} userId
 */
export async function deleteUser(token, userId) {
  const requestUrl = new URL(userId, usersEndpoint)

  await delJson(requestUrl, getHeaders(token))
}

/**
 * List all users
 * @param {string} token
 */
export async function getUsers(token) {
  const getJsonByType =
    /** @type {typeof getJson<{ entities: EntitlementUser[] }>} */ (getJson)

  const requestUrl = new URL(usersEndpoint)

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body.entities
}

/**
 * @import { EntitlementUser, Roles } from '@defra/forms-model'
 */
