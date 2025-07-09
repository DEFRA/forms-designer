import {
  ConditionType,
  Engine,
  FormDefinitionError,
  FormDefinitionErrorType,
  OperatorName
} from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'
import Boom from '@hapi/boom'

import {
  testFormDefinitionWithMultipleV2Conditions,
  testFormDefinitionWithSummaryOnly
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  createConditionSessionState,
  getConditionSessionState
} from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')

describe('Editor v2 conditions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testForm = buildDefinition({
    ...testFormDefinitionWithSummaryOnly,
    engine: Engine.V2
  })

  const pageId = 'farm-details-page'
  const conditionId = 'cattle-farm-condition'
  const componentId = 'farm-type-field'

  /** @type {ConditionWrapperV2} */
  const mockCondition = {
    id: conditionId,
    displayName: 'Show if cattle farming',
    items: [
      {
        id: 'cattle-farm-check',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'cattle'
      }
    ]
  }

  const testComponent = buildTextFieldComponent({
    id: componentId,
    name: 'farmType',
    title: 'What type of farming do you do?'
  })

  const testFormWithPage = buildDefinition({
    name: 'testFormWithPage',
    pages: [
      buildQuestionPage({
        id: pageId,
        title: 'Farm Details',
        components: [testComponent]
      }),
      buildSummaryPage()
    ],
    conditions: [mockCondition],
    engine: Engine.V2
  })

  const testFormWithPageAndCondition = buildDefinition({
    name: 'testFormWithPageAndCondition',
    pages: [
      buildQuestionPage({
        id: pageId,
        title: 'Farm Details',
        condition: conditionId,
        components: [testComponent]
      }),
      buildSummaryPage()
    ],
    conditions: [mockCondition],
    engine: Engine.V2
  })

  describe('conditions management routes', () => {
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
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithMultipleV2Conditions)

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
      expect($rows).toHaveLength(4)
    })
  })

  describe('page conditions routes', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.mocked(getConditionSessionState).mockReturnValue({
        stateId: 'state-id'
      })
    })

    describe('GET /library/{slug}/editor-v2/page/{pageId}/conditions', () => {
      test('should create session and forward', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(createConditionSessionState).mockReturnValue('state-id')
        const options = {
          method: 'get',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions`,
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions/new/state-id`
        )
        expect(createConditionSessionState).toHaveBeenCalled()
      })
    })

    describe('GET /library/{slug}/editor-v2/page/{pageId}/conditions/{conditionId}/{stateId}', () => {
      test('should create session and rerun (if session invalid)', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(createConditionSessionState).mockReturnValue('state-id')
        const options = {
          method: 'get',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/`,
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/state-id`
        )
        expect(createConditionSessionState).toHaveBeenCalled()
      })

      test('should render page conditions view with no existing condition', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(testFormWithPage)

        const options = {
          method: 'get',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/new/state-id`,
          auth
        }

        const { container } = await renderResponse(server, options)

        const $mainHeading = container.getByRole('heading', { level: 1 })
        const $conditionsSelect = container.getByLabelText(
          'Select an existing condition'
        )

        expect($mainHeading).toHaveTextContent('Test form')
        expect($conditionsSelect).toBeInTheDocument()
        expect(/** @type {HTMLSelectElement} */ ($conditionsSelect).value).toBe(
          ''
        )
      })

      test('should render page conditions view with existing condition applied', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(testFormWithPageAndCondition)

        const options = {
          method: 'get',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/state-id`,
          auth
        }

        const { container } = await renderResponse(server, options)

        const $mainHeading = container.getByRole('heading', { level: 1 })
        const $conditionDisplay = container.getByText('Show if cattle farming')
        const $removeLink = container.getByRole('link', {
          name: 'Remove'
        })

        expect($removeLink).toBeInTheDocument()
        expect($mainHeading).toHaveTextContent('Test form')
        expect($conditionDisplay).toBeInTheDocument()
      })
    })

    describe('POST /library/{slug}/editor-v2/page/{pageId}/conditions/{conditionId}/{stateId}', () => {
      test('should successfully set page condition in state and redisplay page', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(editor.setPageCondition).mockResolvedValueOnce(undefined)
        jest.mocked(editor.addCondition).mockResolvedValueOnce({
          id: conditionId,
          status: 'created',
          condition: /** @type {ConditionWrapperV2} */ ({})
        })
        const conditionIdGuid = '5865188f-c381-49a1-97ac-246c27eef3b2'

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/state-id`,
          payload: {
            displayName: 'My cond1',
            'items[0][id]': conditionIdGuid,
            'items[0][componentId]': componentId,
            'items[0][operator]': OperatorName.Is,
            'items[0][type]': ConditionType.StringValue,
            'items[0][value]': 'cattle'
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions`
        )
        expect(editor.setPageCondition).toHaveBeenCalledWith(
          testFormMetadata.id,
          auth.credentials.token,
          pageId,
          conditionId
        )
      })

      test('should handle invalid form definition error', async () => {
        const cause = [
          {
            id: FormDefinitionError.UniqueConditionDisplayName,
            detail: { path: ['conditions', 1], pos: 1, dupePos: 0 },
            message: '"conditions[1]" contains a duplicate value',
            type: FormDefinitionErrorType.Unique
          }
        ]

        const boomErr = Boom.boomify(
          new Error('"conditions[1]" contains a duplicate value', { cause }),
          {
            data: { error: 'InvalidFormDefinitionError' }
          }
        )

        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(editor.setPageCondition).mockRejectedValueOnce(boomErr)
        jest.mocked(editor.addCondition).mockResolvedValueOnce({
          id: conditionId,
          status: 'created',
          condition: /** @type {ConditionWrapperV2} */ ({})
        })
        const conditionIdGuid = '5865188f-c381-49a1-97ac-246c27eef3b2'

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/state-id`,
          payload: {
            displayName: 'My cond1',
            'items[0][id]': conditionIdGuid,
            'items[0][componentId]': componentId,
            'items[0][operator]': OperatorName.Is,
            'items[0][type]': ConditionType.StringValue,
            'items[0][value]': 'cattle'
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions/cattle-farm-condition/state-id#`
        )
      })

      test('should shows errors and redisplay page for invalid payload', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(editor.addCondition).mockResolvedValueOnce({
          id: conditionId,
          status: 'created',
          condition: /** @type {ConditionWrapperV2} */ ({})
        })

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/state-id`,
          payload: {
            displayName: 'My cond1'
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions/${conditionId}/state-id`
        )
        expect(editor.setPageCondition).not.toHaveBeenCalled()
      })
    })

    describe('POST /library/{slug}/editor-v2/page/{pageId}/conditions/assign', () => {
      test('should successfully add condition to page', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(editor.setPageCondition).mockResolvedValueOnce(undefined)

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/assign`,
          payload: {
            action: 'add',
            conditionName: conditionId
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions`
        )
        expect(editor.setPageCondition).toHaveBeenCalledWith(
          testFormMetadata.id,
          auth.credentials.token,
          pageId,
          conditionId
        )
      })

      test('should successfully remove condition from page', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest.mocked(editor.setPageCondition).mockResolvedValueOnce(undefined)

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/assign`,
          payload: {
            action: 'remove'
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions`
        )
        expect(editor.setPageCondition).toHaveBeenCalledWith(
          testFormMetadata.id,
          auth.credentials.token,
          pageId,
          null
        )
      })

      test('should handle validation error for missing condition when adding', async () => {
        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/assign`,
          payload: {
            action: 'add'
            // Missing conditionName
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions`
        )
        // Should not call setPageCondition due to validation failure
        expect(editor.setPageCondition).not.toHaveBeenCalled()
      })

      test('should handle server error when setting page condition', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(editor.setPageCondition)
          .mockRejectedValueOnce(Boom.badRequest('Invalid condition'))

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/assign`,
          payload: {
            action: 'add',
            conditionName: conditionId
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions`
        )
        expect(editor.setPageCondition).toHaveBeenCalledWith(
          testFormMetadata.id,
          auth.credentials.token,
          pageId,
          conditionId
        )
      })

      test('should handle non-boom server error with 500 response', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(editor.setPageCondition)
          .mockRejectedValueOnce(new Error('Database connection failed'))

        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/assign`,
          payload: {
            action: 'add',
            conditionName: conditionId
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(500)
        expect(response.result).toContain(
          'Sorry, there is a problem with the service'
        )
        expect(editor.setPageCondition).toHaveBeenCalledWith(
          testFormMetadata.id,
          auth.credentials.token,
          pageId,
          conditionId
        )
      })

      test('should validate payload schema correctly', async () => {
        const options = {
          method: 'post',
          url: `/library/my-form-slug/editor-v2/page/${pageId}/conditions/assign`,
          payload: {
            action: 'invalid-action'
          },
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(303)
        expect(response.headers.location).toBe(
          `/library/my-form-slug/editor-v2/page/${pageId}/conditions`
        )
        expect(editor.setPageCondition).not.toHaveBeenCalled()
      })
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
