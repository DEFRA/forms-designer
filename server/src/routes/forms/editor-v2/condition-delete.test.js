import {
  ComponentType,
  Engine,
  FormDefinitionError,
  FormDefinitionErrorType
} from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'
import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 condition delete routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testDefinition = buildDefinition({
    engine: Engine.V2,
    pages: [
      {
        id: 'page1',
        title: 'Page 1',
        path: '/page-1',
        condition: 'cond1',
        next: [],
        components: []
      },
      {
        id: 'page2',
        title: 'Page 2',
        path: '/page-2',
        next: [],
        components: []
      }
    ],
    conditions: [
      {
        id: 'cond1',
        displayName: 'Test condition',
        items: []
      },
      {
        id: 'cond2',
        displayName: 'Another condition',
        items: [
          {
            id: 'ref1',
            conditionId: 'cond1'
          }
        ]
      }
    ]
  })

  // cond2 joins to cond1 in `testDefinition`, which blocks deleting cond1. This
  // variant keeps the two conditions independent so cond1 can be deleted.
  /** @param {Partial<FormDefinition>} [overrides] */
  const buildDeletableDefinition = (overrides = {}) =>
    buildDefinition({
      ...testDefinition,
      conditions: [
        { id: 'cond1', displayName: 'Test condition', items: [] },
        { id: 'cond2', displayName: 'Another condition', items: [] }
      ],
      ...overrides
    })

  describe('GET /condition/{conditionId}/delete', () => {
    test('should render confirmation page with warnings when condition is used', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(buildDeletableDefinition())

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        level: 2,
        name: 'Are you sure you want to delete this condition?'
      })
      const $warning = container.getByText(
        'Deleting this condition will affect:'
      )

      expect(
        container.getByRole('heading', {
          level: 1,
          name: 'Test form Delete condition: Test condition'
        })
      ).toBeInTheDocument()
      expect($heading).toBeInTheDocument()
      expect($warning).toBeInTheDocument()
    })

    test('should render confirmation page without warnings when condition is not used', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/cond2/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        level: 2,
        name: 'Are you sure you want to delete this condition?'
      })
      const $warning = container.queryByText(
        'Deleting this condition will affect:'
      )

      expect($heading).toBeInTheDocument()
      expect($warning).not.toBeInTheDocument()
    })

    test('should warn that email actions using the condition will be deleted', async () => {
      const definitionWithOutputs = buildDeletableDefinition({
        outputs: [
          {
            emailAddress: 'conditional@example.com',
            audience: 'human',
            version: '2',
            condition: 'cond1'
          }
        ]
      })

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWithOutputs)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      // The affected pages and email actions share the one list
      expect(
        container.getByText('Deleting this condition will affect:')
      ).toBeInTheDocument()
      expect(container.getByText('Page 1')).toBeInTheDocument()
      expect(
        container.getByText(
          'Emails sent to conditional@example.com (Human-readable) - this output will be deleted'
        )
      ).toBeInTheDocument()
    })

    test('should refuse deletion up front when another condition references it', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      expect(
        container.getByRole('heading', {
          level: 2,
          name: 'You cannot delete this condition'
        })
      ).toBeInTheDocument()
      expect(
        container.getByText(
          'This condition cannot be deleted because it is referenced by other conditions. Remove all references to this condition before deleting it.'
        )
      ).toBeInTheDocument()
      expect(
        container.getByText('Condition: Another condition')
      ).toBeInTheDocument()
      expect(
        container.queryByRole('button', { name: 'Delete condition' })
      ).not.toBeInTheDocument()
      expect(
        container.getByRole('button', { name: 'Back to conditions' })
      ).toBeInTheDocument()
    })

    test('should refuse deletion up front when a conditional payment amount uses it', async () => {
      const definitionWithPaymentRef = buildDefinition({
        engine: Engine.V2,
        pages: [
          {
            id: 'p1',
            title: 'Pay',
            path: '/pay',
            next: [],
            components: [
              {
                id: 'c1',
                name: 'pay',
                title: 'Pay',
                type: ComponentType.PaymentField,
                hint: '',
                options: {
                  amount: 25,
                  description: 'Fee',
                  conditionalAmounts: [{ amount: 50, condition: 'cond1' }]
                }
              }
            ]
          }
        ],
        conditions: [{ id: 'cond1', displayName: 'Cond 1', items: [] }]
      })

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWithPaymentRef)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      expect(
        container.getByText(
          'This condition cannot be deleted because it is used for a conditional payment amount. Remove the conditional payment amount that uses it before deleting it.'
        )
      ).toBeInTheDocument()
      expect(
        container.getByText('Conditional payment amount on page 1')
      ).toBeInTheDocument()
      expect(
        container.queryByRole('button', { name: 'Delete condition' })
      ).not.toBeInTheDocument()
    })
  })

  describe('POST /condition/{conditionId}/delete', () => {
    test('should delete condition and redirect to conditions list', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)
      jest.mocked(editor.deleteCondition).mockResolvedValueOnce()

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond2/delete',
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/conditions'
      )
      expect(editor.deleteCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        'cond2'
      )
    })

    test('should leave the email actions that use the condition to forms-manager', async () => {
      const definitionWithOutputs = buildDeletableDefinition({
        outputs: [
          {
            emailAddress: 'unconditional@example.com',
            audience: 'human',
            version: '2'
          },
          {
            emailAddress: 'conditional@example.com',
            audience: 'human',
            version: '2',
            condition: 'cond1'
          },
          {
            emailAddress: 'other@example.com',
            audience: 'machine',
            version: '1',
            condition: 'cond2'
          }
        ]
      })

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWithOutputs)
      jest.mocked(editor.deleteCondition).mockResolvedValueOnce()

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)

      // The cascade happens in the same transaction as the delete, so a partly
      // applied definition can never be saved from here
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
      expect(editor.deleteCondition).toHaveBeenCalledWith(
        testFormMetadata.id,
        auth.credentials.token,
        'cond1'
      )
    })

    test('blocks deletion when the condition is referenced by a PaymentField', async () => {
      const definitionWithPaymentRef = buildDefinition({
        engine: Engine.V2,
        pages: [
          {
            id: 'p1',
            title: 'Pay',
            path: '/pay',
            next: [],
            components: [
              {
                id: 'c1',
                name: 'pay',
                title: 'Pay',
                type: ComponentType.PaymentField,
                hint: '',
                options: {
                  amount: 25,
                  description: 'Fee',
                  conditionalAmounts: [{ amount: 50, condition: 'cond1' }]
                }
              }
            ]
          }
        ],
        conditions: [{ id: 'cond1', displayName: 'Cond 1', items: [] }]
      })

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWithPaymentRef)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $errorMessage = container.getByText(
        'This condition cannot be deleted because it is used for a conditional payment amount. Remove the conditional payment amount that uses it before deleting it.'
      )
      expect($errorMessage).toBeInTheDocument()
      expect(editor.deleteCondition).not.toHaveBeenCalled()
    })

    test('blocks deletion when another condition references it, leaving email actions alone', async () => {
      const definitionWithOutputs = buildDefinition({
        ...testDefinition,
        outputs: [
          {
            emailAddress: 'conditional@example.com',
            audience: 'human',
            version: '2',
            condition: 'cond1'
          }
        ]
      })

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWithOutputs)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $errorMessage = container.getByText(
        'This condition cannot be deleted because it is referenced by other conditions. Remove all references to this condition before deleting it.'
      )

      expect($errorMessage).toBeInTheDocument()
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
      expect(editor.deleteCondition).not.toHaveBeenCalled()
    })

    // cond2 is not referenced locally, so the delete reaches the API and it is
    // the API that reports the reference
    test('should show error message when the API reports a condition reference', async () => {
      const cause = [
        {
          id: FormDefinitionError.RefConditionConditionId,
          detail: { path: ['conditions', 0] },
          message: '"conditions[0]" references a missing condition',
          type: FormDefinitionErrorType.Ref
        }
      ]

      const refConditionError = Boom.boomify(
        new Error('"conditions[0]" references a missing condition', { cause }),
        {
          data: { error: 'InvalidFormDefinitionError' }
        }
      )

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(editor.deleteCondition)
        .mockRejectedValueOnce(refConditionError)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)
        .mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond2/delete',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $errorMessage = container.getByText(
        'This condition cannot be deleted because it is referenced by other conditions. Remove all references to this condition before deleting it.'
      )

      expect($errorMessage).toBeInTheDocument()
    })

    test('should rethrow non-RefConditionConditionId errors', async () => {
      const genericError = Boom.badRequest('Generic error')

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)
      jest.mocked(editor.deleteCondition).mockRejectedValueOnce(genericError)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond2/delete',
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(400)
    })
  })
})

/**
 * @import { FormDefinition } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
