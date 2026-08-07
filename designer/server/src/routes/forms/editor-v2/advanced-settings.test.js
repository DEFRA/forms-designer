import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Editor v2 advanced settings routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET /library/{slug}/editor-v2/advanced-settings', () => {
    test('should render the advanced settings page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/advanced-settings',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $backLink = container.getByRole('link', { name: 'Back to pages' })

      expect($mainHeading).toHaveTextContent('Advanced settings')
      expect($backLink).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/pages'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
