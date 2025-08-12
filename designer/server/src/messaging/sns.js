import { SNSClient } from '@aws-sdk/client-sns'

import config from '~/src/config.js'

const awsRegion = config.awsRegion
const snsEndpoint = config.snsEndpoint

/**
 * Retrieves an SNS client
 * @returns {SNSClient}
 */
export function getSNSClient() {
  return new SNSClient({
    region: awsRegion,
    endpoint: snsEndpoint
  })
}
