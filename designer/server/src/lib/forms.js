import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'

const formsEndpoint = `${config.managerUrl}/forms`

/**
 * @param {string} id - form ID
 */
function getDraftFormDefinitionEndpoint(id) {
  return `${config.managerUrl}/forms/${id}/definition/draft`
}

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
  // TODO
  const form = /** @type {FormMetadata} */ ({})
  return Promise.resolve(form)
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
  const endpoint = getDraftFormDefinitionEndpoint(id)
  const getJsonByType = /** @type {typeof getJson<FormDefinition>} */ (getJson)
  const { body } = await getJsonByType(endpoint)

  return body
}

/**
 * Update draft form definition
 * @param {string} id
 * @param {FormDefinition} definition - form definition as string in JSON format
 */
export async function updateDraftFormDefinition(id, definition) {
  const endpoint = getDraftFormDefinitionEndpoint(id)
  const postJsonByType = /** @type {typeof postJson<FormDefinition>} */ (
    postJson
  )
  const { body } = await postJsonByType(endpoint, { payload: definition })

  return body
}

/**
 * @typedef {import('@defra/forms-model').FormDefinition} FormDefinition
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 */
