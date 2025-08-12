import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { buildFormCreatedMessage } from '@defra/forms-model/stubs'
import { mockClient } from 'aws-sdk-client-mock'

import config from '~/src/config.js'
import 'aws-sdk-client-mock-jest'
import { publishEvent } from '~/src/messaging/publish-base.js'

const snsTopicArn =
  'arn:aws:sns:eu-west-2:000000000000:forms_authentication_events'
jest.mock('~/src/config.ts')

jest.mock('~/src/common/helpers/logging/logger.js', () => ({
  createLogger: jest.fn().mockImplementation(() => {
    return {
      info: jest.fn()
    }
  })
}))

describe('publish-base', () => {
  const snsMock = mockClient(SNSClient)

  afterEach(() => {
    snsMock.reset()
  })

  describe('publishEvent', () => {
    const message = buildFormCreatedMessage()
    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should publish', async () => {
      jest.mocked(config).snsTopicArn = snsTopicArn
      snsMock.on(PublishCommand).resolves({
        MessageId: '00000000-0000-0000-0000-000000000000'
      })

      await publishEvent(message)
      expect(snsMock).toHaveReceivedCommandWith(PublishCommand, {
        TopicArn: snsTopicArn,
        Message: JSON.stringify(message)
      })
    })
  })
})
