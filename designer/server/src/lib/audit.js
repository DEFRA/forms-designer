import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const auditEndpoint = new URL('/audit/forms/', config.auditUrl)

/**
 * @typedef {object} AuditSortingMeta
 * @property {string} sortBy - Field to sort by
 * @property {string} order - Sort order (asc/desc)
 */

/**
 * @typedef {object} AuditResponseMeta
 * @property {PaginationResult} pagination - Pagination metadata
 * @property {AuditSortingMeta} sorting - Sorting metadata
 */

/**
 * @typedef {object} AuditResponse
 * @property {(AuditRecord | ConsolidatedAuditRecord)[]} auditRecords - Array of audit records
 * @property {AuditResponseMeta} meta - Response metadata
 */

/**
 * @typedef {object} AuditHistoryOptions
 * @property {number} [page] - Page number
 * @property {number} [perPage] - Items per page
 * @property {boolean} [consolidate] - Whether to consolidate consecutive edit events
 */

/**
 * Get form audit history
 * @param {string} formId - The form ID
 * @param {string} token - Auth token
 * @param {AuditHistoryOptions} [options] - Query options
 * @returns {Promise<AuditResponse>}
 */
export async function getFormHistory(formId, token, options) {
  const getJsonByType = /** @type {typeof getJson<AuditResponse>} */ (getJson)

  const requestUrl = new URL(`./${formId}`, auditEndpoint)

  if (options?.page) {
    requestUrl.searchParams.append('page', String(options.page))
  }

  if (options?.perPage) {
    requestUrl.searchParams.append('perPage', String(options.perPage))
  }

  if (options?.consolidate) {
    requestUrl.searchParams.append('consolidate', 'true')
  }

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body
}

/**
 * @import { AuditRecord, ConsolidatedAuditRecord, PaginationOptions, PaginationResult } from '@defra/forms-model'
 */
