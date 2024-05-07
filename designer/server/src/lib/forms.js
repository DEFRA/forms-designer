import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'

const formsEndpoint = new URL('/forms/', config.managerUrl)

/**
 * List forms
 */
export async function list() {
  const getJsonByType = /** @type {typeof getJson<FormMetadata[]>} */ (getJson)

  const { body } = await getJsonByType(formsEndpoint)

  return body
}

/**
 * Get form by ID
 * @param {string} id
 */
export async function get(id) {
  const getJsonByType = /** @type {typeof getJson<FormMetadata>} */ (getJson)

  const requestUrl = new URL(`./${id}`, formsEndpoint)
  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Create form
 * @param {FormMetadataInput} data
 */
export async function create(data) {
  // TODO
  const form = /** @type {FormMetadata} */ ({})
  return Promise.resolve(form)
}

/**
 * Update form by ID
 * @param {string} id
 * @param {Partial<FormMetadataInput>} data
 */
export async function update(id, data) {
  // TODO
  const form = /** @type {FormMetadata} */ ({})
  return Promise.resolve(form)
}

/**
 * Remove form by ID
 * @param {string} id
 */
export async function remove(id) {
  // TODO
  return Promise.resolve(true)
}

/**
 * Get draft form definition
 * @param {string} id
 */
export async function getDraftFormDefinition(id) {
  const getJsonByType = /** @type {typeof getJson<FormDefinition>} */ (getJson)

  const requestUrl = new URL(`./${id}/definition/draft`, formsEndpoint)
  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * Update draft form definition
 * @param {string} id
 * @param {FormDefinition} definition - form definition
 */
export async function updateDraftFormDefinition(id, definition) {
  const postJsonByType = /** @type {typeof postJson<FormDefinition>} */ (
    postJson
  )

  const requestUrl = new URL(`./${id}/definition/draft`, formsEndpoint)
  const { body } = await postJsonByType(requestUrl, { payload: definition })

  return body
}

/**
 * @typedef {import('@defra/forms-model').FormDefinition} FormDefinition
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 */
