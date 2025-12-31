import { AuditEventMessageType } from '@defra/forms-model'

import {
  buildTimelineItem,
  consolidateEditEvents,
  findConsecutiveEditGroup,
  getEventFriendlyName,
  historyViewModel,
  isConsolidatableEvent,
  isSameUser,
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

describe('history model', () => {
  describe('getEventFriendlyName', () => {
    it('returns correct friendly name for FORM_CREATED', () => {
      const result = getEventFriendlyName(AuditEventMessageType.FORM_CREATED)
      expect(result).toBe('Form created')
    })

    it('returns correct friendly name for FORM_UPDATED', () => {
      const result = getEventFriendlyName(AuditEventMessageType.FORM_UPDATED)
      expect(result).toBe('Draft edited')
    })

    it('returns correct friendly name for FORM_LIVE_CREATED_FROM_DRAFT', () => {
      const result = getEventFriendlyName(
        AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
      )
      expect(result).toBe('Form went live')
    })

    it('returns correct friendly name for FORM_DRAFT_CREATED_FROM_LIVE', () => {
      const result = getEventFriendlyName(
        AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE
      )
      expect(result).toBe('Draft created from live form')
    })

    it('returns correct friendly name for FORM_DRAFT_DELETED', () => {
      const result = getEventFriendlyName(
        AuditEventMessageType.FORM_DRAFT_DELETED
      )
      expect(result).toBe('Draft form deleted')
    })

    it('returns correct friendly name for FORM_TITLE_UPDATED', () => {
      const result = getEventFriendlyName(
        AuditEventMessageType.FORM_TITLE_UPDATED
      )
      expect(result).toBe('Form name updated')
    })

    it('returns correct friendly name for FORM_MIGRATED', () => {
      const result = getEventFriendlyName(AuditEventMessageType.FORM_MIGRATED)
      expect(result).toBe('Switched to new editor')
    })

    it('returns correct friendly name for FORM_SUBMISSION_EXCEL_REQUESTED', () => {
      const result = getEventFriendlyName(
        AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED
      )
      expect(result).toBe('Form submissions downloaded')
    })

    it('returns correct friendly name for FORM_CSAT_EXCEL_REQUESTED', () => {
      const result = getEventFriendlyName(
        AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
      )
      expect(result).toBe('User feedback downloaded')
    })

    it('returns "Unknown event" for unrecognized event type', () => {
      const result = getEventFriendlyName('UNKNOWN_EVENT_TYPE')
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

    it('marks form went live events correctly', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
      })

      const result = buildTimelineItem(record)

      expect(result.title).toBe('Form went live')
      expect(result.isFormWentLive).toBe(true)
    })
  })

  describe('isConsolidatableEvent', () => {
    it('returns true for FORM_UPDATED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_UPDATED
      })
      expect(isConsolidatableEvent(record)).toBe(true)
    })

    it('returns false for FORM_CREATED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_CREATED
      })
      expect(isConsolidatableEvent(record)).toBe(false)
    })

    it('returns false for FORM_LIVE_CREATED_FROM_DRAFT events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
      })
      expect(isConsolidatableEvent(record)).toBe(false)
    })

    it('returns false for FORM_TITLE_UPDATED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TITLE_UPDATED
      })
      expect(isConsolidatableEvent(record)).toBe(false)
    })
  })

  describe('isSameUser', () => {
    it('returns true when records have the same user id', () => {
      const record1 = createMockAuditRecord({
        createdBy: { id: 'user-123', displayName: 'Chris Smith' }
      })
      const record2 = createMockAuditRecord({
        createdBy: { id: 'user-123', displayName: 'Chris Smith' }
      })
      expect(isSameUser(record1, record2)).toBe(true)
    })

    it('returns false when records have different user ids', () => {
      const record1 = createMockAuditRecord({
        createdBy: { id: 'user-123', displayName: 'Chris Smith' }
      })
      const record2 = createMockAuditRecord({
        createdBy: { id: 'user-456', displayName: 'Alex Patel' }
      })
      expect(isSameUser(record1, record2)).toBe(false)
    })

    it('returns true even if display names differ but ids match', () => {
      const record1 = createMockAuditRecord({
        createdBy: { id: 'user-123', displayName: 'Chris Smith' }
      })
      const record2 = createMockAuditRecord({
        createdBy: { id: 'user-123', displayName: 'Christopher Smith' }
      })
      expect(isSameUser(record1, record2)).toBe(true)
    })
  })

  describe('findConsecutiveEditGroup', () => {
    it('finds all consecutive edits by the same user', () => {
      const userId = 'user-1'
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        })
      ]

      const { group, nextIndex } = findConsecutiveEditGroup(records, 0)

      expect(group).toHaveLength(3)
      expect(nextIndex).toBe(3)
    })

    it('stops at different user', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: 'user-1', displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: 'user-1', displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: 'user-2', displayName: 'Alex Patel' }
        })
      ]

      const { group, nextIndex } = findConsecutiveEditGroup(records, 0)

      expect(group).toHaveLength(2)
      expect(nextIndex).toBe(2)
    })

    it('stops at non-consolidatable event', () => {
      const userId = 'user-1'
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        })
      ]

      const { group, nextIndex } = findConsecutiveEditGroup(records, 0)

      expect(group).toHaveLength(1)
      expect(nextIndex).toBe(1)
    })

    it('returns single item group when no consecutive edits', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: 'user-1', displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_CREATED,
          createdBy: { id: 'user-1', displayName: 'Chris Smith' }
        })
      ]

      const { group, nextIndex } = findConsecutiveEditGroup(records, 0)

      expect(group).toHaveLength(1)
      expect(nextIndex).toBe(1)
    })

    it('works from middle of array', () => {
      const userId = 'user-1'
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_CREATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_UPDATED,
          createdBy: { id: userId, displayName: 'Chris Smith' }
        })
      ]

      const { group, nextIndex } = findConsecutiveEditGroup(records, 1)

      expect(group).toHaveLength(2)
      expect(group[0].id).toBe('2')
      expect(group[1].id).toBe('3')
      expect(nextIndex).toBe(3)
    })
  })

  describe('consolidateEditEvents', () => {
    it('returns empty array for empty input', () => {
      const result = consolidateEditEvents([])
      expect(result).toEqual([])
    })

    it('does not consolidate non-FORM_UPDATED events', () => {
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

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('Form created')
      expect(result[1].title).toBe('Form name updated')
      expect(result[2].title).toBe('Form went live')
    })

    it('consolidates consecutive FORM_UPDATED events by same user', () => {
      const userId = 'user-1'
      const records = [
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

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Draft edited')
      expect(result[0].isConsolidated).toBe(true)
      expect(result[0].count).toBe(3)
      expect(result[0].description).toMatch(
        /Edited the draft form 3 times between/
      )
    })

    it('does not consolidate FORM_UPDATED events by different users', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T16:30:00.000Z'),
          createdBy: { id: 'user-1', displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T15:30:00.000Z'),
          createdBy: { id: 'user-2', displayName: 'Alex Patel' }
        })
      ]

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(2)
      expect(result[0].isConsolidated).toBe(false)
      expect(result[1].isConsolidated).toBe(false)
    })

    it('stops consolidation when different event type interrupts', () => {
      const userId = 'user-1'
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T17:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T16:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
          createdAt: new Date('2019-06-14T15:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '4',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T14:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        })
      ]

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(3)
      expect(result[0].isConsolidated).toBe(true)
      expect(result[0].count).toBe(2)
      expect(result[1].title).toBe('Form went live')
      expect(result[2].isConsolidated).toBe(false)
    })

    it('shows time range for same-day edits', () => {
      const userId = 'user-1'
      const records = [
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
        })
      ]

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(1)
      expect(result[0].description).toMatch(/times between.*and/)
    })

    it('shows date range for multi-day edits', () => {
      const userId = 'user-1'
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-15T16:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_UPDATED,
          createdAt: new Date('2019-06-14T15:30:00.000Z'),
          createdBy: { id: userId, displayName: 'Chris Smith' }
        })
      ]

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(1)
      expect(result[0].description).toMatch(/14 June and 15 June/)
    })

    it('filters out no-change events from timeline', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_CREATED,
          createdAt: new Date('2019-06-14T16:00:00.000Z')
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
          createdAt: new Date('2019-06-14T15:00:00.000Z'),
          data: {
            formId: 'form-id',
            slug: 'test-form',
            changes: {
              previous: { teamName: 'Same Team' },
              new: { teamName: 'Same Team' }
            }
          }
        }),
        createMockAuditRecord({
          id: '3',
          type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
          createdAt: new Date('2019-06-14T15:00:00.000Z'),
          data: {
            formId: 'form-id',
            slug: 'test-form',
            changes: {
              previous: { teamEmail: 'same@example.gov.uk' },
              new: { teamEmail: 'same@example.gov.uk' }
            }
          }
        }),
        createMockAuditRecord({
          id: '4',
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
          createdAt: new Date('2019-06-14T14:00:00.000Z')
        })
      ]

      const result = consolidateEditEvents(records)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Form created')
      expect(result[1].title).toBe('Form went live')
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

      const result = historyViewModel(metadata, undefined, records)

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

      const result = historyViewModel(metadata, undefined, [])

      const historyNav = result.navigation.find(
        (nav) => nav.text === 'Form history'
      )
      expect(historyNav).toBeDefined()
      expect(historyNav?.isActive).toBe(true)
    })

    it('includes Responses in navigation', () => {
      const metadata = createMockFormMetadata()

      const result = historyViewModel(metadata, undefined, [])

      const responsesNav = result.navigation.find(
        (nav) => nav.text === 'Responses'
      )
      expect(responsesNav).toBeDefined()
      expect(responsesNav?.url).toBe('/library/test-form/editor-v2/responses')
    })

    it('handles empty records', () => {
      const metadata = createMockFormMetadata()
      const result = historyViewModel(metadata, undefined, [])

      expect(result.items).toHaveLength(0)
      expect(result.hasItems).toBe(false)
    })
  })
})

/**
 * @import { AuditRecord, FormMetadata } from '@defra/forms-model'
 */
