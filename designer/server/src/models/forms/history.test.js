import { AuditEventMessageType } from '@defra/forms-model'

import {
  PAYMENT_LIVE_API_KEY,
  PAYMENT_TEST_API_KEY
} from '~/src/lib/secrets.js'
import {
  buildTimelineItem,
  buildTimelineItems,
  getEventFriendlyName,
  historyViewModel,
  overviewHistoryViewModel
} from '~/src/models/forms/history.js'

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
    entityId: '694c11d3c664844dfdaf7719',
    createdAt: new Date('2025-06-14T14:01:00.000Z'),
    createdBy: {
      id: '86758ba9-92e7-4287-9751-7705e449688e',
      displayName: 'Chris Smith'
    },
    data: {
      formId: '694c11d3c664844dfdaf7719',
      slug: 'test-form',
      title: 'Test Form',
      organisation: 'Defra',
      teamName: 'Test Team',
      teamEmail: 'test@example.gov.uk'
    },
    messageCreatedAt: new Date('2025-06-14T14:01:00.100Z'),
    recordCreatedAt: new Date('2025-06-14T14:01:00.200Z'),
    ...overrides
  })
}

/**
 * Creates a mock consolidated audit record
 * @param {Partial<ConsolidatedAuditRecord>} [overrides]
 * @returns {ConsolidatedAuditRecord}
 */
function createMockConsolidatedRecord(overrides = {}) {
  return /** @type {ConsolidatedAuditRecord} */ ({
    id: '68948579d5659369f1e634c6',
    messageId: '46bcc5ee-49e7-4eb9-9b2b-02e41faa7ec1',
    category: 'FORM',
    type: AuditEventMessageType.FORM_UPDATED,
    schemaVersion: 1,
    source: 'FORMS_MANAGER',
    entityId: '694c11d3c664844dfdaf7719',
    createdAt: new Date('2019-06-14T16:30:00.000Z'),
    createdBy: {
      id: '86758ba9-92e7-4287-9751-7705e449688e',
      displayName: 'Chris Smith'
    },
    data: {
      formId: '694c11d3c664844dfdaf7719',
      slug: 'test-form',
      requestType: 'UPDATE_COMPONENT'
    },
    messageCreatedAt: new Date('2019-06-14T16:30:00.100Z'),
    recordCreatedAt: new Date('2019-06-14T16:30:00.200Z'),
    consolidatedCount: 3,
    consolidatedFrom: new Date('2019-06-14T14:30:00.000Z'),
    consolidatedTo: new Date('2019-06-14T16:30:00.000Z'),
    ...overrides
  })
}

/**
 * Creates a mock form metadata
 * @returns {FormMetadata}
 */
function createMockFormMetadata() {
  return /** @type {FormMetadata} */ ({
    id: '694c11d3c664844dfdaf7719',
    slug: 'test-form',
    title: 'Test Form',
    organisation: 'Defra',
    teamName: 'Test Team',
    teamEmail: 'test@example.gov.uk',
    draft: {
      createdAt: new Date('2025-06-14T14:01:00.000Z'),
      createdBy: { id: 'user-1', displayName: 'Test User' },
      updatedAt: new Date('2025-06-14T14:01:00.000Z'),
      updatedBy: { id: 'user-1', displayName: 'Test User' }
    },
    createdAt: new Date('2025-06-14T14:01:00.000Z'),
    createdBy: { id: 'user-1', displayName: 'Test User' },
    updatedAt: new Date('2025-06-14T14:01:00.000Z'),
    updatedBy: { id: 'user-1', displayName: 'Test User' }
  })
}

/**
 * Creates a mock audit response with pagination
 * @param {(AuditRecord | ConsolidatedAuditRecord)[]} records
 * @param {object} [paginationOverrides]
 * @returns {AuditResponse}
 */
function createMockAuditResponse(records, paginationOverrides = {}) {
  return /** @type {AuditResponse} */ ({
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
  })
}

describe('history model', () => {
  describe('getEventFriendlyName', () => {
    it('returns correct friendly name for FORM_CREATED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_CREATED
        })
      )
      expect(result).toBe('Form created')
    })

    it('returns correct friendly name for FORM_UPDATED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_UPDATED
        })
      )
      expect(result).toBe('Draft edited')
    })

    it('returns correct friendly name for FORM_LIVE_CREATED_FROM_DRAFT', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
        })
      )
      expect(result).toBe('Form published')
    })

    it('returns correct friendly name for FORM_DRAFT_CREATED_FROM_LIVE', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE
        })
      )
      expect(result).toBe('Draft created from live form')
    })

    it('returns correct friendly name for FORM_DRAFT_DELETED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_DRAFT_DELETED
        })
      )
      expect(result).toBe('Draft form deleted')
    })

    it('returns correct friendly name for FORM_TITLE_UPDATED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_TITLE_UPDATED
        })
      )
      expect(result).toBe('Form name updated')
    })

    it('returns correct friendly name for FORM_MIGRATED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_MIGRATED
        })
      )
      expect(result).toBe('Switched to new editor')
    })

    it('returns correct friendly name for FORM_SUBMISSION_EXCEL_REQUESTED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED
        })
      )
      expect(result).toBe('Form submissions downloaded')
    })

    it('returns correct friendly name for FORM_CSAT_EXCEL_REQUESTED', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
        })
      )
      expect(result).toBe('User feedback downloaded')
    })

    it('returns correct friendly name for FORM_SECRET_SAVED - test api key', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_SECRET_SAVED,
          data: { secretName: PAYMENT_TEST_API_KEY }
        })
      )
      expect(result).toBe('Test payment API key saved')
    })

    it('returns correct friendly name for FORM_SECRET_SAVED - live api key', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_SECRET_SAVED,
          data: { secretName: PAYMENT_LIVE_API_KEY }
        })
      )
      expect(result).toBe('Live payment API key saved')
    })

    it('returns correct friendly name for FORM_SECRET_SAVED - other secret name', () => {
      const result = getEventFriendlyName(
        /** @type {AuditRecord} */ ({
          type: AuditEventMessageType.FORM_SECRET_SAVED,
          data: { secretName: 'other-secret' }
        })
      )
      expect(result).toBe('Secret with name other-secret saved')
    })

    it('returns "Unknown event" for unrecognized event type', () => {
      // @ts-expect-error - invalid type for testing
      const result = getEventFriendlyName({ type: 'UNKNOWN_EVENT_TYPE' })
      expect(result).toBe('Unknown event')
    })
  })

  describe('buildTimelineItem', () => {
    it('builds a timeline item with all properties', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_CREATED,
        createdAt: new Date('2019-06-14T14:01:00.000Z'),
        createdBy: { id: 'user-1', displayName: 'Chris Smith' }
      })

      const result = buildTimelineItem(record)

      expect(result.title).toBe('Form created')
      expect(result.user).toBe('Chris Smith')
      expect(result.date).toMatch(/14 June 2019 at/)
      expect(result.isConsolidated).toBe(false)
      expect(result.isFormWentLive).toBe(false)
    })

    it('marks form published events correctly', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
      })

      const result = buildTimelineItem(record)

      expect(result.title).toBe('Form published')
      expect(result.isFormWentLive).toBe(true)
    })
  })

  describe('buildTimelineItems', () => {
    it('returns empty array for empty input', () => {
      const result = buildTimelineItems([])
      expect(result).toEqual([])
    })

    it('builds timeline items for regular records', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_CREATED,
          createdAt: new Date('2019-06-14T14:03:00.000Z')
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_TITLE_UPDATED,
          createdAt: new Date('2019-06-14T14:02:00.000Z'),
          data: {
            formId: 'form-id',
            slug: 'test-form',
            changes: {
              previous: { title: 'Old Title' },
              new: { title: 'New Title' }
            }
          }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
          createdAt: new Date('2019-06-14T14:01:00.000Z')
        })
      ]

      const result = buildTimelineItems(records)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('Form created')
      expect(result[1].title).toBe('Form name updated')
      expect(result[2].title).toBe('Form published')
    })

    it('handles pre-consolidated records from API', () => {
      const consolidatedRecord = createMockConsolidatedRecord({
        consolidatedCount: 3,
        consolidatedFrom: new Date('2019-06-14T14:30:00.000Z'),
        consolidatedTo: new Date('2019-06-14T16:30:00.000Z')
      })

      const result = buildTimelineItems([consolidatedRecord])

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Draft edited')
      expect(result[0].isConsolidated).toBe(true)
      expect(result[0].count).toBe(3)
      expect(result[0].description).toMatch(
        /Edited the draft form 3 times between/
      )
    })

    it('handles mix of regular and consolidated records', () => {
      const records = [
        createMockConsolidatedRecord({
          id: '1',
          consolidatedCount: 5,
          consolidatedFrom: new Date('2019-06-14T14:00:00.000Z'),
          consolidatedTo: new Date('2019-06-14T16:00:00.000Z')
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
          createdAt: new Date('2019-06-14T13:00:00.000Z')
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_CREATED,
          createdAt: new Date('2019-06-14T12:00:00.000Z')
        })
      ]

      const result = buildTimelineItems(records)

      expect(result).toHaveLength(3)
      expect(result[0].isConsolidated).toBe(true)
      expect(result[0].count).toBe(5)
      expect(result[1].title).toBe('Form published')
      expect(result[1].isConsolidated).toBe(false)
      expect(result[2].title).toBe('Form created')
    })

    it('shows time range for same-day consolidated edits', () => {
      const consolidatedRecord = createMockConsolidatedRecord({
        consolidatedCount: 2,
        consolidatedFrom: new Date('2019-06-14T15:30:00.000Z'),
        consolidatedTo: new Date('2019-06-14T16:30:00.000Z')
      })

      const result = buildTimelineItems([consolidatedRecord])

      expect(result).toHaveLength(1)
      expect(result[0].description).toMatch(/times between.*and/)
    })

    it('shows date range for multi-day consolidated edits', () => {
      const consolidatedRecord = createMockConsolidatedRecord({
        consolidatedCount: 2,
        consolidatedFrom: new Date('2019-06-14T15:30:00.000Z'),
        consolidatedTo: new Date('2019-06-15T16:30:00.000Z')
      })

      const result = buildTimelineItems([consolidatedRecord])

      expect(result).toHaveLength(1)
      expect(result[0].description).toMatch(/14 June and 15 June/)
    })
  })

  describe('overviewHistoryViewModel', () => {
    it('returns view model with heading and items', () => {
      const metadata = createMockFormMetadata()
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_CREATED
        })
      ]

      const result = overviewHistoryViewModel(metadata, records)

      expect(result.heading.text).toBe('History')
      expect(result.heading.size).toBe('medium')
      expect(result.heading.level).toBe('3')
      expect(result.items).toHaveLength(1)
      expect(result.hasItems).toBe(true)
      expect(result.viewFullHistoryLink.text).toBe('View full history')
      expect(result.viewFullHistoryLink.href).toBe('/library/test-form/history')
    })

    it('limits items to 5', () => {
      const metadata = createMockFormMetadata()
      const records = Array.from({ length: 10 }, (_, i) =>
        createMockAuditRecord({
          id: String(i),
          type: AuditEventMessageType.FORM_CREATED,
          createdAt: new Date(2019, 5, 14, 14, i)
        })
      )

      const result = overviewHistoryViewModel(metadata, records)

      expect(result.items).toHaveLength(5)
    })

    it('handles empty records', () => {
      const metadata = createMockFormMetadata()
      const result = overviewHistoryViewModel(metadata, [])

      expect(result.items).toHaveLength(0)
      expect(result.hasItems).toBe(false)
    })

    it('handles consolidated records from API', () => {
      const metadata = createMockFormMetadata()
      const records = [
        createMockConsolidatedRecord({
          consolidatedCount: 10,
          consolidatedFrom: new Date('2019-06-14T10:00:00.000Z'),
          consolidatedTo: new Date('2019-06-14T16:00:00.000Z')
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_CREATED
        })
      ]

      const result = overviewHistoryViewModel(metadata, records)

      expect(result.items).toHaveLength(2)
      expect(result.items[0].isConsolidated).toBe(true)
      expect(result.items[0].count).toBe(10)
      expect(result.items[1].isConsolidated).toBe(false)
    })
  })

  describe('historyViewModel', () => {
    it('returns full history view model', () => {
      const metadata = createMockFormMetadata()
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_CREATED
        })
      ]
      const auditResponse = createMockAuditResponse(records)

      const result = historyViewModel(metadata, undefined, auditResponse)

      expect(result.pageTitle).toBe('Form history')
      expect(result.pageHeading.text).toBe('Form history')
      expect(result.caption.text).toBe('Test Form')
      expect(result.backLink.href).toBe('/library/test-form')
      expect(result.items).toHaveLength(1)
      expect(result.hasItems).toBe(true)
      expect(result.form).toBe(metadata)
    })

    it('includes navigation with Form history as active', () => {
      const metadata = createMockFormMetadata()
      const auditResponse = createMockAuditResponse([])

      const result = historyViewModel(metadata, undefined, auditResponse)

      const historyNav = result.navigation.find(
        (nav) => nav.text === 'Form history'
      )
      expect(historyNav).toBeDefined()
      expect(historyNav?.isActive).toBe(true)
    })

    it('includes Responses in navigation', () => {
      const metadata = createMockFormMetadata()
      const auditResponse = createMockAuditResponse([])

      const result = historyViewModel(metadata, undefined, auditResponse)

      const responsesNav = result.navigation.find(
        (nav) => nav.text === 'Responses'
      )
      expect(responsesNav).toBeDefined()
      expect(responsesNav?.url).toBe('/library/test-form/editor-v2/responses')
    })

    it('handles empty records', () => {
      const metadata = createMockFormMetadata()
      const auditResponse = createMockAuditResponse([])

      const result = historyViewModel(metadata, undefined, auditResponse)

      expect(result.items).toHaveLength(0)
      expect(result.hasItems).toBe(false)
    })

    it('includes pagination data from audit response', () => {
      const metadata = createMockFormMetadata()
      const records = [createMockAuditRecord()]
      const auditResponse = createMockAuditResponse(records, {
        page: 2,
        perPage: 10,
        totalItems: 50,
        totalPages: 5
      })

      const result = historyViewModel(metadata, undefined, auditResponse)

      expect(result.pagination).toBeDefined()
      expect(result.pagination?.page).toBe(2)
      expect(result.pagination?.perPage).toBe(10)
      expect(result.pagination?.totalItems).toBe(50)
      expect(result.pagination?.totalPages).toBe(5)
    })

    it('builds pagination pages array', () => {
      const metadata = createMockFormMetadata()
      const records = [createMockAuditRecord()]
      const auditResponse = createMockAuditResponse(records, {
        page: 1,
        perPage: 25,
        totalItems: 100,
        totalPages: 4
      })

      const result = historyViewModel(metadata, undefined, auditResponse)

      expect(result.pagination?.pages).toBeDefined()
      expect(result.pagination?.pages.length).toBeGreaterThan(0)
    })

    it('marks current page in pagination pages', () => {
      const metadata = createMockFormMetadata()
      const records = [createMockAuditRecord()]
      const auditResponse = createMockAuditResponse(records, {
        page: 2,
        perPage: 25,
        totalItems: 100,
        totalPages: 4
      })

      const result = historyViewModel(metadata, undefined, auditResponse)

      const currentPage = result.pagination?.pages.find((p) => p.number === '2')
      expect(currentPage?.current).toBe(true)
    })

    it('handles consolidated records from API', () => {
      const metadata = createMockFormMetadata()
      const records = [
        createMockConsolidatedRecord({
          consolidatedCount: 15
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
        })
      ]
      const auditResponse = createMockAuditResponse(records)

      const result = historyViewModel(metadata, undefined, auditResponse)

      expect(result.items).toHaveLength(2)
      expect(result.items[0].isConsolidated).toBe(true)
      expect(result.items[0].count).toBe(15)
      expect(result.items[1].title).toBe('Form published')
    })
  })
})

/**
 * @import { AuditRecord, ConsolidatedAuditRecord, FormMetadata } from '@defra/forms-model'
 * @import { AuditResponse } from '~/src/lib/audit.js'
 */
