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
 * @param {{ visibilityTimeout: number | undefined, waitTimeSeconds: number | undefined}} [options]
 */
export async function getDeadLetterQueueMessages(dlq, token, options) {
  const getJsonByType = /** @type {typeof getJson<{ messages: any[] }>} */ (
    getJson
  )

  const { endpoint, qualifier } = getEndpoint(dlq)

  const queryParams = []
  if (options?.visibilityTimeout) {
    queryParams.push(`visibilityTimeout=${options.visibilityTimeout}`)
  }
  if (options?.waitTimeSeconds) {
    queryParams.push(`waitTimeSeconds=${options.waitTimeSeconds}`)
  }
  const queryParamStr = queryParams.length ? `?${queryParams.join('&')}` : ''

  const requestUrl = new URL(
    `./admin/deadletter${qualifier}/view${queryParamStr}`,
    endpoint
  )

  const { body } = await getJsonByType(requestUrl, getHeaders(token))

  // Dedupe in case of duplicate messages
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
 * @param {string} messageId
 * @param {string} token
 */
export async function deleteDeadLetterQueueMessage(dlq, messageId, token) {
  const delJsonByType = /** @type {typeof delJson<{ message: string }>} */ (
    delJson
  )

  const { endpoint, qualifier } = getEndpoint(dlq)

  const requestUrl = new URL(
    `./admin/deadletter${qualifier}/${messageId}`,
    endpoint
  )

  const { body } = await delJsonByType(requestUrl, getHeaders(token))

  if (body.message !== 'success') {
    throw new Error(
      `Error when deleting message ${messageId} for ${dlq}: ${body.message}`
    )
  }
}

/**
 * @param {DeadLetterQueues} dlq
 * @param {string} messageId
 * @param { FormAdapterSubmissionMessagePayload | undefined } messageJson
 * @param {string} token
 */
export async function resubmitDeadLetterQueueMessage(
  dlq,
  messageId,
  messageJson,
  token
) {
  const postJsonByType = /** @type {typeof delJson<{ message: string }>} */ (
    postJson
  )

  const { endpoint, qualifier } = getEndpoint(dlq)

  const requestUrl = new URL(
    `./admin/deadletter${qualifier}/resubmit/${messageId}`,
    endpoint
  )

  const { body } = await postJsonByType(requestUrl, {
    payload: {
      messageJson
    },
    ...getHeaders(token)
  })

  if (body.message !== 'success') {
    throw new Error(
      `Error when resubmitting message ${messageId} for ${dlq}: ${body.message}`
    )
  }
}

/**
 * @import { FormAdapterSubmissionMessagePayload } from '@defra/forms-engine-plugin/engine/types.js'
 */
