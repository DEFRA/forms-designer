import { Engine } from '@defra/forms-model'
import Boom from '@hapi/boom'

import {
  buildDefinition,
  testFormDefinitionWithSummaryOnly
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 conditions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const testForm = buildDefinition({
    ...testFormDefinitionWithSummaryOnly,
    engine: Engine.V2
  })

  test('GET - should check correct data is rendered in the view with no conditions', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/conditions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    const $cardHeadings = container.getAllByText('All conditions')
    const $noConditionsFallbackText = container.getAllByText(
      'No conditions available to use. Create a new condition.'
    )

    expect($mainHeading).toHaveTextContent('Manage conditions')
    expect($cardHeadings[0]).toHaveTextContent('All conditions')
    expect($cardHeadings).toHaveLength(1)
    expect($noConditionsFallbackText[0]).toHaveTextContent(
      'No conditions available to use. Create a new condition.'
    )
    expect($noConditionsFallbackText).toHaveLength(1)
  })

  test('GET - should check correct data is rendered in the view with multiple V2 conditions', async () => {
    const testDefinitionWithV2Conditions = {
      ...testFormDefinitionWithSummaryOnly,
      engine: Engine.V2,
      conditions: [
        {
          id: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2',
          displayName: 'Test Condition V2',
          conditions: []
        }
      ]
    }

    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(
        /** @type {FormDefinition} */ (
          /** @type {unknown} */ (testDefinitionWithV2Conditions)
        )
      )

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/conditions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    const $cardHeadings = container.getAllByText('All conditions')

    expect($mainHeading).toHaveTextContent('Manage conditions')
    expect($cardHeadings[0]).toHaveTextContent('All conditions')

    const $rows = container.getAllByRole('row')
    expect($rows).toHaveLength(2) // header + 1 condition row
  })

  describe('POST /library/{slug}/editor-v2/page/{pageId}/conditions', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('should add condition to page and redirect to questions page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(editor.setPageCondition).mockResolvedValueOnce()

      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions',
        auth,
        payload: {
          action: 'add',
          conditionName: 'test-condition'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/test-page-id/questions'
      )
      expect(editor.setPageCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        'test-page-id',
        'test-condition'
      )
    })

    test('should remove condition from page and redirect to questions page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(editor.setPageCondition).mockResolvedValueOnce()

      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions',
        auth,
        payload: {
          action: 'remove'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/test-page-id/questions'
      )
      expect(editor.setPageCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        'test-page-id',
        null
      )
    })

    test('should redirect to question details when questionId and stateId are provided', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(editor.setPageCondition).mockResolvedValueOnce()

      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions?questionId=test-question-id&stateId=test-state-id',
        auth,
        payload: {
          action: 'add',
          conditionName: 'test-condition'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/test-page-id/question/test-question-id/details/test-state-id#tab-conditions'
      )
    })

    test('should handle error from setPageCondition and redirect with error', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      const boomError = Boom.badRequest('Test error')
      jest.mocked(editor.setPageCondition).mockRejectedValueOnce(boomError)

      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions',
        auth,
        payload: {
          action: 'add',
          conditionName: 'test-condition'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(typeof response.headers.location).toBe('string')
      expect(editor.setPageCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        'test-page-id',
        'test-condition'
      )
    })

    test('should redirect with returnUrl when provided in error case', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      const boomError = Boom.badRequest('Test error')
      jest.mocked(editor.setPageCondition).mockRejectedValueOnce(boomError)

      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions?returnUrl=/custom-return-url',
        auth,
        payload: {
          action: 'add',
          conditionName: 'test-condition'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(typeof response.headers.location).toBe('string')
      expect(editor.setPageCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        'test-page-id',
        'test-condition'
      )
    })

    test('should handle validation failure for missing conditionName on add action', async () => {
      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions',
        auth,
        payload: {
          action: 'add'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/test-page-id/questions'
      )
      expect(editor.setPageCondition).not.toHaveBeenCalled()
    })

    test('should handle validation failure and redirect to question details when questionId and stateId provided', async () => {
      const options = {
        method: 'POST',
        url: '/library/my-form-slug/editor-v2/page/test-page-id/conditions?questionId=test-question-id&stateId=test-state-id',
        auth,
        payload: {
          action: 'add'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/test-page-id/question/test-question-id/details/test-state-id#tab-conditions'
      )
      expect(editor.setPageCondition).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { FormDefinition } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
