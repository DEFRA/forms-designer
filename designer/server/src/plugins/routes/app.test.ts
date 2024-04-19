import { type Server } from '@hapi/hapi'

import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

describe('App routes test', () => {
  const startServer = async (): Promise<Server> => {
    const { createServer } = await import('~/src/createServer.js')

    const server = await createServer()
    await server.initialize()
    return server
  }

  let server: Server

  beforeAll(async () => {
    server = await startServer()
    const { persistenceService } = server.services()
    persistenceService.updateDraftFormDefinition = () => {
      return Promise.resolve([])
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test('GET /forms-designer/editor/{:id}/ should serve designer editor page', async () => {
    const options = {
      method: 'get',
      url: '/forms-designer/editor/my-form-id',
      auth
    }

    const { document } = await renderResponse(server, options)
    expect(document.body).toContainHTML(
      '<div class="govuk-grid-column-full app-editor"></div>'
    )
  })
})
