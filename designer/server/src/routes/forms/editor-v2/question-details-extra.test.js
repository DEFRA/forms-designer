import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSinglePage } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')

describe('Editor v2 question details routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  test('GET - should redirect when enhanced action is delete', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1/details/sessId?action=delete&id=12345',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(
      headers.location?.startsWith(
        '/library/my-form-slug/editor-v2/page/p1/question/c1/details/'
      )
    ).toBeTruthy()
    expect(headers.location?.endsWith('#list-items')).toBeFalsy()
  })

  test('POST - should redirect to GET if enhanced action', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue({ questionType: ComponentType.RadiosField, editRow: {} })

    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/123456/question/456/details/sessId',
      auth,
      payload: {
        enhancedAction: 'add-item',
        name: '456',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'RadiosField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/123456/question/456/details/sessId#add-option'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
