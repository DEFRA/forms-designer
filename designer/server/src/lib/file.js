import config from '~/src/config.js'
import { get } from '~/src/lib/fetch.js'

const submissionEndpoint = new URL('/file/', config.submissionUrl)

/**
 * @param {string} fieldId
 */
export async function checkFileStatus(fieldId) {
  const requestUrl = new URL(`./${fieldId}`, submissionEndpoint)
  return await get(requestUrl, {})
}
