import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'
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
