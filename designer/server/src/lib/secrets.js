import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const managerBaseEndpoint = new URL(config.managerUrl)

export const PAYMENT_TEST_API_KEY = 'payment-test-api-key'
export const PAYMENT_LIVE_API_KEY = 'payment-live-api-key'

export const MASKED_KEY = '****************************************'

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
 * @param {string} token
 */
export async function existsSecret(formId, secretName, token) {
  const getJsonByType = /** @type {typeof getJson<{ exists: boolean }>} */ (
    getJson
  )
  const result = await getJsonByType(
    buildRequestUrl(formId, secretName, 'exists'),
    getHeaders(token)
  )
  return result.body.exists
}

/**
 * @param {string} formId
 * @param {string} token
 */
export async function getPaymentSecretsMasked(formId, token) {
  const testKeyExists = await existsSecret(formId, PAYMENT_TEST_API_KEY, token)
  const liveKeyExists = await existsSecret(formId, PAYMENT_LIVE_API_KEY, token)
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
export async function savePaymentSecret(formId, secretValue, isLive, token) {
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
 * @param { ComponentType | undefined } questionType
 * @param {string} formId
 * @param {FormEditorInputQuestionDetails} payload
 * @param {string} token
 */
export async function savePaymentSecrets(questionType, formId, payload, token) {
  if (questionType === ComponentType.PaymentField) {
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
}

/**
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 */
