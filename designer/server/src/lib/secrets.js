import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const managerBaseEndpoint = new URL(config.managerUrl)

const PAYMENT_TEST_API_KEY = 'payment-test-api-key'
const PAYMENT_LIVE_API_KEY = 'payment-live-api-key'

const MASKED_KEY = '****************************************'

/**
 * @param {string} formId
 * @param {string} secretName
 * @param {string} [pathSuffix]
 */
export function buildRequestUrl(formId, secretName, pathSuffix) {
  const suffix = pathSuffix ? `/${pathSuffix}` : ''
  return new URL(
    `/forms/${formId}/secrets/${secretName}${suffix}`,
    managerBaseEndpoint
  )
}

/**
 * @param {string} formId
 * @param {string} secretName
 */
export async function existsSecret(formId, secretName) {
  const getJsonByType = /** @type {typeof getJson<{ exists: boolean }>} */ (
    getJson
  )
  const result = await getJsonByType(
    buildRequestUrl(formId, secretName, 'exists')
  )
  return result.body.exists
}

/**
 * @param {string} formId
 */
export async function getPaymentSecretsMasked(formId) {
  const testKeyExists = await existsSecret(formId, PAYMENT_TEST_API_KEY)
  const liveKeyExists = await existsSecret(formId, PAYMENT_LIVE_API_KEY)
  return {
    testKeyMasked: testKeyExists ? MASKED_KEY : '',
    liveKeyMasked: liveKeyExists ? MASKED_KEY : ''
  }
}

/**
 * @param {string} formId
 * @param {string} secretValue
 * @param {boolean} isLive
 * @param {string} token
 */
async function savePaymentSecret(formId, secretValue, isLive, token) {
  const key = isLive ? PAYMENT_LIVE_API_KEY : PAYMENT_TEST_API_KEY
  const { response } = await postJson(buildRequestUrl(formId, key), {
    payload: { secretValue },
    ...getHeaders(token)
  })
  if (response.statusCode !== StatusCodes.OK) {
    throw new Error(
      `Failed to save ${isLive ? 'LIVE' : 'TEST'} Payment API key`
    )
  }
}

/**
 * @param {string} formId
 * @param {FormEditorInputQuestionDetails} payload
 * @param {string} token
 */
export async function savePaymentSecrets(formId, payload, token) {
  // Only save API key if it's a non-masked version
  if (
    payload.paymentTestApiKey !== MASKED_KEY &&
    payload.paymentTestApiKey.length
  ) {
    await savePaymentSecret(formId, payload.paymentTestApiKey, false, token)
  }
  if (
    payload.paymentLiveApiKey !== MASKED_KEY &&
    payload.paymentLiveApiKey.length
  ) {
    await savePaymentSecret(formId, payload.paymentLiveApiKey, true, token)
  }
}

/**
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 */
