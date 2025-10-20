import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { testFormDefinitionWithMultipleV2Conditions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/lib/list.js')

describe('Editor v2 question details condition routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const simpleSessionTextField = {
    questionType: ComponentType.TextField
  }

  test('POST - should error when condition attached and changing question type to a non-condition type', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithMultipleV2Conditions)
    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/449c053b-9201-4312-9a75-187ac1b720eb/question/154271c2-79a2-4b59-b535-d210a13dbfe9/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'UkAddressField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/449c053b-9201-4312-9a75-187ac1b720eb/question/154271c2-79a2-4b59-b535-d210a13dbfe9/details#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'New question type does not support conditions. Either remove the condition or select a question type that supports conditions.',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
