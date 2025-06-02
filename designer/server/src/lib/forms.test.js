import { FormStatus, SchemaVersion } from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'

import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as fetch from '~/src/lib/fetch.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

describe('Forms library routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'

  /**
   * @satisfies {FormMetadataAuthor}
   */
  const author = {
    id: authorId,
    displayName: authorDisplayName
  }

  /**
   * @satisfies {FormMetadata}
   */
  const formMetadata = {
    id: '661e4ca5039739ef2902b214',
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    draft: {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    },
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinition = {
    name: 'Test form',
    pages: [],
    conditions: [],
    sections: [],
    lists: []
  }

  describe('Forms library routes (mocked forms functions)', () => {
    beforeEach(() => {
      jest.spyOn(forms, 'list')
      jest.spyOn(forms, 'get')
      jest.spyOn(forms, 'getDraftFormDefinition')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('Forms library list page without pagination data', async () => {
      jest.mocked(forms.list).mockResolvedValueOnce({
        data: [formMetadata],
        meta: {}
      })

      const options = {
        method: 'GET',
        url: '/library',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'Forms library',
        level: 1
      })

      expect($heading).toBeInTheDocument()

      const $tableCells = document.querySelectorAll('td.govuk-table__cell')
      expect($tableCells[0].textContent?.trim()).toContain(formMetadata.title)

      const $pagination = document.querySelector('.govuk-pagination')
      expect($pagination).not.toBeInTheDocument()
    })

    it('Forms library list page with pagination data', async () => {
      jest.mocked(forms.list).mockResolvedValueOnce({
        data: [formMetadata],
        meta: {
          pagination: {
            page: 1,
            perPage: 10,
            totalPages: 3,
            totalItems: 25
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/library?page=1&perPage=10',
        auth
      }

      await renderResponse(server, options)

      const $pagination = document.querySelector('.govuk-pagination')
      expect($pagination).toBeInTheDocument()

      const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
      expect($pages).toHaveLength(3)

      expect($pages?.[0].textContent?.trim()).toBe('1')
      expect($pages?.[0].classList).toContain('govuk-pagination__item--current')

      expect($pages?.[1].textContent?.trim()).toBe('2')
      expect($pages?.[1].classList).not.toContain(
        'govuk-pagination__item--current'
      )

      expect($pages?.[2].textContent?.trim()).toBe('3')
      expect($pages?.[2].classList).not.toContain(
        'govuk-pagination__item--current'
      )
    })

    it('Forms library list page with pagination - middle page', async () => {
      jest.mocked(forms.list).mockResolvedValueOnce({
        data: [formMetadata],
        meta: {
          pagination: {
            page: 2,
            perPage: 10,
            totalPages: 3,
            totalItems: 25
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/library?page=2&perPage=10',
        auth
      }

      await renderResponse(server, options)

      const $pagination = document.querySelector('.govuk-pagination')
      expect($pagination).toBeInTheDocument()

      const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
      expect($pages).toHaveLength(3)

      expect($pages?.[0].textContent?.trim()).toBe('1')
      expect($pages?.[0].classList).not.toContain(
        'govuk-pagination__item--current'
      )

      expect($pages?.[1].textContent?.trim()).toBe('2')
      expect($pages?.[1].classList).toContain('govuk-pagination__item--current')

      expect($pages?.[2].textContent?.trim()).toBe('3')
      expect($pages?.[2].classList).not.toContain(
        'govuk-pagination__item--current'
      )
    })

    it('Forms library list page with pagination - last page', async () => {
      jest.mocked(forms.list).mockResolvedValueOnce({
        data: [formMetadata],
        meta: {
          pagination: {
            page: 3,
            perPage: 10,
            totalPages: 3,
            totalItems: 25
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/library?page=3&perPage=10',
        auth
      }

      await renderResponse(server, options)

      const $pagination = document.querySelector('.govuk-pagination')
      expect($pagination).toBeInTheDocument()

      const $pages = $pagination?.querySelectorAll('.govuk-pagination__item')
      expect($pages).toHaveLength(3)

      expect($pages?.[0].textContent?.trim()).toBe('1')
      expect($pages?.[0].classList).not.toContain(
        'govuk-pagination__item--current'
      )

      expect($pages?.[1].textContent?.trim()).toBe('2')
      expect($pages?.[1].classList).not.toContain(
        'govuk-pagination__item--current'
      )

      expect($pages?.[2].textContent?.trim()).toBe('3')
      expect($pages?.[2].classList).toContain('govuk-pagination__item--current')
    })

    it('Forms library list page redirects if page exceeds totalPages', async () => {
      jest.mocked(forms.list).mockResolvedValueOnce({
        data: [],
        meta: {
          pagination: {
            page: 5,
            perPage: 10,
            totalPages: 3,
            totalItems: 25
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/library?page=5&perPage=10',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/library?page=1&perPage=10')
    })

    it('Forms library list page', async () => {
      const { title } = formMetadata

      jest.mocked(forms.list).mockResolvedValueOnce({
        data: [formMetadata],
        meta: {}
      })

      const options = {
        method: 'GET',
        url: '/library',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'Forms library',
        level: 1
      })

      const $tables = container.getAllByRole('table')

      expect($heading).toHaveClass('app-masthead__heading')
      expect($tables[0]).toContainHTML(
        `<td class="govuk-table__cell">${title}</td>`
      )
    })

    it('Form editor page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor',
        auth
      }

      await renderResponse(server, options)

      const $editor = document.querySelector('.app-form-editor')
      const $metadata = document.querySelector('.app-form-metadata')
      const $definition = document.querySelector('.app-form-definition')

      expect($editor).toHaveAttribute('data-preview-url', config.previewUrl)

      expect(
        $metadata?.textContent && JSON.parse($metadata.textContent)
      ).toMatchObject({
        ...formMetadata,
        draft: {
          ...formMetadata.draft,
          // Dates in JSON are stringified
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        },
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      })

      expect(
        $definition?.textContent && JSON.parse($definition.textContent)
      ).toMatchObject(formDefinition)
    })

    it('Form overview has draft buttons in side bar', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce({
        ...formMetadata,
        // Switch draft with live for test
        live: formMetadata.draft,
        draft: undefined
      })

      const options = {
        method: 'get',
        url: '/library/my-form-slug',
        auth
      }

      await renderResponse(server, options)

      const $card = document.querySelector('.app-form-card')
      const $buttons = $card?.querySelectorAll('.govuk-button')

      expect($buttons).toHaveLength(1)
      expect($buttons?.[0]).toHaveTextContent('Create draft to edit')
    })

    it('Form overview has live buttons in side bar', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(buildDefinition({ schema: SchemaVersion.V2 }))

      const options = {
        method: 'get',
        url: '/library/my-form-slug',
        auth
      }

      await renderResponse(server, options)

      const $card = document.querySelector('.app-form-card')
      const $buttons = $card?.querySelectorAll('.govuk-button')

      expect($buttons).toHaveLength(2)
      expect($buttons?.[0]).toHaveTextContent('Edit draft')
      expect($buttons?.[1]).toHaveTextContent('Make draft live')
    })
  })

  describe('Forms functions', () => {
    describe('list', () => {
      const token = auth.credentials.token

      beforeEach(() => {
        jest.clearAllMocks()
      })

      it('should fetch list of forms with pagination', async () => {
        const options = { page: 2, perPage: 10 }
        const mockResponse = {
          data: [formMetadata],
          meta: {
            pagination: {
              page: 2,
              perPage: 10,
              totalPages: 3,
              totalItems: 25
            }
          }
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        expect(fetch.getJson).toHaveBeenCalledWith(expect.any(URL), {
          headers: { Authorization: `Bearer ${token}` }
        })

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)

        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls

        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        expect(calledUrl.searchParams.get('page')).toBe('2')
        expect(calledUrl.searchParams.get('perPage')).toBe('10')

        expect(result).toEqual(mockResponse)
      })

      it('should append pagination parameters when provided', async () => {
        const options = { page: 1, perPage: 24 }
        const mockResponse = {
          data: [formMetadata],
          meta: {}
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        expect(fetch.getJson).toHaveBeenCalledWith(expect.any(URL), {
          headers: { Authorization: `Bearer ${token}` }
        })

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)

        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls

        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        expect(calledUrl.searchParams.get('page')).toBe('1')
        expect(calledUrl.searchParams.get('perPage')).toBe('24')

        expect(result).toEqual(mockResponse)
      })

      it('should append sort parameters when provided', async () => {
        const options = {
          page: 1,
          perPage: 10,
          sortBy: 'title',
          order: 'asc'
        }
        const mockResponse = {
          data: [formMetadata],
          meta: {}
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        expect(fetch.getJson).toHaveBeenCalledWith(expect.any(URL), {
          headers: { Authorization: `Bearer ${token}` }
        })

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)

        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls

        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        expect(calledUrl.searchParams.get('page')).toBe('1')
        expect(calledUrl.searchParams.get('perPage')).toBe('10')
        expect(calledUrl.searchParams.get('sortBy')).toBe('title')
        expect(calledUrl.searchParams.get('order')).toBe('asc')

        expect(result).toEqual(mockResponse)
      })

      it('should append title parameter when provided', async () => {
        const options = {
          page: 1,
          perPage: 10,
          title: 'Search Term'
        }
        const mockResponse = {
          data: [formMetadata],
          meta: {}
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        expect(fetch.getJson).toHaveBeenCalledWith(expect.any(URL), {
          headers: { Authorization: `Bearer ${token}` }
        })

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)
        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls
        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        expect(calledUrl.searchParams.get('page')).toBe('1')
        expect(calledUrl.searchParams.get('perPage')).toBe('10')
        expect(calledUrl.searchParams.get('title')).toBe('Search Term')

        expect(result).toEqual(mockResponse)
      })

      it('should append author parameter when provided', async () => {
        const options = {
          page: 1,
          perPage: 10,
          author: authorDisplayName
        }
        const mockResponse = {
          data: [formMetadata],
          meta: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 1,
              totalItems: 1
            }
          }
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)
        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls
        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        expect(calledUrl.searchParams.get('author')).toBe(authorDisplayName)
        expect(result).toEqual(mockResponse)
      })

      it('should append organisations parameters when provided', async () => {
        const options = {
          page: 1,
          perPage: 10,
          organisations: ['Defra', 'Environment Agency']
        }
        const mockResponse = {
          data: [formMetadata],
          meta: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 1,
              totalItems: 1
            }
          }
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)
        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls
        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        const organisations = calledUrl.searchParams.getAll('organisations')
        expect(organisations).toEqual(['Defra', 'Environment Agency'])
        expect(result).toEqual(mockResponse)
      })

      it('should append status parameters when provided', async () => {
        const options = {
          page: 1,
          perPage: 10,
          status: /** @type {FormStatus[]} */ ([
            FormStatus.Draft,
            FormStatus.Live
          ])
        }
        const mockResponse = {
          data: [formMetadata],
          meta: {
            pagination: {
              page: 1,
              perPage: 10,
              totalPages: 1,
              totalItems: 1
            }
          }
        }

        jest.spyOn(fetch, 'getJson').mockResolvedValueOnce({
          /** @type {any} */
          response: {},
          body: mockResponse
        })

        const result = await forms.list(token, options)

        const fetchGetJsonMock = /** @type {jest.Mock} */ (fetch.getJson)
        /** @type {Array<[URL, object]>} */
        const mockCalls = fetchGetJsonMock.mock.calls
        const calledUrl = /** @type {URL} */ (mockCalls[0][0])

        const statuses = calledUrl.searchParams.getAll('status')
        expect(statuses).toEqual(['draft', 'live'])
        expect(result).toEqual(mockResponse)
      })
    })
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
