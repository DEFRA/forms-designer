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
export function log(level, payload) {
  const blob = new Blob([JSON.stringify({ level, ...payload })], {
    type: 'application/json'
  })
  navigator.sendBeacon('/api/log', blob)
}

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
