import {
  AuditEventMessageType,
  FormStatus,
  SchemaVersion
} from '@defra/forms-model'
import { buildDefinition } from '@defra/forms-model/stubs'

import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as audit from '~/src/lib/audit.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/audit.js')
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

  beforeEach(() => {
    jest.resetAllMocks()
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

  const formDefinition = buildDefinition({
    name: 'Test form'
  })

  const formDefinitionV2 = buildDefinition({
    name: 'Test form',
    schema: SchemaVersion.V2
  })

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

      it('should not redirect if totalPages is 0', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [],
          meta: {
            pagination: {
              page: 5,
              perPage: 10,
              totalPages: 0,
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

        expect(response.statusCode).toBe(200)
      })

      it('should preserve search parameters when redirecting for exceeded page', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [],
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
          url: '/library?page=5&perPage=10&title=test+form&sort=titleAsc',
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(
          '/library?page=1&perPage=10&sort=titleAsc&title=test+form'
        )
      })

      it('should preserve sort parameter when redirecting for exceeded page', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [],
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
          url: '/library?page=5&perPage=10&sort=titleDesc',
          auth
        }

        const response = await server.inject(options)

        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe(
          '/library?page=1&perPage=10&sort=titleDesc'
        )
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

      expect($heading).toHaveClass('app-masthead__heading')
      expect($tables[0]).toContainHTML(
        `<td class="govuk-table__cell">${title}</td>`
      )
    })

    describe('Sorting', () => {
      it('should handle updatedDesc sort parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library?sort=updatedDesc',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            sortBy: 'updatedAt',
            order: 'desc'
          })
        )
      })

      it('should handle updatedAsc sort parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library?sort=updatedAsc',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            sortBy: 'updatedAt',
            order: 'asc'
          })
        )
      })

      it('should handle titleAsc sort parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library?sort=titleAsc',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            sortBy: 'title',
            order: 'asc'
          })
        )
      })

      it('should handle titleDesc sort parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library?sort=titleDesc',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            sortBy: 'title',
            order: 'desc'
          })
        )
      })

      it('should handle missing sort parameter', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.not.objectContaining({
            sortBy: expect.any(String),
            order: expect.any(String)
          })
        )
      })
    })

    describe('Validation', () => {
      it('should show error page for invalid sort parameter', async () => {
        const options = {
          method: 'GET',
          url: '/library?sort=invalid',
          auth
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(400)
      })

      it('should show error page for invalid pagination parameters', async () => {
        const options = {
          method: 'GET',
          url: '/library?page=invalid&perPage=invalid',
          auth
        }

        const response = await server.inject(options)
        expect(response.statusCode).toBe(400)
      })
    })

    describe('Search', () => {
      it('should handle title search parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {
            search: {
              title: 'some search'
            }
          }
        })

        const options = {
          method: 'GET',
          url: '/library?title=some+search',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            title: 'some search'
          })
        )
      })

      it('should handle author search parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {
            search: {
              author: 'John Smith'
            }
          }
        })

        const options = {
          method: 'GET',
          url: '/library?author=John+Smith',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            author: 'John Smith'
          })
        )
      })

      it('should handle organisations search parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {
            search: {
              organisations: ['Defra', 'Marine Management Organisation – MMO']
            }
          }
        })

        const options = {
          method: 'GET',
          url: '/library?organisations=Defra&organisations=Marine Management Organisation – MMO',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            organisations: ['Defra', 'Marine Management Organisation – MMO']
          })
        )
      })

      it('should handle status search parameter correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {
            search: {
              status: /** @type {FormStatus[]} */ ([
                FormStatus.Draft,
                FormStatus.Live
              ])
            }
          }
        })

        const options = {
          method: 'GET',
          url: '/library?status=draft&status=live',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            status: /** @type {FormStatus[]} */ ([
              FormStatus.Draft,
              FormStatus.Live
            ])
          })
        )
      })

      it('should handle multiple search parameters together correctly', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {
            search: {
              title: 'test',
              organisations: ['Defra', 'Marine Management Organisation – MMO'],
              status: /** @type {FormStatus[]} */ ([
                FormStatus.Draft,
                FormStatus.Live
              ]),
              author: 'Enrique Chase'
            }
          }
        })

        const options = {
          method: 'GET',
          url: '/library?title=test&organisations=Defra&organisations=Marine Management Organisation – MMO&status=draft&status=live&author=Enrique Chase',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            title: 'test',
            organisations: ['Defra', 'Marine Management Organisation – MMO'],
            status: /** @type {FormStatus[]} */ ([
              FormStatus.Draft,
              FormStatus.Live
            ]),
            author: 'Enrique Chase'
          })
        )
      })

      it('should include empty array/string defaults for all search parameters when not provided', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library',
          auth
        }

        await server.inject(options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            page: 1,
            perPage: 24,
            title: '',
            author: '',
            organisations: [],
            status: []
          })
        )
      })

      it('should initialise model.search when author is "all"', async () => {
        jest.mocked(forms.list).mockResolvedValueOnce({
          data: [formMetadata],
          meta: {}
        })

        const options = {
          method: 'GET',
          url: '/library?author=all',
          auth
        }

        await renderResponse(server, options)

        expect(forms.list).toHaveBeenCalledWith(
          auth.credentials.token,
          expect.objectContaining({
            author: ''
          })
        )
      })
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
    beforeEach(() => {
      // Default mock for audit history - returns empty records
      jest.mocked(audit.getFormHistory).mockResolvedValue({
        auditRecords: [],
        meta: {
          pagination: {
            page: 1,
            perPage: 25,
            totalItems: 0,
            totalPages: 0
          },
          sorting: {
            sortBy: 'createdAt',
            order: 'desc'
          }
        }
      })
    })

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
      it('should show "Edit draft" and "Make draft live" when draft exists in v2', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(formDefinitionV2)

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

    describe('History section', () => {
      it('should display history section when audit records exist', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(formDefinitionV2)
        jest.mocked(audit.getFormHistory).mockResolvedValueOnce({
          auditRecords: [
            /** @type {import('@defra/forms-model').AuditRecord} */ ({
              id: '1',
              type: AuditEventMessageType.FORM_CREATED,
              entityId: formMetadata.id,
              createdAt: new Date(),
              createdBy: author,
              messageCreatedAt: new Date(),
              recordCreatedAt: new Date(),
              data: {
                formId: formMetadata.id,
                slug: formMetadata.slug,
                title: formMetadata.title,
                organisation: formMetadata.organisation,
                teamName: formMetadata.teamName,
                teamEmail: formMetadata.teamEmail
              }
            })
          ],
          meta: {
            pagination: {
              page: 1,
              perPage: 25,
              totalItems: 1,
              totalPages: 1
            },
            sorting: {
              sortBy: 'createdAt',
              order: 'desc'
            }
          }
        })

        const options = {
          method: 'GET',
          url: '/library/my-form-slug',
          auth
        }

        await renderResponse(server, options)

        // Find the timeline component
        const $timeline = document.querySelector('.app-timeline')
        expect($timeline).toBeInTheDocument()

        // Find the history heading by looking for h3 containing 'History'
        const $headings = document.querySelectorAll('h3')
        const $historyHeading = Array.from($headings).find(
          (h) => h.textContent?.trim() === 'History'
        )
        expect($historyHeading).toBeInTheDocument()
      })

      it('should handle audit API failure gracefully', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(formDefinitionV2)
        jest
          .mocked(audit.getFormHistory)
          .mockRejectedValueOnce(new Error('API Error'))

        const options = {
          method: 'GET',
          url: '/library/my-form-slug',
          auth
        }

        // Should not throw - page should still render
        const { container } = await renderResponse(server, options)

        // Page should still render without error
        const $heading = container.getByRole('heading', {
          name: formMetadata.title,
          level: 1
        })
        expect($heading).toBeInTheDocument()
      })
    })
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
