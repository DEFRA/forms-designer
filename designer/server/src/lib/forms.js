import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'

const endpoint = `${config.managerUrl}/forms`

/**
 * List forms
 */
export async function list() {
  const getJsonByType = /** @type {typeof getJson<FormConfiguration[]>} */ (
    getJson
  )

  const { body } = await getJsonByType(endpoint)

  return body
}

/**
 * Get form by ID
 * @param {string} id
 */
export async function get(id) {
  // TODO
  const form = /** @type {FormConfiguration} */ ({})
  return Promise.resolve(form)
}

/**
 * Create form
 * @param {FormConfigurationInput} data
 */
export async function create(data) {
  // TODO
  const form = /** @type {FormConfiguration} */ ({})
  return Promise.resolve(form)
}

/**
 * Update form by ID
 * @param {string} id
 * @param {Partial<FormConfigurationInput>} data
 */
export async function update(id, data) {
  // TODO
  const form = /** @type {FormConfiguration} */ ({})
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
 * @todo Export from @defra/forms-manager
 * @typedef {object} FormConfiguration
 * @property {string} id - The id of the form
 * @property {string} title - The human-readable title of the form
 * @property {string} organisation - The organisation this form belongs to
 * @property {string} teamName - The name of the team who own this form
 * @property {string} teamEmail - The email of the team who own this form
 */

/**
 * @todo Export from @defra/forms-manager
 * @typedef {Omit<FormConfiguration, 'id'>} FormConfigurationInput
 */
