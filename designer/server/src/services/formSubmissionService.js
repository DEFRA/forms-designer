import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'

const submissionUrl = config.submissionUrl

/**
 * Generate and sends a submissions Excel file for this form
 * @param {string} formId - the form id
 */
export async function sendSubmissionsFile(formId) {
  const postJsonByType = /** @type {typeof postJson<{ fileId: string }>} */ (
    postJson
  )
  const result = await postJsonByType(
    new URL(`/submissions/${formId}`, submissionUrl)
  )

  return result.body
}
