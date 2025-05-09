import { createServer } from '~/src/createServer.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 error route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should display error page', async () => {
    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/error',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $pageTitles = container.getAllByRole('heading', { level: 2 })

    expect($mainHeading).toHaveTextContent(
      'Sorry, there is a problem with the service - failed to save session state'
    )
    expect($pageTitles[0]).toHaveTextContent('Support links')
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
