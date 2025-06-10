import { ConditionType, Engine, OperatorName } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addCondition, updateCondition } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import {
  createConditionSessionState,
  getConditionSessionState,
  setConditionSessionState
} from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/session-helper.js')

describe('Editor v2 condition routes', () => {
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

  describe('GET condition routes', () => {
    test('should create new session if no exists', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
      jest.mocked(getConditionSessionState).mockReturnValue(undefined)
      jest.mocked(createConditionSessionState).mockReturnValue('123456')

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/new/session-id',
        auth
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/condition/new/123456'
      )
    })

    test('should render content correctly with a new condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
      jest
        .mocked(getConditionSessionState)
        .mockReturnValue({ stateId: 'session-id' })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/new/session-id',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $cardHeadings = container.getAllByText('Manage conditions')

      expect($mainHeading).toHaveTextContent('Manage conditions')
      expect($cardHeadings[0]).toHaveTextContent('Test form Manage conditions')
      expect($cardHeadings).toHaveLength(1)

      const $actionHeading = container.getByText('Create new condition')
      expect($actionHeading).toBeInTheDocument()

      const $selectLists = container.getAllByRole('combobox')
      expect($selectLists).toHaveLength(1)
    })

    test('should render content correctly with an existing condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
      jest
        .mocked(getConditionSessionState)
        .mockReturnValue({ stateId: 'session-id' })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/new/session-id',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $cardHeadings = container.getAllByText('Manage conditions')

      expect($mainHeading).toHaveTextContent('Manage conditions')
      expect($cardHeadings[0]).toHaveTextContent('Test form Manage conditions')
      expect($cardHeadings).toHaveLength(1)

      const $actionHeading = container.getByText('Create new condition')
      expect($actionHeading).toBeInTheDocument()

      const $selectLists = container.getAllByRole('combobox')
      expect($selectLists).toHaveLength(1)
    })
  })

  describe('POST condition routes', () => {
    test('POST - should error on main save if missing mandatory fields', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(getConditionSessionState)
        .mockReturnValue({ stateId: 'session-id' })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond-id/session-id',
        auth,
        payload: {}
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/condition/cond-id/session-id'
      )
      expect(setConditionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        'session-id',
        {
          conditionWrapper: {
            coordinator: undefined,
            displayName: undefined,
            items: []
          },
          stateId: 'session-id'
        }
      )
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError(
          'Choose how you want to combine conditions',
          [],
          undefined
        ),
        'pageValidationFailure'
      )
    })

    test('POST - should show multiple errors on main save if missing mandatory fields for multiple conditions', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(getConditionSessionState).mockReturnValue({
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          displayName: '',
          items: [
            {
              id: '1',
              componentId: '',
              operator: OperatorName.Is,
              value: { type: ConditionType.StringValue, value: '' }
            }
          ]
        }
      })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond-id/session-id',
        auth,
        payload: {
          'items[0].id': '1',
          'items[0].componentId': '',
          'items[0].operator': OperatorName.Is,
          'items[0].value': { type: ConditionType.StringValue, value: '' }
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/condition/cond-id/session-id'
      )
      expect(setConditionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        'session-id',
        {
          conditionWrapper: {
            coordinator: undefined,
            displayName: undefined,
            id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
            items: ['1', '', 'is', { type: 'StringValue', value: '' }]
          },
          stateId: 'session-id'
        }
      )
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        new Joi.ValidationError(
          'items[0] must be of type object. items[1] must be of type object. items[2] must be of type object. Select a question. Enter a condition value. items[3].type is not allowed. Choose how you want to combine conditions',
          [],
          undefined
        ),
        'pageValidationFailure'
      )
    })

    test('POST - should handle valid final POST for update condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(getConditionSessionState).mockReturnValue({
        id: '88389bae-b6e5-4781-8d07-970809064726',
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          displayName: '',
          items: []
        }
      })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/317507f2-9ab3-4b9b-b9f2-0be678b22c3f/session-id',
        auth,
        payload: {
          'items[0].[id]': 'd16363fc-9d53-41a1-a49c-427ca9f49f8f',
          'items[0].[componentId]': 'e890bd3f-f7f8-406c-b55f-a4ade2456acb',
          'items[0].[operator]': OperatorName.Is,
          'items[0].[value]': {
            type: ConditionType.StringValue,
            value: 'test1'
          },
          displayName: 'Condition name',
          id: '317507f2-9ab3-4b9b-b9f2-0be678b22c3f',
          coordinator: 'and'
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/conditions'
      )
      expect(addCondition).not.toHaveBeenCalled()
      expect(updateCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.any(String),
        {
          coordinator: 'and',
          displayName: 'Condition name',
          id: '317507f2-9ab3-4b9b-b9f2-0be678b22c3f',
          items: [
            {
              componentId: 'e890bd3f-f7f8-406c-b55f-a4ade2456acb',
              id: 'd16363fc-9d53-41a1-a49c-427ca9f49f8f',
              operator: 'is',
              value: {
                type: 'StringValue',
                value: 'test1'
              }
            }
          ]
        }
      )
    })

    test('POST - should handle valid final POST for add condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(getConditionSessionState).mockReturnValue({
        id: '88389bae-b6e5-4781-8d07-970809064726',
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          displayName: '',
          items: []
        }
      })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/new/session-id',
        auth,
        payload: {
          'items[0].[id]': 'd16363fc-9d53-41a1-a49c-427ca9f49f8f',
          'items[0].[componentId]': 'e890bd3f-f7f8-406c-b55f-a4ade2456acb',
          'items[0].[operator]': OperatorName.Is,
          'items[0].[value]': {
            type: ConditionType.StringValue,
            value: 'test1'
          },
          displayName: 'Condition name',
          id: '317507f2-9ab3-4b9b-b9f2-0be678b22c3f',
          coordinator: 'and'
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/conditions'
      )
      expect(updateCondition).not.toHaveBeenCalled()
      expect(addCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.any(String),
        {
          coordinator: 'and',
          displayName: 'Condition name',
          id: '317507f2-9ab3-4b9b-b9f2-0be678b22c3f',
          items: [
            {
              componentId: 'e890bd3f-f7f8-406c-b55f-a4ade2456acb',
              id: 'd16363fc-9d53-41a1-a49c-427ca9f49f8f',
              operator: 'is',
              value: {
                type: 'StringValue',
                value: 'test1'
              }
            }
          ]
        }
      )
    })

    test('POST - should handle action', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(getConditionSessionState)
        .mockReturnValue({ stateId: 'session-id' })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond-id/session-id',
        auth,
        payload: {
          action: 'addCondition'
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/condition/cond-id/session-id'
      )
      expect(setConditionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        'session-id',
        {
          conditionWrapper: {
            coordinator: undefined,
            displayName: undefined,
            items: [{ id: expect.any(String) }]
          },
          stateId: 'session-id'
        }
      )
      expect(addErrorsToSession).not.toHaveBeenCalled()
    })

    test('POST - should handle removeAction', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(getConditionSessionState)
        .mockReturnValue({ stateId: 'session-id' })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond-id/session-id',
        auth,
        payload: {
          removeAction: '1',
          items: [{ id: '1' }, { id: '2' }, { id: '3' }]
        }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/condition/cond-id/session-id'
      )
      expect(setConditionSessionState).toHaveBeenCalledWith(
        expect.anything(),
        'session-id',
        {
          conditionWrapper: {
            coordinator: undefined,
            displayName: undefined,
            items: [{ id: '1' }, { id: '3' }]
          },
          stateId: 'session-id'
        }
      )
      expect(addErrorsToSession).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
