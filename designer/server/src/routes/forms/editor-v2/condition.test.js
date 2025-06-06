import { Engine } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'
import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
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
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 * @import { ConditionWrapperV2 } from '@defra/forms-model'
 */
