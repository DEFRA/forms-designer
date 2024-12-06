import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

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

  describe('Forms library list page', () => {
    describe('Without pagination', () => {
      it('should render the list page without pagination data', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library',
          auth
        }

        await renderResponse(server, options)

        const $heading = document.querySelector('h1.govuk-heading-xl')
        expect($heading).toBeInTheDocument()
        expect($heading?.textContent?.trim()).toBe('Forms library')

        const $tableCells = document.querySelectorAll('td.govuk-table__cell')
        expect($tableCells[0].textContent?.trim()).toContain(formMetadata.title)

        const $pagination = document.querySelector('.govuk-pagination')
        expect($pagination).not.toBeInTheDocument()
      })
    })

    describe('With pagination', () => {
      it('should render pagination controls when pagination data is provided', async () => {
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
        expect($pages?.[0].classList).toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[1].textContent?.trim()).toBe('2')
        expect($pages?.[1].classList).not.toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[2].textContent?.trim()).toBe('3')
        expect($pages?.[2].classList).not.toContain(
          'govuk-pagination__item--current'
        )
      })

      it('should highlight the current page when on a middle page', async () => {
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
        expect($pages?.[1].classList).toContain(
          'govuk-pagination__item--current'
        )

        expect($pages?.[2].textContent?.trim()).toBe('3')
        expect($pages?.[2].classList).not.toContain(
          'govuk-pagination__item--current'
        )
      })

      it('should highlight the current page when on the last page', async () => {
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
        expect($pages?.[2].classList).toContain(
          'govuk-pagination__item--current'
        )
      })

      it('should handle invalid pagination parameters gracefully', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library?page=abc&perPage=def',
          auth
        }

        await renderResponse(server, options)

        const $pagination = document.querySelector('.govuk-pagination')
        expect($pagination).not.toBeInTheDocument()

        expect(forms.list).toHaveBeenCalledWith(auth.credentials.token, {
          page: 1,
          perPage: 24
        })
      })

      it('should redirect if requested page exceeds total pages', async () => {
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
    })

    it('should display the list page correctly', async () => {
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

      expect($heading).toHaveClass('govuk-heading-xl')
      expect($tables[0]).toContainHTML(
        `<td class="govuk-table__cell">${title}</td>`
      )
    })
  })

  describe('Form editor page', () => {
    it('should load the form editor page successfully', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)

      const options = {
        method: 'GET',
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
  })

  describe('Form overview', () => {
    describe('Draft buttons in side bar', () => {
      it('should show "Create draft to edit" when no draft exists', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce({
          ...formMetadata,
          live: formMetadata.draft,
          draft: undefined
        })

        const options = {
          method: 'GET',
          url: '/library/my-form-slug',
          auth
        }

        await renderResponse(server, options)

        const $card = document.querySelector('.app-form-card')
        const $buttons = $card?.querySelectorAll('.govuk-button')

        expect($buttons).toHaveLength(1)
        expect($buttons?.[0]).toHaveTextContent('Create draft to edit')
      })
    })

    describe('Live buttons in side bar', () => {
      it('should show "Edit draft" and "Make draft live" when draft exists', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

        const options = {
          method: 'GET',
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
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
