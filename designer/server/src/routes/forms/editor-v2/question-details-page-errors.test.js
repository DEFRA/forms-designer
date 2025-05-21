import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithOneQuestionNoPageTitle } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/lib/list.js')
jest.mock('~/src/routes/forms/editor-v2/question-details-helper.js', () => ({
  handleEnhancedActionOnGet: jest.fn(),
  handleEnhancedActionOnPost: jest.fn(),
  enforceFileUploadFieldExclusivity: jest.fn((payload) => payload)
}))

describe('Editor v2 question details routes', () => {
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

  test('GET - should redirect to page title error if no page title', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValue(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValue(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/new/details',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
  })

  test('POST - should error if no page title', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.get).mockResolvedValue(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValue(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/questions'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
