import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'

describe('Form library routes', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const okStatusCode = 200
  const htmlContentType = 'text/html'

  test('Testing form library list page', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/forms-designer/library',
      auth
    })

    expect(res.statusCode).toBe(okStatusCode)
    expect(res.headers['content-type']).toContain(htmlContentType)
    expect(res.result).toContain(
      `<h1 class="govuk-heading-xl govuk-!-margin-bottom-2"
        data-testid="app-heading-title">Form library</h1>`
    )
  })
})
