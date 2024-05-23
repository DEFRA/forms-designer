import Boom from '@hapi/boom'

import { hasUser } from '~/src/common/helpers/auth/get-user-session.js'
import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * List forms
 * @param {string} token
 */
export async function list(token) {
  const getJsonByType = /** @type {typeof getJson<FormMetadata[]>} */ (getJson)

  const { body } = await getJsonByType(formsEndpoint, getAuthOptions(token))

  return body
}

/**
 * Get form by slug
 * @param {string} slug
 * @param {string} token
 */
export async function get(slug, token) {
  const getJsonByType = /** @type {typeof getJson<FormMetadata>} */ (getJson)

  const requestUrl = new URL(`./slug/${slug}`, formsEndpoint)
  const { body } = await getJsonByType(requestUrl, getAuthOptions(token))

  return body
}

/**
 * Create form
 * @param {FormMetadataInput} metadata
 * @param {FormMetadataAuthor} author
 * @param {string} token
 */
export async function create(metadata, author, token) {
  const postJsonByType = /** @type {typeof postJson<FormMetadata>} */ (postJson)

  const { body } = await postJsonByType(formsEndpoint, {
    payload: { metadata, author },
    ...getAuthOptions(token)
  })

  return body
}

/**
 * Update form by ID
 * @param {string} id
 * @param {Partial<FormMetadataInput>} metadata
 * @param {string} token
 */
export async function update(id, metadata, token) {
  const postJsonByType = /** @type {typeof postJson<FormMetadata>} */ (postJson)

  const requestUrl = new URL(`./${id}`, formsEndpoint)
  const { body } = await postJsonByType(requestUrl, {
    payload: metadata,
    ...getAuthOptions(token)
  })

  return body
}

/**
 * Get draft form definition
 * @param {string} id
 * @param {string} token
 */
export async function getDraftFormDefinition(id, token) {
  const getJsonByType = /** @type {typeof getJson<FormDefinition>} */ (getJson)

  const requestUrl = new URL(`./${id}/definition/draft`, formsEndpoint)
  const { body } = await getJsonByType(requestUrl, getAuthOptions(token))

  return body
}

/**
 * Update draft form definition
 * @param {string} id
 * @param {FormDefinition} definition - form definition
 * @param {FormMetadataAuthor} author
 * @param {string} token
 */
export async function updateDraftFormDefinition(id, definition, author, token) {
  const postJsonByType = /** @type {typeof postJson<FormDefinition>} */ (
    postJson
  )

  const requestUrl = new URL(`./${id}/definition/draft`, formsEndpoint)
  const { body } = await postJsonByType(requestUrl, {
    payload: { definition, author },
    ...getAuthOptions(token)
  })

  return body
}

/**
 * @param {AuthCredentials | null} [credentials]
 * @returns {FormMetadataAuthor}
 */
export function getAuthor(credentials) {
  if (!hasUser(credentials)) {
    throw Boom.unauthorized('Failed to get author from auth credentials')
  }

  const { id, displayName } = credentials.user
  return { id, displayName }
}

/**
 * @param {string} token
 */
function getAuthOptions(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

/**
 * @typedef {import('@defra/forms-model').FormDefinition} FormDefinition
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 * @typedef {import('@defra/forms-model').FormMetadataAuthor} FormMetadataAuthor
 * @typedef {import('@hapi/hapi').AuthCredentials} AuthCredentials
 */
