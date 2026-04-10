import { DeadLetterQueues } from '@defra/forms-model'

import config from '~/src/config.js'
import { delJson, getJson, postJson } from '~/src/lib/fetch.js'
import { getHeaders } from '~/src/lib/utils.js'

/**
 * @param {DeadLetterQueues} dlq
 */
export function getEndpoint(dlq) {
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
    case DeadLetterQueues.SubmissionsApiFormSubmissions:
      endpoint = config.submissionUrl
      qualifier = '/form-submissions'
      break
    case DeadLetterQueues.SubmissionsApiSaveAndExit:
      endpoint = config.submissionUrl
      qualifier = '/save-and-exit'
      break
    default:
      endpoint = ''
  }

  if (!endpoint) {
    throw new Error('Invalid dead-letter queue')
  }

  return {
    endpoint,
    qualifier
  }
}

/**
 * @param {DeadLetterQueues} dlq
 * @param {string} token
 */
export async function getDeadLetterQueueMessages(dlq, token) {
  const getJsonByType = /** @type {typeof getJson<{ messages: any[] }>} */ (
    getJson
  )

  const { endpoint, qualifier } = getEndpoint(dlq)

  const requestUrl = new URL(`./admin/deadletter${qualifier}/view`, endpoint)

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  // Dedupe in case of duplicate messages
  // Ensure the last occurrence of the same MessageId is used as this will contain the valid ReceiptHandle
  // (older ReceiptHandles for the same message will not be valid)
  const uniqueMessages = new Map()
  for (const message of body.messages) {
    uniqueMessages.set(message.MessageId, message)
  }
  return uniqueMessages.values().toArray()
}

/**
 * @param {DeadLetterQueues} dlq
 * @param {string} token
 */
export async function redriveDeadLetterQueueMessages(dlq, token) {
  const postJsonByType = /** @type {typeof getJson<{ message: string }>} */ (
    postJson
  )

  const { endpoint, qualifier } = getEndpoint(dlq)

  const requestUrl = new URL(`./admin/deadletter${qualifier}/redrive`, endpoint)

  const { body } = await postJsonByType(requestUrl, getHeaders(token))

  if (body.message !== 'success') {
    throw new Error(`Error when redriving messages for ${dlq}: ${body.message}`)
  }
}

/**
 * @param {DeadLetterQueues} dlq
 * @param {string} receiptHandle
 * @param {string} messageId
 * @param {string} token
 */
export async function deleteDeadLetterQueueMessage(
  dlq,
  receiptHandle,
  messageId,
  token
) {
  const delJsonByType = /** @type {typeof delJson<{ message: string }>} */ (
    delJson
  )

  const { endpoint, qualifier } = getEndpoint(dlq)

  const requestUrl = new URL(
    `./admin/deadletter${qualifier}/${messageId}`,
    endpoint
  )

  const { body } = await delJsonByType(requestUrl, {
    payload: { receiptHandle },
    ...getHeaders(token)
  })

  if (body.message !== 'success') {
    throw new Error(
      `Error when deleting message ${messageId} for ${dlq}: ${body.message}`
    )
  }
}
