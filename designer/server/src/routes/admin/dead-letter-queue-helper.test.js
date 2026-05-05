import { formAdapterSubmissionMessagePayloadSchema } from '@defra/forms-engine-plugin/types'
import {
  DeadLetterQueues,
  messageSchema,
  submissionMessageSchema
} from '@defra/forms-model'

import { getCorrectMessageSchema } from '~/src/routes/admin/dead-letter-queue-helper.js'

describe('dead-letter-queue-helper', () => {
  describe('getCorrectMessageSchema', () => {
    it('should give correct schema', () => {
      expect(
        getCorrectMessageSchema(DeadLetterQueues.AuditApi.toString())
      ).toEqual(messageSchema)
      expect(
        getCorrectMessageSchema(
          DeadLetterQueues.SubmissionsApiFormSubmissions.toString()
        )
      ).toEqual(submissionMessageSchema)
      expect(
        getCorrectMessageSchema(
          DeadLetterQueues.SubmissionsApiSaveAndExit.toString()
        )
      ).toEqual(submissionMessageSchema)
      expect(
        getCorrectMessageSchema(DeadLetterQueues.SharepointListener.toString())
      ).toEqual(formAdapterSubmissionMessagePayloadSchema)
      expect(
        getCorrectMessageSchema(DeadLetterQueues.NotifyListener.toString())
      ).toEqual(formAdapterSubmissionMessagePayloadSchema)
    })
  })
})
