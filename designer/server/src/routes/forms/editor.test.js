import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

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

  test('GET /editor/{slug*}/ should serve designer editor page', async () => {
    const id = '661e4ca5039739ef2902b214'
    const slug = 'my-form-slug'

    const formMetadataOutput = {
      id,
      slug,
      title: 'My form slug',
      organisation: 'Defra',
      teamName: 'Forms',
      teamEmail: 'defraforms@defra.gov.uk',
      draft: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    // Mock the api call to forms-manager
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadataOutput)

    const options = {
      method: 'get',
      url: '/editor/my-form-slug',
      auth
    }

    const { document } = await renderResponse(server, options)
    expect(document.body).toContainHTML(
      `<div class="govuk-grid-column-full app-editor" data-id="${id}" data-slug="${slug}" data-preview-url="${config.previewUrl}"></div>`
    )
  })
})
