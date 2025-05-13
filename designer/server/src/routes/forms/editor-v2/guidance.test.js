import { ApiErrorCode, ControllerType, Engine } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  buildDefinition,
  testFormDefinitionWithAGuidancePage
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { buildBoom409 } from '~/src/lib/__stubs__/editor.js'
import { addPageAndFirstQuestion, setPageSettings } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { addOrUpdateGuidance } from '~/src/routes/forms/editor-v2/guidance.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')

describe('Editor v2 guidance routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const testForm = buildDefinition({
    ...testFormDefinitionWithAGuidancePage,
    engine: Engine.V2
  })

  test('GET - should render new page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/guidance/c1',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeadings = container.getAllByRole('heading', { level: 1 })

    const $actions = container.getAllByRole('button')

    expect($mainHeadings[0]).toHaveTextContent('Test form')
    expect($mainHeadings[1]).toHaveTextContent('Edit guidance page')
    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save')
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/guidance/new',
      auth,
      payload: {}
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/guidance/new'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Enter a page heading. Enter guidance text',
        [],
        undefined
      ),
      'guidanceValidationFailure'
    )
  })

  test('POST - should error if duplicate page path', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
    jest.mocked(setPageSettings).mockImplementationOnce(() => {
      throw buildBoom409(
        'Duplicate page path',
        ApiErrorCode.DuplicatePagePathPage
      )
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/guidance/new',
      auth,
      payload: {
        pageHeading: 'page one',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/guidance/new'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Page heading already exists in this form',
        [],
        undefined
      ),
      'guidanceValidationFailure'
    )
  })

  test('POST - should error if other boom error', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
    jest.mocked(setPageSettings).mockImplementationOnce(() => {
      throw buildBoom409('Other boom error')
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/guidance/new',
      auth,
      payload: {
        pageHeading: 'page one',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/guidance/new'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError('Other boom error', [], undefined),
      'guidanceValidationFailure'
    )
  })

  test('POST - should throw if not a boom error', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
    jest.mocked(setPageSettings).mockImplementationOnce(() => {
      throw Error('Other error')
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/guidance/new',
      auth,
      payload: {
        pageHeading: 'page one',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('POST - should save new guidance and redirect to same page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(addPageAndFirstQuestion).mockResolvedValue({
      path: '/page-one',
      controller: ControllerType.Page,
      title: '',
      next: [],
      id: 'newP1',
      components: [
        /** @type {ComponentDef} */ ({
          id: 'newCompId'
        })
      ]
    })
    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/new/guidance/new',
      auth,
      payload: {
        pageHeading: 'New page heading',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/newP1/guidance/newCompId'
    )
    expect(addPageAndFirstQuestion).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      {
        content: 'New guidance text',
        type: 'Markdown',
        options: {},
        schema: {}
      },
      {
        title: 'New page heading'
      }
    )
    expect(setPageSettings).not.toHaveBeenCalled()
  })

  test('POST - should save existing guidance and redirect to same page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(addPageAndFirstQuestion).mockResolvedValue({
      path: '/page-one',
      controller: ControllerType.Page,
      title: '',
      next: [],
      id: 'p1',
      components: [
        /** @type {ComponentDef} */ ({
          id: 'c1'
        })
      ]
    })
    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/guidance/c1',
      auth,
      payload: {
        pageHeading: 'New page heading',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/guidance/c1'
    )
    expect(setPageSettings).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      undefined,
      {
        guidanceText: 'New guidance text',
        pageHeading: 'New page heading',
        pageHeadingAndGuidance: 'true'
      }
    )
    expect(addPageAndFirstQuestion).not.toHaveBeenCalled()
  })

  test('should handle route if add page/question returns bad results', async () => {
    jest.mocked(addPageAndFirstQuestion).mockResolvedValue({
      path: '/page-one',
      controller: ControllerType.Page,
      title: '',
      next: [],
      id: undefined,
      components: [
        /** @type {ComponentDef} */ ({
          id: undefined
        })
      ]
    })
    const res = await addOrUpdateGuidance(
      '661e4ca5039739ef2902b214',
      'token',
      'new',
      'c1',
      testFormDefinitionWithAGuidancePage,
      {
        pageHeading: 'Page heading 1',
        guidanceText: 'Guidnce 1'
      }
    )
    expect(res).toEqual({
      finalPageId: 'unknown',
      finalQuestionId: 'unknown'
    })
  })
})

/**
 * @import { ComponentDef } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
