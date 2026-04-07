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

  const testFormId = '661e4ca5039739ef2902b214'
  const now = new Date()

  const testMetadata = {
    id: testFormId,
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    createdAt: now,
    createdBy: { id: 'user-1', displayName: 'Test User' },
    updatedAt: now,
    updatedBy: { id: 'user-1', displayName: 'Test User' },
    versions: [{ versionNumber: 1, createdAt: now }]
  }

  describe('GET /admin/form-inspect/:id/metadata', () => {
    test('renders metadata JSON and tab navigation', async () => {
      jest.mocked(forms.getFormById).mockResolvedValueOnce(testMetadata)
      jest
        .mocked(forms.listFormVersions)
        .mockResolvedValueOnce([{ versionNumber: 1, createdAt: now }])

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/metadata`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.getFormById).toHaveBeenCalledWith(
        testFormId,
        auth.credentials.token
      )

      const $pre = container.getByRole('code')
      expect($pre.textContent).toContain('"slug": "my-form-slug"')

      const $tabLinks = container.getAllByRole('link', {
        name: /metadata|versions|live|draft/i
      })
      expect($tabLinks.length).toBeGreaterThanOrEqual(4)
    })

    test('renders inconsistency panel when metadata.versions contains an id not in versions collection', async () => {
      jest.mocked(forms.getFormById).mockResolvedValueOnce({
        ...testMetadata,
        versions: [
          { versionNumber: 1, createdAt: now },
          { versionNumber: 99, createdAt: now }
        ]
      })
      jest
        .mocked(forms.listFormVersions)
        .mockResolvedValueOnce([{ versionNumber: 1, createdAt: now }])

      const { container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/metadata`,
        auth
      })

      const $details = container.getByText(/data inconsistencies detected/i)
      expect($details).toBeDefined()
    })

    test('renders no inconsistency panel when versions match', async () => {
      jest.mocked(forms.getFormById).mockResolvedValueOnce({
        ...testMetadata,
        versions: [{ versionNumber: 1, createdAt: now }]
      })
      jest
        .mocked(forms.listFormVersions)
        .mockResolvedValueOnce([{ versionNumber: 1, createdAt: now }])

      const { container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/metadata`,
        auth
      })

      expect(container.queryByText(/data inconsistencies detected/i)).toBeNull()
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
