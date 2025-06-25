import { ConditionType, Engine, OperatorName } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithMultipleV2Conditions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addCondition, updateCondition } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { getConditionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/session-helper.js')

describe('Editor v2 condition-check-changes routes', () => {
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
    ...testFormDefinitionWithMultipleV2Conditions,
    engine: Engine.V2
  })

  describe('GET condition-check-changes routes', () => {
    test('should render content correctly', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)
      jest.mocked(getConditionSessionState).mockReturnValue({
        id: '88389bae-b6e5-4781-8d07-970809064726',
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2',
          displayName: 'My test condition',
          items: [
            {
              id: '7ccd81c7-6c44-4de2-9c2b-fc917b7e9f35',
              componentId: '7bfc19cf-8d1d-47dd-926e-8363bcc761f2',
              operator: OperatorName.Is,
              type: ConditionType.StringValue,
              value: 'red'
            }
          ]
        }
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition-check-changes/d5e9f931-e151-4dd6-a2b9-68a03f3537e2/session-id',
        auth
      }

      const { container, document } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $cardHeadings = container.getAllByText('Manage conditions')

      expect($mainHeading).toHaveTextContent('Manage conditions')
      expect($cardHeadings[0]).toHaveTextContent('Test form Manage conditions')
      expect($cardHeadings).toHaveLength(1)

      const $conditionTitles = document.getElementsByClassName(
        'govuk-summary-card__title-wrapper'
      )
      expect($conditionTitles[0].textContent?.trim()).toBe('Original condition')
      expect($conditionTitles[1].textContent?.trim()).toBe('New condition')

      const $conditionTexts = document.getElementsByClassName(
        'govuk-summary-card__content'
      )
      expect($conditionTexts[0].textContent?.trim()).toContain('isBobV2')
      expect($conditionTexts[0].textContent?.trim()).toContain(
        "'What is your full name' is 'bob'"
      )
      expect($conditionTexts[1].textContent?.trim()).toContain(
        'My test condition'
      )
      expect($conditionTexts[1].textContent?.trim()).toContain(
        "'What is your favourite color' is 'red'"
      )
    })
  })

  describe('POST condition-check-routes routes', () => {
    test('POST - should handle valid final POST and saves changes', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(getConditionSessionState).mockReturnValue({
        id: '88389bae-b6e5-4781-8d07-970809064726',
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          displayName: 'My cond1',
          items: []
        }
      })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition-check-changes/d5e9f931-e151-4dd6-a2b9-68a03f3537e2/session-id',
        auth,
        payload: {}
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addCondition).not.toHaveBeenCalled()
      expect(updateCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.any(String),
        {
          displayName: 'My cond1',
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          items: []
        }
      )

      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/conditions'
      )
    })

    test('POST - should handle duplicate error in API', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(getConditionSessionState).mockReturnValue({
        id: '88389bae-b6e5-4781-8d07-970809064726',
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          displayName: 'My cond1',
          items: []
        }
      })

      const boomErr = Boom.boomify(
        new Error('"conditions[1]" contains a duplicate value', {
          cause: [{ id: 'unique_condition_displayname', text: 'Dummy cause' }]
        }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      jest.mocked(updateCondition).mockRejectedValueOnce(boomErr)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition-check-changes/d5e9f931-e151-4dd6-a2b9-68a03f3537e2/session-id',
        auth,
        payload: {}
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addCondition).not.toHaveBeenCalled()
      expect(updateCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.any(String),
        {
          displayName: 'My cond1',
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          items: []
        }
      )

      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/condition-check-changes/d5e9f931-e151-4dd6-a2b9-68a03f3537e2/session-id#'
      )
    })

    test('POST - should handle failure in API', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(getConditionSessionState).mockReturnValue({
        id: '88389bae-b6e5-4781-8d07-970809064726',
        stateId: 'session-id',
        conditionWrapper: {
          id: 'd9ae6c5a-bc8f-41f4-9c2a-f4081cd210b5',
          displayName: 'My cond1',
          items: []
        }
      })

      const err = new Error('unhandled error')

      jest.mocked(updateCondition).mockRejectedValueOnce(err)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition-check-changes/d5e9f931-e151-4dd6-a2b9-68a03f3537e2/session-id',
        auth,
        payload: {}
      }

      const {
        response: { statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
