import { formAdapterSubmissionMessagePayloadSchema } from '@defra/forms-engine-plugin/engine/types/schema.js'

import { createJoiError } from '~/src/lib/error-boom-helper.js'

/**
 * @param {string} messageJson
 */
export function validateMessageJson(messageJson) {
  let json
  try {
    json = JSON.parse(messageJson)
  } catch (err) {
    const typedError = /** @type {{ message?: string }} */ (err)
    return {
      error: createJoiError(
        'messageJson',
        `Invalid JSON: ${typedError.message}`
      )
    }
  }

  /**
   * @type { FormAdapterSubmissionMessagePayload | undefined }
   */
  const messageBody = json.Body
  if (!messageBody) {
    return {
      error: createJoiError(
        'messageJson',
        'Invalid JSON: Missing "Body" element'
      )
    }
  }

  const { error } = formAdapterSubmissionMessagePayloadSchema.validate(
    messageBody,
    {
      abortEarly: false,
      stripUnknown: true
    }
  )
  if (error) {
    const errorText = error.details.map((d) => d.message).join(', ')
    const joiError = createJoiError(
      'messageJson',
      `JSON does not match the schema: ${errorText}`
    )
    return {
      error: joiError
    }
  }
  return {
    body: messageBody
  }
}

/**
 * Keep specific properties
 * @param {any} message
 * @returns {{ json: { MessageId: string, Body: any }}}
 */
export function dlqMessageMapper(message) {
  return {
    json: {
      MessageId: message.MessageId,
      Body: JSON.parse(message.Body)
    }
  }
}

/**
 * @param {any[]} messages
 * @returns {{ json: { MessageId: string, Body: any }}[]}
 */
export function dlqMessagesMapper(messages) {
  return messages.map(dlqMessageMapper)
}

/**
 * @import { FormAdapterSubmissionMessagePayload } from '@defra/forms-engine-plugin/engine/types.js'
 */
