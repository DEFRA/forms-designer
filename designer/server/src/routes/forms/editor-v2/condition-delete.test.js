import {
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

  describe('GET /condition/{conditionId}/delete', () => {
    test('should render confirmation page with warnings when condition is used', async () => {
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

      const $heading = container.getByRole('heading', {
        level: 2,
        name: 'Are you sure you want to delete this condition?'
      })
      const $warning = container.getByText(
        'Deleting this condition will affect the following pages:'
      )

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
        'Deleting this condition will affect the following pages:'
      )

      expect($heading).toBeInTheDocument()
      expect($warning).not.toBeInTheDocument()
    })
  })

  describe('POST /condition/{conditionId}/delete', () => {
    test('should delete condition and redirect to conditions list', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
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

    test('should show error message when condition is referenced by other conditions', async () => {
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
    })

    test('should rethrow non-RefConditionConditionId errors', async () => {
      const genericError = Boom.badRequest('Generic error')

      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(editor.deleteCondition).mockRejectedValueOnce(genericError)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/condition/cond1/delete',
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(400)
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
