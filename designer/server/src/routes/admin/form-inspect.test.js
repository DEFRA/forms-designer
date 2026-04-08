import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import {
  auth as nonSuperAdminAuth,
  authSuperAdmin as auth
} from '~/test/fixtures/auth.js'
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

      // Both id and slug populated — type='slug' must win
      const response = await server.inject({
        method: 'post',
        url: '/admin/form-inspect',
        auth,
        payload: {
          type: 'slug',
          id: '661e4ca5039739ef2902b214',
          slug: 'my-form-slug'
        }
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
      expect(forms.listFormVersions).toHaveBeenCalledWith(
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

  describe('GET /admin/form-inspect/:id/versions', () => {
    test('renders autocomplete select sorted latest-first', async () => {
      jest.mocked(forms.listFormVersions).mockResolvedValueOnce([
        { versionNumber: 1, createdAt: new Date('2024-01-01') },
        { versionNumber: 3, createdAt: new Date('2024-03-01') },
        { versionNumber: 2, createdAt: new Date('2024-02-01') }
      ])

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/versions`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.listFormVersions).toHaveBeenCalledWith(
        testFormId,
        auth.credentials.token
      )

      const $options = container.getAllByRole('option')
      // first option is blank placeholder, then sorted latest first: 3, 2, 1
      expect($options[0].getAttribute('value')).toBe('')
      expect($options[1].getAttribute('value')).toBe('3')
      expect($options[2].getAttribute('value')).toBe('2')
      expect($options[3].getAttribute('value')).toBe('1')
    })

    test('redirects to version detail when versionId query param present', async () => {
      const response = await server.inject({
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/versions?versionId=3`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        `/admin/form-inspect/${testFormId}/versions/3`
      )
    })
  })

  describe('GET /admin/form-inspect/:id/versions/:versionId', () => {
    test('renders version definition JSON', async () => {
      const definition = {
        name: 'Test form',
        pages: [],
        conditions: [],
        sections: [],
        lists: []
      }
      jest
        .mocked(forms.getFormDefinitionVersion)
        .mockResolvedValueOnce(definition)

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/versions/3`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.getFormDefinitionVersion).toHaveBeenCalledWith(
        testFormId,
        3,
        auth.credentials.token
      )

      const $pre = container.getByRole('code')
      expect($pre.textContent).toContain('"name": "Test form"')
    })
  })

  describe('GET /admin/form-inspect/:id/definition/live', () => {
    test('renders live definition JSON', async () => {
      const definition = {
        name: 'Test form',
        pages: [],
        conditions: [],
        sections: [],
        lists: []
      }
      jest.mocked(forms.getLiveFormDefinition).mockResolvedValueOnce(definition)

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/definition/live`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.getLiveFormDefinition).toHaveBeenCalledWith(
        testFormId,
        auth.credentials.token
      )

      const $pre = container.getByRole('code')
      expect($pre.textContent).toContain('"name": "Test form"')
    })

    test('renders inset message when no live definition exists (404)', async () => {
      jest.mocked(forms.getLiveFormDefinition).mockRejectedValueOnce(
        Object.assign(new Error('Not found'), {
          isBoom: true,
          output: { statusCode: 404 }
        })
      )

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/definition/live`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(container.getByText(/no live definition exists/i)).toBeDefined()
    })
  })

  describe('GET /admin/form-inspect/:id/definition/draft', () => {
    test('renders draft definition JSON', async () => {
      const definition = {
        name: 'Test form',
        pages: [],
        conditions: [],
        sections: [],
        lists: []
      }
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definition)

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/definition/draft`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.getDraftFormDefinition).toHaveBeenCalledWith(
        testFormId,
        auth.credentials.token
      )

      const $pre = container.getByRole('code')
      expect($pre.textContent).toContain('"name": "Test form"')
    })

    test('renders inset message when no draft definition exists (404)', async () => {
      jest.mocked(forms.getDraftFormDefinition).mockRejectedValueOnce(
        Object.assign(new Error('Not found'), {
          isBoom: true,
          output: { statusCode: 404 }
        })
      )

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/definition/draft`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(container.getByText(/no draft definition exists/i)).toBeDefined()
    })
  })

  describe('GET /admin/form-inspect/:id/version-diff', () => {
    test('renders selection page with two version selects', async () => {
      jest.mocked(forms.listFormVersions).mockResolvedValueOnce([
        { versionNumber: 1, createdAt: new Date('2024-01-01') },
        { versionNumber: 4, createdAt: new Date('2024-04-01') }
      ])

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/version-diff`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.listFormVersions).toHaveBeenCalledWith(
        testFormId,
        auth.credentials.token
      )

      const $selects = container.getAllByRole('combobox')
      expect($selects).toHaveLength(2)
    })

    test('shows inset text when no versions exist', async () => {
      jest.mocked(forms.listFormVersions).mockResolvedValueOnce([])

      const { response, container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/version-diff`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(container.getByText(/no versions found/i)).toBeDefined()
    })

    test('redirects to diff URL when from and to query params provided', async () => {
      const response = await server.inject({
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/version-diff?from=1&to=4`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        `/admin/form-inspect/${testFormId}/versions/1..4`
      )
    })

    test('does not redirect when only one param provided', async () => {
      jest
        .mocked(forms.listFormVersions)
        .mockResolvedValueOnce([
          { versionNumber: 1, createdAt: new Date('2024-01-01') }
        ])

      const response = await server.inject({
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/version-diff?from=1`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
    })
  })

  describe('GET /admin/form-inspect/:id/versions/:versionId (diff)', () => {
    const definitionA = { name: 'My form', pages: [] }
    const definitionB = { name: 'My form updated', pages: [] }

    test('renders diff detail page for 1..4 format', async () => {
      jest
        .mocked(forms.getFormDefinitionVersion)
        .mockResolvedValueOnce(definitionA)
        .mockResolvedValueOnce(definitionB)

      const { response, document } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/versions/1..4`,
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.OK)
      expect(forms.getFormDefinitionVersion).toHaveBeenCalledWith(
        testFormId,
        1,
        auth.credentials.token
      )
      expect(forms.getFormDefinitionVersion).toHaveBeenCalledWith(
        testFormId,
        4,
        auth.credentials.token
      )

      const scriptA = document.getElementById('version-diff-a')
      const scriptB = document.getElementById('version-diff-b')
      expect(JSON.parse(scriptA?.textContent ?? '{}')).toMatchObject({
        name: 'My form'
      })
      expect(JSON.parse(scriptB?.textContent ?? '{}')).toMatchObject({
        name: 'My form updated'
      })
    })

    test('fetches both versions in parallel', async () => {
      jest
        .mocked(forms.getFormDefinitionVersion)
        .mockResolvedValueOnce(definitionA)
        .mockResolvedValueOnce(definitionB)

      await server.inject({
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/versions/2..5`,
        auth
      })

      expect(forms.getFormDefinitionVersion).toHaveBeenCalledTimes(2)
      expect(forms.getFormDefinitionVersion).toHaveBeenCalledWith(
        testFormId,
        2,
        auth.credentials.token
      )
      expect(forms.getFormDefinitionVersion).toHaveBeenCalledWith(
        testFormId,
        5,
        auth.credentials.token
      )
    })

    test('version-diff tab is active on diff detail page', async () => {
      jest
        .mocked(forms.getFormDefinitionVersion)
        .mockResolvedValueOnce(definitionA)
        .mockResolvedValueOnce(definitionB)

      const { container } = await renderResponse(server, {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/versions/1..4`,
        auth
      })

      const $activeTab = container.getByRole('listitem', {
        // The active tab list item has the --selected modifier class
        name: (_, el) =>
          el.classList.contains('govuk-tabs__list-item--selected')
      })
      expect($activeTab.textContent?.trim()).toBe('Version diff')
    })
  })

  describe('Access control', () => {
    const routes = [
      { method: 'get', url: '/admin/form-inspect' },
      { method: 'post', url: '/admin/form-inspect' },
      { method: 'get', url: `/admin/form-inspect/${testFormId}/metadata` },
      { method: 'get', url: `/admin/form-inspect/${testFormId}/versions` },
      { method: 'get', url: `/admin/form-inspect/${testFormId}/versions/1` },
      {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/definition/live`
      },
      {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/definition/draft`
      },
      {
        method: 'get',
        url: `/admin/form-inspect/${testFormId}/version-diff`
      }
    ]

    test.each(routes)(
      '$method $url returns 403 for non-superadmin',
      async ({ method, url }) => {
        const response = await server.inject({
          method,
          url,
          auth: nonSuperAdminAuth,
          payload: method === 'post' ? {} : undefined
        })

        expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
      }
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
