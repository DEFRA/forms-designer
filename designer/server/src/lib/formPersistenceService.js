import Wreck from '@hapi/wreck'

import config from '~/src/config.js'

/**
 * Get draft form definition
 * @param {string} id
 * @returns {Promise<import('@defra/forms-model').FormDefinition | null>}
 */
export async function getDraftFormDefinition(id) {
  const { payload } = await Wreck.get(
    `${config.managerUrl}/forms/${id}/definition/draft`
  )
  return payload
}

/**
 * Update draft form definition
 * @param {string} id
 * @param {string} configuration
 */
export function updateDraftFormDefinition(id, configuration) {
  return Wreck.post(`${config.managerUrl}/forms/${id}/definition/draft`, {
    payload: configuration
  })
}
