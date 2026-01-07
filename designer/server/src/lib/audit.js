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
 * @property {AuditRecord[]} auditRecords - Array of audit records
 * @property {AuditResponseMeta} meta - Response metadata
 */

/**
 * Get form audit history
 * @param {string} formId - The form ID
 * @param {string} token - Auth token
 * @param {PaginationOptions} [options] - Pagination options
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

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body
}

/**
 * @import { AuditRecord, PaginationOptions, PaginationResult } from '@defra/forms-model'
 */
