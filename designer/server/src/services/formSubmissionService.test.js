import config from '~/src/config.js'
import { postJson } from '~/src/lib/fetch.js'
import {
  sendFeedbackSubmissionsFile,
  sendFormSubmissionsFile
} from '~/src/services/formSubmissionService.js'

const submissionUrl = config.submissionUrl

jest.mock('~/src/lib/fetch.js')

describe('formSubmissionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendFormSubmissionsFile', () => {
    it('should make a call to the submission service - submissions enpoint', async () => {
      const formId = '296701a7-1076-40df-8378-4b6468993fad'
      const fileId = '303f24b1-d486-4fa0-8bd3-ece8839c45b3'
      const token = 'my-token'
      const response = /** @type {IncomingMessage} */ ({})

      jest.mocked(postJson).mockResolvedValue({
        response,
        body: { fileId }
      })

      const result = await sendFormSubmissionsFile(formId, token)

      expect(jest.mocked(postJson)).toHaveBeenCalledWith(
        new URL(`/submissions/${formId}`, submissionUrl),
        { headers: { Authorization: `Bearer ${token}` } }
      )
      expect(result).toEqual({ fileId })
    })
  })

  it('should make a call to the submission service - feedback enpoint', async () => {
    const formId = '296701a7-1076-40df-8378-4b6468993fad'
    const fileId = '303f24b1-d486-4fa0-8bd3-ece8839c45b3'
    const token = 'my-token'
    const response = /** @type {IncomingMessage} */ ({})

    jest.mocked(postJson).mockResolvedValue({
      response,
      body: { fileId }
    })

    const result = await sendFeedbackSubmissionsFile(formId, token)

    expect(jest.mocked(postJson)).toHaveBeenCalledWith(
      new URL(`/feedback/${formId}`, submissionUrl),
      { headers: { Authorization: `Bearer ${token}` } }
    )
    expect(result).toEqual({ fileId })
  })
})

/**
 * @import { IncomingMessage } from 'http'
 */
