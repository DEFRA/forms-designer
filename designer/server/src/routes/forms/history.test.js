import { AuditEventMessageType } from '@defra/forms-model'

import { createServer } from '~/src/createServer.js'
import * as audit from '~/src/lib/audit.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/audit.js')

describe('Form history route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  afterEach(() => {
    jest.clearAllMocks()
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

  /**
   * Creates a mock audit record
   * @param {Partial<AuditRecord>} [overrides]
   * @returns {AuditRecord}
   */
  function createMockAuditRecord(overrides = {}) {
    return /** @type {AuditRecord} */ ({
      id: '68948579d5659369f1e634c6',
      messageId: '46bcc5ee-49e7-4eb9-9b2b-02e41faa7ec1',
      category: 'FORM',
      type: AuditEventMessageType.FORM_CREATED,
      schemaVersion: 1,
      source: 'FORMS_MANAGER',
      entityId: '661e4ca5039739ef2902b214',
      createdAt: new Date('2019-06-14T14:01:00.000Z'),
      createdBy: {
        id: authorId,
        displayName: authorDisplayName
      },
      data: {
        formId: '661e4ca5039739ef2902b214',
        slug: 'my-form-slug',
        title: 'Test form',
        organisation: 'Defra',
        teamName: 'Defra Forms',
        teamEmail: 'defraforms@defra.gov.uk'
      },
      messageCreatedAt: new Date('2019-06-14T14:01:00.100Z'),
      recordCreatedAt: new Date('2019-06-14T14:01:00.200Z'),
      ...overrides
    })
  }

  /**
   * Creates a mock audit response with pagination
   * @param {AuditRecord[]} records
   * @param {object} [paginationOverrides]
   */
  function createMockAuditResponse(records, paginationOverrides = {}) {
    return {
      auditRecords: records,
      meta: {
        pagination: {
          page: 1,
          perPage: 25,
          totalItems: records.length,
          totalPages: 1,
          ...paginationOverrides
        },
        sorting: {
          sortBy: 'createdAt',
          order: 'desc'
        }
      }
    }
  }

  describe('GET /library/{slug}/history', () => {
    it('should render the history page with audit records', async () => {
      const auditRecords = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T16:30:00.000Z')
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
          createdAt: new Date('2019-06-14T15:00:00.000Z')
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_CREATED,
          createdAt: new Date('2019-06-14T14:01:00.000Z')
        })
      ]

      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest
        .mocked(audit.getFormHistory)
        .mockResolvedValueOnce(createMockAuditResponse(auditRecords))

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { container, document } = await renderResponse(server, options)

      // Check page heading (caption + heading text combined)
      const $heading = container.getByRole('heading', {
        name: 'Test form Form history',
        level: 1
      })
      expect($heading).toBeInTheDocument()

      // Check timeline is rendered
      const $timeline = document.querySelector('.app-timeline')
      expect($timeline).toBeInTheDocument()

      // Check timeline items exist
      const $timelineItems = document.querySelectorAll('.app-timeline__item')
      expect($timelineItems.length).toBeGreaterThan(0)
    })

    it('should show back link to form overview', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest
        .mocked(audit.getFormHistory)
        .mockResolvedValueOnce(
          createMockAuditResponse([createMockAuditRecord()])
        )

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { document } = await renderResponse(server, options)

      const $backLink = document.querySelector('.govuk-back-link')
      expect($backLink).toBeInTheDocument()
      expect($backLink).toHaveAttribute('href', '/library/my-form-slug')
    })

    it('should handle empty audit records', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest
        .mocked(audit.getFormHistory)
        .mockResolvedValueOnce(createMockAuditResponse([]))

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { document } = await renderResponse(server, options)

      // Should show empty message
      const $emptyMessage = document.querySelector('.govuk-body')
      expect($emptyMessage).toHaveTextContent('No history available.')
    })

    it('should consolidate consecutive edit events by same user', async () => {
      const userId = 'user-1'
      const auditRecords = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T16:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T15:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T14:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        })
      ]

      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest
        .mocked(audit.getFormHistory)
        .mockResolvedValueOnce(createMockAuditResponse(auditRecords))

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { document } = await renderResponse(server, options)

      // Should show consolidated entry
      const $description = document.querySelector('.app-timeline__description')
      expect($description?.textContent).toMatch(/Edited the draft form 3 times/)
    })

    it('should work without draft form definition', async () => {
      const formWithoutDraft = { ...formMetadata, draft: undefined }

      jest.mocked(forms.get).mockResolvedValueOnce(formWithoutDraft)
      jest
        .mocked(audit.getFormHistory)
        .mockResolvedValueOnce(
          createMockAuditResponse([createMockAuditRecord()])
        )

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { container } = await renderResponse(server, options)

      // Caption + heading text combined
      const $heading = container.getByRole('heading', {
        name: 'Test form Form history',
        level: 1
      })
      expect($heading).toBeInTheDocument()
      expect(forms.getDraftFormDefinition).not.toHaveBeenCalled()
    })

    it('should pass pagination parameters to audit service', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest.mocked(audit.getFormHistory).mockResolvedValueOnce(
        createMockAuditResponse([createMockAuditRecord()], {
          page: 2,
          perPage: 10,
          totalItems: 50,
          totalPages: 5
        })
      )

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history?page=2&perPage=10',
        auth
      }

      await renderResponse(server, options)

      expect(audit.getFormHistory).toHaveBeenCalledWith(
        formMetadata.id,
        expect.any(String),
        { page: 2, perPage: 10 }
      )
    })

    it('should render pagination when multiple pages exist', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest.mocked(audit.getFormHistory).mockResolvedValueOnce(
        createMockAuditResponse([createMockAuditRecord()], {
          page: 1,
          perPage: 25,
          totalItems: 100,
          totalPages: 4
        })
      )

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { document } = await renderResponse(server, options)

      const $pagination = document.querySelector('.govuk-pagination')
      expect($pagination).toBeInTheDocument()
    })

    it('should not render pagination when only one page exists', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest.mocked(audit.getFormHistory).mockResolvedValueOnce(
        createMockAuditResponse([createMockAuditRecord()], {
          page: 1,
          perPage: 25,
          totalItems: 5,
          totalPages: 1
        })
      )

      const options = {
        method: 'GET',
        url: '/library/my-form-slug/history',
        auth
      }

      const { document } = await renderResponse(server, options)

      const $pagination = document.querySelector('.govuk-pagination')
      expect($pagination).not.toBeInTheDocument()
    })

    it('should redirect to first page when page exceeds total pages', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(formDefinition)
      jest.mocked(audit.getFormHistory).mockResolvedValueOnce(
        createMockAuditResponse([createMockAuditRecord()], {
          page: 10,
          perPage: 25,
          totalItems: 50,
          totalPages: 2
        })
      )

      const response = await server.inject({
        method: 'GET',
        url: '/library/my-form-slug/history?page=10&perPage=25',
        auth
      })

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/history?page=1&perPage=25'
      )
    })

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/library/my-form-slug/history?page=abc',
        auth
      })

      expect(response.statusCode).toBe(400)
    })

    it('should return 400 for negative page number', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/library/my-form-slug/history?page=-1',
        auth
      })

      expect(response.statusCode).toBe(400)
    })
  })
})

/**
 * @import { AuditRecord, FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
