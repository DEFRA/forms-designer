import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { authSuperAdmin as auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')

describe('Form inspect routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /admin/form-inspect', () => {
    test('renders lookup form with radio options', async () => {
      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: '/admin/form-inspect',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)

      const $heading = container.getByRole('heading', { level: 1 })
      expect($heading).toHaveTextContent('Admin tools')

      const $radios = container.getAllByRole('radio')
      expect($radios).toHaveLength(2)
      expect($radios[0]).toHaveAccessibleName('Form ID')
      expect($radios[1]).toHaveAccessibleName('Form slug')

      const $idInput = container.getByRole('textbox', { name: /form id/i })
      expect($idInput).toBeDefined()

      const $slugInput = container.getByRole('textbox', { name: /form slug/i })
      expect($slugInput).toBeDefined()
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
