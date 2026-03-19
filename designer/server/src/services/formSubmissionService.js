import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

const submissionUrl = config.submissionUrl

/**
 * Generate and sends a submissions Excel file for this form
 * @param {string} formId - the form id
 * @param {string} token - the user token
 */
export async function sendFormSubmissionsFile(formId, token) {
  const postJsonByType = /** @type {typeof postJson<{ message: string }>} */ (
    postJson
  )
  const result = await postJsonByType(
    new URL(`/submissions/${formId}`, submissionUrl),
    getHeaders(token)
  )

  return result.body
}

/**
 * Generate and sends a submissions Excel file for this form
 * @param { string | undefined } formId - the form id
 * @param {string} token - the user token
 */
export async function sendFeedbackSubmissionsFile(formId, token) {
  const postJsonByType = /** @type {typeof postJson<{ message: string }>} */ (
    postJson
  )
  const result = await postJsonByType(
    new URL(`/feedback/${formId ?? ''}`, submissionUrl),
    getHeaders(token)
  )

  return result.body
}

/**
 * Resets a save and exit record
 * @param { string } magicLinkId - the magic link id
 * @param {string} token - the user token
 */
export async function resetSaveAndExitRecord(magicLinkId, token) {
  const postJsonByType =
    /** @type {typeof postJson<{ recordFound: boolean, recordUpdated: boolean }>} */ (
      postJson
    )
  const result = await postJsonByType(
    new URL(`/save-and-exit/reset/${magicLinkId}`, submissionUrl),
    getHeaders(token)
  )

  return result.body
}

/**
 * Gets a submission record
 * @param { string } referenceNumber - the submission reference number
 * @param {string} token - the user token
 */
export async function getSubmissionRecord(referenceNumber, token) {
  const getJsonByType =
    /** @type {typeof getJson<FormSubmissionDocument>} */ (
      getJson
    )
  const result = await getJsonByType(
    new URL(`/submission/${referenceNumber}`, submissionUrl),
    getHeaders(token)
  )

  return result.body
}

/**
 * @import { FormAdapterSubmissionMessagePayload } from '@defra/forms-engine-plugin/engine/types.js'
 */

/**
 * @typedef {FormAdapterSubmissionMessagePayload & { recordCreatedAt: Date, expireAt: Date }} FormSubmissionDocument
 */
