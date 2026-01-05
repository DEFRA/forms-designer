import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const auditEndpoint = new URL('/audit/forms/', config.auditUrl)

/**
 * @typedef {object} AuditResponse
 * @property {AuditRecord[]} auditRecords - Array of audit records
 * @property {number} skip - Pagination offset
 */

/**
 * Get form audit history
 * @param {string} formId - The form ID
 * @param {string} token - Auth token
 * @returns {Promise<AuditResponse>}
 */
export async function getFormHistory(formId, token) {
  const getJsonByType = /** @type {typeof getJson<AuditResponse>} */ (getJson)

  const requestUrl = new URL(`./${formId}`, auditEndpoint)
  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body
}

/**
 * @import { AuditRecord } from '@defra/forms-model'
 */
