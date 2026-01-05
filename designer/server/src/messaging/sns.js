import { SNSClient } from '@aws-sdk/client-sns'

import { createLogger } from '~/src/common/helpers/logging/logger.js'
import config from '~/src/config.js'

const awsRegion = config.awsRegion
const snsEndpoint = config.snsEndpoint

const logger = createLogger()

/**
 * Retrieves an SNS client
 * @returns {SNSClient}
 */
export function getSNSClient() {
  logger.info(`SNSClient awsRegion ${awsRegion}`)
  logger.info(`SNSClient snsEndpoint ${snsEndpoint}`)
  return new SNSClient({
    region: awsRegion,
    endpoint: snsEndpoint
  })
}
