import {
  ConditionType,
  Coordinator,
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

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import * as helpers from '~/src/routes/forms/editor-v2/helpers.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/routes/forms/editor-v2/helpers.js')

describe('Editor v2 conditions-join routes', () => {
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
    engine: Engine.V2,
    pages: [
      buildQuestionPage({
        id: 'farm-details-page',
        title: 'Farm Details',
        components: [
          buildTextFieldComponent({
            id: 'farm-type-field',
            name: 'farmType',
            title: 'What type of farming do you do?'
          })
        ]
      }),
      buildSummaryPage()
    ]
  })

  const componentId = 'farm-type-field'
  const conditionId = 'cattle-farm-condition'

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

  /** @type {ConditionWrapperV2} */
  const mockJoinedCondition = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    displayName: 'Combined condition',
    coordinator: Coordinator.AND,
    items: [
      {
        id: 'item1',
        conditionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      },
      {
        id: 'item2',
        conditionId: 'b2c3d4e5-f6g7-8901-bcde-f12345678901'
      }
    ]
  }

  /** @type {ConditionWrapperV2} */
  const mockCondition1 = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    displayName: 'Condition 1',
    items: [
      {
        id: 'check-1',
        componentId,
        operator: OperatorName.Is,
        type: ConditionType.StringValue,
        value: 'cattle'
      }
    ]
  }

  /** @type {ConditionWrapperV2} */
  const mockCondition2 = {
    id: 'b2c3d4e5-f6g7-8901-bcde-f12345678901',
    displayName: 'Condition 2',
    items: [
      {
        id: 'check-2',
        componentId,
        operator: OperatorName.IsNot,
        type: ConditionType.StringValue,
        value: 'sheep'
      }
    ]
  }

  const testFormWithConditions = buildDefinition({
    engine: Engine.V2,
    pages: [
      buildQuestionPage({
        id: 'farm-details-page',
        title: 'Farm Details',
        components: [
          buildTextFieldComponent({
            id: 'farm-type-field',
            name: 'farmType',
            title: 'What type of farming do you do?'
          })
        ]
      }),
      buildSummaryPage()
    ],
    conditions: [
      mockCondition,
      mockCondition1,
      mockCondition2,
      mockJoinedCondition
    ]
  })

  describe('GET /library/{slug}/editor-v2/conditions-join/{conditionId}', () => {
    test('should render conditions join view for new condition', async () => {
      jest.mocked(helpers.getForm).mockResolvedValueOnce({
        metadata: testFormMetadata,
        definition: testForm
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $headings = container.getAllByRole('heading', { level: 1 })
      const $fieldsetHeading = $headings.find((h) =>
        h.textContent?.includes('Joined conditions')
      )
      const $displayNameField = container.getByLabelText(
        'Name for joined condition'
      )
      const $coordinatorRadios = container.getAllByRole('radio')

      expect($fieldsetHeading).toHaveTextContent('Joined conditions')
      expect($displayNameField).toBeInTheDocument()
      expect($coordinatorRadios).toHaveLength(2) // AND and OR radios
    })

    test('should render conditions join view for existing condition', async () => {
      jest.mocked(helpers.getForm).mockResolvedValueOnce({
        metadata: testFormMetadata,
        definition: testFormWithConditions
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/conditions-join/f47ac10b-58cc-4372-a567-0e02b2c3d479',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $headings = container.getAllByRole('heading', { level: 1 })
      const $fieldsetHeading = $headings.find((h) =>
        h.textContent?.includes('Joined conditions')
      )
      const $displayNameField = container.getByLabelText(
        'Name for joined condition'
      )

      expect($fieldsetHeading).toHaveTextContent('Joined conditions')
      expect($displayNameField).toBeInTheDocument()
      expect($displayNameField).toHaveValue('Combined condition')
    })

    test('should handle server errors gracefully', async () => {
      jest
        .mocked(helpers.getForm)
        .mockRejectedValueOnce(new Error('Server error'))

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
      expect(response.result).toContain(
        'Sorry, there is a problem with the service'
      )
    })
  })

  describe('POST /library/{slug}/editor-v2/conditions-join/{conditionId}', () => {
    test('should successfully create new joined condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(editor.addCondition).mockResolvedValueOnce({
        id: 'new-joined-condition',
        condition: /** @type {ConditionWrapperV2} */ ({}),
        status: 'created'
      })

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          displayName: 'New joined condition',
          conditions: ['condition-1', 'condition-2'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/conditions'
      )
      expect(editor.addCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        expect.objectContaining({
          displayName: 'New joined condition',
          coordinator: 'AND',
          items: expect.arrayContaining([
            expect.objectContaining({ conditionId: 'condition-1' }),
            expect.objectContaining({ conditionId: 'condition-2' })
          ])
        })
      )
    })

    test('should successfully update existing joined condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/existing-joined',
        payload: {
          displayName: 'Updated joined condition',
          conditions: ['condition-1', 'condition-3'],
          coordinator: 'OR'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toMatch(
        /^\/library\/my-form-slug\/editor-v2\/condition-check-changes\/existing-joined\/[a-zA-Z0-9-_]+$/
      )
      expect(editor.updateCondition).not.toHaveBeenCalled()
    })

    test('should handle validation error for missing display name', async () => {
      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain('conditions-join/new')
    })

    test('should handle validation error for empty display name', async () => {
      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          displayName: '',
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain('conditions-join/new')
    })

    test('should handle validation error for missing conditions', async () => {
      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          displayName: 'Test condition',
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain('conditions-join/new')
    })

    test('should handle duplicate condition name error when creating', async () => {
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
      jest.mocked(editor.addCondition).mockRejectedValueOnce(boomErr)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          displayName: 'Duplicate condition',
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain('conditions-join/new')
    })

    test('should handle duplicate condition name error when updating', async () => {
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
      jest.mocked(editor.updateCondition).mockRejectedValueOnce(boomErr)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/existing-joined',
        payload: {
          displayName: 'Duplicate condition',
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain(
        'conditions-join/existing-joined'
      )
    })

    test('should handle server errors gracefully when creating', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(editor.addCondition)
        .mockRejectedValueOnce(new Error('Generic error'))

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          displayName: 'Test condition',
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain('conditions-join/new')
    })

    test('should handle server errors gracefully when updating', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(editor.updateCondition)
        .mockRejectedValueOnce(new Error('Generic error'))

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/existing-joined',
        payload: {
          displayName: 'Test condition',
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain(
        'conditions-join/existing-joined'
      )
    })

    test('should handle server errors gracefully when forms.get fails', async () => {
      jest.mocked(forms.get).mockRejectedValueOnce(new Error('Server error'))

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/conditions-join/new',
        payload: {
          displayName: 'Test condition',
          conditions: ['condition-1'],
          coordinator: 'AND'
        },
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(303)
      expect(response.headers.location).toContain('conditions-join/new')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
