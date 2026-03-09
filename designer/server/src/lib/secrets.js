import { ComponentType } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const managerBaseEndpoint = new URL(config.managerUrl)

export const PAYMENT_TEST_API_KEY = 'payment-test-api-key'
export const PAYMENT_LIVE_API_KEY = 'payment-live-api-key'
export const PAYMENT_LIVE_API_KEY_PENDING = 'payment-live-api-key-pending'

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
  const getJsonByType =
    /** @type {typeof getJson<{ exists: boolean, createdAt: Date | undefined, updatedAt: Date | undefined }>} */ (
      getJson
    )
  const result = await getJsonByType(
    buildRequestUrl(formId, secretName, 'exists'),
    getHeaders(token)
  )
  return result.body
}

/**
 * @param {string} formId
 * @param {string} token
 */
export async function getPaymentSecretsMasked(formId, token) {
  const [testKeyExists, liveKeyPendingExists, liveKeyExists] =
    await Promise.all([
      existsSecret(formId, PAYMENT_TEST_API_KEY, token),
      existsSecret(formId, PAYMENT_LIVE_API_KEY_PENDING, token),
      existsSecret(formId, PAYMENT_LIVE_API_KEY, token)
    ])
  return {
    testKey: {
      ...testKeyExists,
      maskedKey: testKeyExists.exists ? MASKED_KEY : ''
    },
    liveKeyPending: {
      ...liveKeyPendingExists,
      maskedKey: liveKeyPendingExists.exists ? MASKED_KEY : ''
    },
    liveKey: {
      ...liveKeyExists,
      maskedKey: liveKeyExists.exists ? MASKED_KEY : ''
    }
  }
}

/**
 * @param {string} formId
 * @param {string} secretValue
 * @param {boolean} isLive
 * @param {string} token
 */
export async function savePaymentSecret(formId, secretValue, isLive, token) {
  const key = isLive ? PAYMENT_LIVE_API_KEY_PENDING : PAYMENT_TEST_API_KEY
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
 * Makes a dummy call to Gov Pay to determine if API key is valid
 * @param {string} key
 * @param {boolean} isLiveKey
 */
export async function validateApiKey(key, isLiveKey) {
  const url = new URL('https://publicapi.payments.service.gov.uk/v1/payments')
  try {
    await getJson(url, getHeaders(key))
  } catch (err) {
    const error =
      /** @type {{ output?: { statusCode?: number }, message?: string }} */ (
        err
      )
    const statusCode = error.output?.statusCode
    if (statusCode === StatusCodes.UNAUTHORIZED) {
      // UNAUTHORIZED - API key is invalid as key used as bearer token
      throw Boom.badRequest('Invalid API key', {
        message: `The ${isLiveKey ? 'Live' : 'Test'} API key is invalid`
      })
    } else if (statusCode === StatusCodes.NOT_FOUND) {
      // NOT_FOUND - passed auth and therefore valid API key but payment not found (as expected since we're not passing a payment id)
      return true
    } else {
      throw new Error(`Error calling GovUk Pay: ${error.message}`)
    }
  }
  return false
}

/**
 * @param { ComponentType | undefined } questionType
 * @param {string} formId
 * @param {FormEditorInputQuestionDetails} payload
 * @param {string} token
 * @param {boolean} isFormLive
 * @returns {Promise<string>} possible extra message for the notification banner
 */
export async function savePaymentSecrets(
  questionType,
  formId,
  payload,
  token,
  isFormLive
) {
  if (questionType === ComponentType.PaymentField) {
    if (!payload.paymentLiveApiKey && isFormLive) {
      const message = 'Enter a live API key since this form is already live'
      throw Boom.badRequest(message, { message })
    }
    // Only save API key if it's a non-masked version
    const saveTestKey =
      payload.paymentTestApiKey !== MASKED_KEY &&
      payload.paymentTestApiKey.length
    const saveLiveKey =
      payload.paymentLiveApiKey !== MASKED_KEY &&
      payload.paymentLiveApiKey.length

    // Validate both before saving
    if (saveTestKey) {
      await validateApiKey(payload.paymentTestApiKey, false)
    }
    if (saveLiveKey) {
      await validateApiKey(payload.paymentLiveApiKey, true)
    }

    // Save
    if (saveTestKey) {
      await savePaymentSecret(formId, payload.paymentTestApiKey, false, token)
    }
    if (saveLiveKey) {
      await savePaymentSecret(formId, payload.paymentLiveApiKey, true, token)
      return '. The newly-entered live payment API key will not become active until the form is made live again.'
    }
  }
  return ''
}

/**
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 */
