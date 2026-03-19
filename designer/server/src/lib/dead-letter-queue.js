import { DeadLetterQueues } from '@defra/forms-model'

import config from '~/src/config.js'
import { getJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

/**
 * @param {DeadLetterQueues} dlq
 * @param {string} token
 */
export async function getDeadLetterQueueMessages(dlq, token) {
  const getJsonByType = /** @type {typeof getJson<{ messages: [] }>} */ (getJson)

  let endpoint
  let qualifier = ''
  switch (dlq) {
    case DeadLetterQueues.AuditApi:
      endpoint = config.auditUrl
      break
    case DeadLetterQueues.NotifyListener:
      endpoint = config.notifyUrl
      break
    case DeadLetterQueues.SharepointListener:
      endpoint = config.sharepointUrl
      break
    case DeadLetterQueues.SubmissionApiFormSubmissions:
      endpoint = config.submissionUrl
      qualifier = '/form-submissions'
      break
    case DeadLetterQueues.SubmissionApiSaveAndExit:
      endpoint = config.submissionUrl
      qualifier = '/save-and-exit'
      break
    default:
      endpoint = ''
  }

  if (!endpoint) {
    throw new Error('Invalid dead-letter queue')
  }

  const requestUrl = new URL(`./admin/deadletter${qualifier}/view`, endpoint)

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  return body
}
