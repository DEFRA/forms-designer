import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'

const metricsEndpoint = new URL('/metrics/', config.auditUrl)

/**
 * Get metrics
 * @param {string} pageType
 */
export async function getMetrics(pageType) {
  const getJsonByType = /** @type {typeof getJson<FormDefinition>} */ (getJson)

  // pageType - FormActivity
  // subTab - 7/30/all

  // pageType - ComponentUsage
  // subTab - QuestionTypes/Features/FormStructure

  const requestUrl = new URL(`./${pageType}`, metricsEndpoint)
  const { body } = await getJsonByType(requestUrl)

  return body
}

/**
 * @import { FormDefinition } from '@defra/forms-model'
 */
