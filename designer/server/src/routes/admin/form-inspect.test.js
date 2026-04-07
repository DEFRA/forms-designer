import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
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

  describe('POST /admin/form-inspect', () => {
    test('redirects to metadata page when id is provided', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/admin/form-inspect',
        auth,
        payload: { type: 'id', id: '661e4ca5039739ef2902b214', slug: '' }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/admin/form-inspect/661e4ca5039739ef2902b214/metadata'
      )
    })

    test('resolves slug to id and redirects to metadata page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce({
        id: '661e4ca5039739ef2902b214',
        slug: 'my-form-slug',
        title: 'Test form',
        organisation: 'Defra',
        teamName: 'Defra Forms',
        teamEmail: 'defraforms@defra.gov.uk',
        createdAt: new Date(),
        createdBy: { id: 'user-1', displayName: 'Test User' },
        updatedAt: new Date(),
        updatedBy: { id: 'user-1', displayName: 'Test User' }
      })

      const response = await server.inject({
        method: 'post',
        url: '/admin/form-inspect',
        auth,
        payload: { type: 'slug', id: '', slug: 'my-form-slug' }
      })

      expect(forms.get).toHaveBeenCalledWith(
        'my-form-slug',
        auth.credentials.token
      )
      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/admin/form-inspect/661e4ca5039739ef2902b214/metadata'
      )
    })

    test('redirects back when neither id nor slug provided', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/admin/form-inspect',
        auth,
        payload: { type: '', id: '', slug: '' }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe('/admin/form-inspect')
    })

    test('redirects back when slug is not found', async () => {
      jest.mocked(forms.get).mockRejectedValueOnce(
        Object.assign(new Error('Not found'), {
          isBoom: true,
          output: { statusCode: 404 }
        })
      )

      const response = await server.inject({
        method: 'post',
        url: '/admin/form-inspect',
        auth,
        payload: { type: 'slug', id: '', slug: 'unknown-slug' }
      })

      expect(forms.get).toHaveBeenCalledWith(
        'unknown-slug',
        auth.credentials.token
      )
      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe('/admin/form-inspect')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
