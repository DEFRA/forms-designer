import { DeadLetterQueues } from '@defra/forms-model'

import {
  getDeadLetterQueueMessages,
  getEndpoint,
  redriveDeadLetterQueueMessages
} from '~/src/lib/dead-letter-queue.js'
import { getJson, postJson } from '~/src/lib/fetch.js'

jest.mock('~/src/lib/fetch.js')

describe('dead-letter queue lib functions', () => {
  describe('getEndpoint', () => {
    it('should construct the correct endpoint', () => {
      expect(getEndpoint(DeadLetterQueues.AuditApi)).toEqual({
        endpoint: 'http://localhost:3003',
        qualifier: ''
      })
      expect(getEndpoint(DeadLetterQueues.NotifyListener)).toEqual({
        endpoint: 'http://localhost:3004',
        qualifier: ''
      })
      expect(getEndpoint(DeadLetterQueues.SharepointListener)).toEqual({
        endpoint: 'http://localhost:3007',
        qualifier: ''
      })
      expect(
        getEndpoint(DeadLetterQueues.SubmissionsApiFormSubmissions)
      ).toEqual({
        endpoint: 'http://localhost:3002',
        qualifier: '/form-submissions'
      })
      expect(getEndpoint(DeadLetterQueues.SubmissionsApiSaveAndExit)).toEqual({
        endpoint: 'http://localhost:3002',
        qualifier: '/save-and-exit'
      })
    })

    it('should throw if invalid queue selection', () => {
      // @ts-expect-error - invalid queue name, not in enum
      expect(() => getEndpoint('invalid-queue-name')).toThrow(
        'Invalid dead-letter queue'
      )
    })
  })

  describe('getDeadLetterQueueMessages', () => {
    it('should call endpoint', async () => {
      jest
        .mocked(getJson)
        // @ts-expect-error - partial mock of response
        .mockResolvedValueOnce({ body: { messages: ['message1'] } })
      const dlq = DeadLetterQueues.SubmissionsApiFormSubmissions
      const res = await getDeadLetterQueueMessages(dlq, 'token')
      expect(getJson).toHaveBeenCalledWith(
        new URL('http://localhost:3002/admin/deadletter/form-submissions/view'),
        expect.anything()
      )
      expect(res.messages).toEqual(['message1'])
    })
  })

  describe('redriveDeadLetterQueueMessages', () => {
    it('should call endpoint', async () => {
      jest
        .mocked(postJson)
        // @ts-expect-error - partial mock of response
        .mockResolvedValueOnce({ body: { message: 'success' } })
      const dlq = DeadLetterQueues.AuditApi
      await redriveDeadLetterQueueMessages(dlq, 'token')
      expect(postJson).toHaveBeenCalledWith(
        new URL('http://localhost:3004/admin/deadletter/redrive'),
        expect.anything()
      )
    })
  })
})
