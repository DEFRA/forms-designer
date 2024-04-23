
import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/formPersistenceService')

describe('App routes test', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
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
