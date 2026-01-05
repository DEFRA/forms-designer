import { PublishCommand } from '@aws-sdk/client-sns'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'
import { getSNSClient } from '~/src/messaging/sns.js'

const logger = createLogger()

const snsTopicArn = config.snsTopicArn

const client = getSNSClient()

/**
 * Publish event onto topic
 * @param {AuditMessage} message
 */
export async function publishEvent(message) {
  const command = new PublishCommand({
    TopicArn: snsTopicArn,
    Message: JSON.stringify(message)
  })

  const result = await client.send(command)

  logger.info(
    `Published ${message.type} event for formId ${message.entityId}. MessageId: ${result.MessageId}`
  )

  return result
}

/**
 * @import { AuditMessage } from '@defra/forms-model'
 */
