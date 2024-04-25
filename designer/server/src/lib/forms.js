import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'

const endpoint = `${config.managerUrl}/forms`

/**
 * List forms
 */
export async function list() {
  const getJsonByType = /** @type {typeof getJson<FormMetadata[]>} */ (getJson)

  const { body } = await getJsonByType(endpoint)

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
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 * @typedef {import('@defra/forms-model').FormMetadataInput} FormMetadataInput
 */
