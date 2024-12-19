import config from '~/src/config.js'
import { getJson, patchJson, postJson } from '~/src/lib/fetch.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * List forms
 * @param {string} token
 * @param {QueryOptions} options
 * @returns {Promise<QueryResult<FormMetadata>>}
 */
export async function list(token, options) {
  const getJsonByType =
    /** @type {typeof getJson<QueryResult<FormMetadata>>} */ (getJson)

  const requestUrl = new URL(formsEndpoint)
  requestUrl.searchParams.append('page', String(options.page))
  requestUrl.searchParams.append('perPage', String(options.perPage))

  if (options.sortBy && options.order) {
    requestUrl.searchParams.append('sortBy', options.sortBy)
    requestUrl.searchParams.append('order', options.order)
  }

  const { body } = await getJsonByType(requestUrl, getAuthOptions(token))

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
 * @param {string} token
 */
export async function create(metadata, token) {
  const postJsonByType = /** @type {typeof postJson<FormMetadata>} */ (postJson)

  const { body } = await postJsonByType(formsEndpoint, {
    payload: metadata,
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
 * @param {string} token
 */
export async function updateDraftFormDefinition(id, definition, token) {
  const postJsonByType = /** @type {typeof postJson<FormDefinition>} */ (
    postJson
  )

  const requestUrl = new URL(`./${id}/definition/draft`, formsEndpoint)
  const { body } = await postJsonByType(requestUrl, {
    payload: definition,
    ...getAuthOptions(token)
  })

  return body
}

/**
 * Update draft form definition
 * @param {string} id - form ID
 * @param {string} token - auth token
 */
export async function makeDraftFormLive(id, token) {
  const requestUrl = new URL(`./${id}/create-live`, formsEndpoint)
  const { response } = await postJson(requestUrl, {
    ...getAuthOptions(token)
  })

  return response
}

/**
 * Create a draft form
 * @param {string} id - form ID
 * @param {string} token - auth token
 */
export async function createDraft(id, token) {
  const requestUrl = new URL(`./${id}/create-draft`, formsEndpoint)
  const { response } = await postJson(requestUrl, {
    ...getAuthOptions(token)
  })

  return response
}

/**
 * Updates a metadata object.
 * @param {string} id
 * @param {Partial<FormMetadataInput>} metadata
 * @param {string} token - auth token
 * @returns
 */
export async function updateMetadata(id, metadata, token) {
  const patchJsonByType = /** @type {typeof patchJson<FormResponse>} */ (
    patchJson
  )

  const requestUrl = new URL(`./${id}`, formsEndpoint)

  const { body } = await patchJsonByType(requestUrl, {
    payload: metadata,
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
 * @import { FormDefinition, FormMetadata, FormMetadataInput, FormResponse, PaginationOptions, QueryOptions, QueryResult } from '@defra/forms-model'
 * @import Wreck from '@hapi/wreck'
 */
