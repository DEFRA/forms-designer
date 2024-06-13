import { fetch, request } from '~/src/common/helpers/fetch.js'

/**
 * @param {string} id
 * @returns {Promise<FormDefinition>}
 */
export function get(id) {
  return fetch(`/api/${id}/data`)
}

/**
 * @param {string} id
 * @param {FormDefinition} definition
 */
export async function save(id, definition) {
  await request(`/api/${id}/data`, {
    method: 'PUT',
    body: definition
  })
}

/**
 * @param {string} level
 * @param {object} payload
 */
export async function log(level, payload) {
  await request('/api/log', {
    method: 'POST',
    body: { level, ...payload }
  })
}

/**
 * @typedef {import('@defra/forms-model').FormDefinition} FormDefinition
 */
