import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'

jest.mock('~/src/lib/forms.js')

describe('Form library routes', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const okStatusCode = 200
  const htmlContentType = 'text/html'

  test('Testing form library list page', async () => {
    const title = 'Form 1'

    // Mock the api call to forms-manager
    forms.list.mockResolvedValueOnce([{ title }])

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
    expect(res.result).toContain(`<td class="govuk-table__cell">${title}</td>`)
  })
})
