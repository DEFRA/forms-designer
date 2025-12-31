import { AuditEventMessageType } from '@defra/forms-model'

import {
  buildTimelineItem,
  consolidateEditEvents,
  filterNoChangeEvents,
  findConsecutiveEditGroup,
  formatHistoryDate,
  formatShortDate,
  formatTime,
  getEventDescription,
  getEventFriendlyName,
  hasActualChange,
  historyViewModel,
  isConsolidatableEvent,
  isSameDay,
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

  describe('formatHistoryDate', () => {
    it('formats a Date object correctly', () => {
      const date = new Date('2019-06-14T14:01:00.000Z')
      const result = formatHistoryDate(date)
      expect(result).toMatch(/14 June 2019 at/)
    })

    it('formats a date string correctly', () => {
      const result = formatHistoryDate('2019-06-14T14:01:00.000Z')
      expect(result).toMatch(/14 June 2019 at/)
    })
  })

  describe('formatTime', () => {
    it('formats a time correctly', () => {
      const date = new Date('2019-06-14T15:30:00.000Z')
      const result = formatTime(date)
      // Result will depend on timezone, but should contain a time pattern
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(am|pm)/i)
    })

    it('handles string input', () => {
      const result = formatTime('2019-06-14T15:30:00.000Z')
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(am|pm)/i)
    })
  })

  describe('formatShortDate', () => {
    it('formats a short date correctly', () => {
      const date = new Date('2019-06-14T14:01:00.000Z')
      const result = formatShortDate(date)
      expect(result).toBe('14 June')
    })

    it('handles string input', () => {
      const result = formatShortDate('2019-06-14T14:01:00.000Z')
      expect(result).toBe('14 June')
    })
  })

  describe('isSameDay', () => {
    it('returns true for dates on the same day', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2019-06-14T23:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('returns false for dates on different days', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2019-06-15T10:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('handles string inputs', () => {
      expect(
        isSameDay('2019-06-14T10:00:00.000Z', '2019-06-14T23:00:00.000Z')
      ).toBe(true)
    })

    it('returns false for different months', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2019-07-14T10:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('returns false for different years', () => {
      const date1 = new Date('2019-06-14T10:00:00.000Z')
      const date2 = new Date('2020-06-14T10:00:00.000Z')
      expect(isSameDay(date1, date2)).toBe(false)
    })
  })

  describe('getEventDescription', () => {
    it('returns description for FORM_CREATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_CREATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          title: 'Employee Onboarding',
          organisation: 'Defra',
          teamName: 'Dev team',
          teamEmail: 'dev@defra.com'
        }
      })

      const result = getEventDescription(record)
      expect(result).toContain("Created a new form named 'Employee Onboarding'")
      expect(result).toContain("the lead organisation as 'Defra'")
      expect(result).toContain("the team name as 'Dev team'")
      expect(result).toContain(
        "the shared team email address as 'dev@defra.com'"
      )
    })

    it('returns description for FORM_TITLE_UPDATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TITLE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { title: 'Old Title' },
            new: { title: 'New Title' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the form name from 'Old Title' to 'New Title'."
      )
    })

    it('returns description for FORM_ORGANISATION_UPDATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_ORGANISATION_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { organisation: 'Defra' },
            new: { organisation: 'APHA' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Changed the lead organisation from 'Defra' to 'APHA'."
      )
    })

    it('returns description for FORM_NOTIFICATION_EMAIL_UPDATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { notificationEmail: 'old@example.com' },
            new: { notificationEmail: 'new@example.com' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated where submitted forms are sent from 'old@example.com' to 'new@example.com'."
      )
    })

    it('returns description for new value only when no previous value', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: {},
            new: { privacyNoticeUrl: 'http://new.url' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe("Set the privacy notice link to 'http://new.url'.")
    })

    it('returns description for FORM_LIVE_CREATED_FROM_DRAFT event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
        data: undefined
      })

      const result = getEventDescription(record)
      expect(result).toBe('Made the form live.')
    })

    it('returns description for FORM_DRAFT_CREATED_FROM_LIVE event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE,
        data: undefined
      })

      const result = getEventDescription(record)
      expect(result).toBe('Created a draft version of the live form.')
    })

    it('returns description for FORM_JSON_DOWNLOADED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_JSON_DOWNLOADED,
        data: undefined
      })

      const result = getEventDescription(record)
      expect(result).toBe('Exported the form in JSON format.')
    })

    it('returns description for FORM_SUBMISSION_EXCEL_REQUESTED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED,
        data: undefined
      })

      const result = getEventDescription(record)
      expect(result).toBe('Downloaded form submissions.')
    })

    it('returns description for FORM_CSAT_EXCEL_REQUESTED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED,
        data: undefined
      })

      const result = getEventDescription(record)
      expect(result).toBe('Downloaded user feedback.')
    })

    it('returns undefined for unknown event types', () => {
      const record = createMockAuditRecord({
        type: /** @type {any} */ ('UNKNOWN_TYPE'),
        data: /** @type {any} */ ({ some: 'data' })
      })

      const result = getEventDescription(record)
      expect(result).toBeUndefined()
    })

    it('returns description for FORM_SUPPORT_PHONE_UPDATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { phone: '01234567890' },
            new: { phone: '07987654321' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the support phone number from '01234567890' to '07987654321'."
      )
    })

    it('returns description for FORM_SUPPORT_EMAIL_UPDATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { address: 'old@defra.gov.uk' },
            new: { address: 'new@defra.gov.uk' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the support email address from 'old@defra.gov.uk' to 'new@defra.gov.uk'."
      )
    })

    it('returns description for FORM_SUPPORT_ONLINE_UPDATED event', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { url: 'http://old.link' },
            new: { url: 'http://new.link' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the support contact link from 'http://old.link' to 'http://new.link'."
      )
    })

    it('returns description for FORM_SUPPORT_CONTACT_UPDATED with phone change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: {},
            new: { contact: { phone: '07877877888' } }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe("Updated the support phone number to '07877877888'.")
    })

    it('returns description for FORM_SUPPORT_CONTACT_UPDATED with email change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { phone: '07877877888' } },
            new: {
              contact: {
                phone: '07877877888',
                email: { address: 'support@defra.gov.uk', responseTime: '22' }
              }
            }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the support email address to 'support@defra.gov.uk'."
      )
    })

    it('returns description for FORM_SUPPORT_CONTACT_UPDATED with online link change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { phone: '07877877888' } },
            new: {
              contact: {
                phone: '07877877888',
                online: {
                  url: 'https://www.gov.uk/guidance/contact-defra',
                  text: 'some link'
                }
              }
            }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the support online contact link to 'https://www.gov.uk/guidance/contact-defra'."
      )
    })

    it('returns description for FORM_SUPPORT_CONTACT_UPDATED with multiple changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: /** @type {any} */ ({
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: {},
            new: {
              contact: {
                phone: '07877877888',
                email: { address: 'support@defra.gov.uk' },
                online: { url: 'https://www.gov.uk' }
              }
            }
          }
        })
      })

      const result = getEventDescription(record)
      expect(result).toContain('phone number')
      expect(result).toContain('email address')
      expect(result).toContain('online contact link')
    })

    it('returns undefined for FORM_SUPPORT_CONTACT_UPDATED with no actual changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { phone: '07877877888' } },
            new: { contact: { phone: '07877877888' } }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBeUndefined()
    })

    it('returns description for FORM_JSON_UPLOADED event with filename', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_JSON_UPLOADED,
        data: /** @type {any} */ ({
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: {},
            new: { value: 'myform.json' }
          }
        })
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Uploaded a form using a JSON file named 'myform.json'."
      )
    })

    it('returns undefined for FORM_JSON_UPLOADED event without filename', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_JSON_UPLOADED,
        data: /** @type {any} */ ({
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: {},
            new: {}
          }
        })
      })

      const result = getEventDescription(record)
      expect(result).toBeUndefined()
    })

    it('returns description for FORM_MIGRATED event with form name', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_MIGRATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          title: 'Employee Survey'
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Switched the form named 'Employee Survey' to the new editor."
      )
    })

    it('returns description for FORM_MIGRATED event without form name', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_MIGRATED,
        data: {
          formId: 'form-id',
          slug: 'test-form'
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe('Switched to the new editor.')
    })

    it('returns description for FORM_DRAFT_DELETED event with form name', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_DRAFT_DELETED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          title: 'Test Form'
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe("Deleted the form named 'Test Form'.")
    })

    it('returns description for FORM_DRAFT_DELETED event without form name', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_DRAFT_DELETED,
        data: undefined
      })

      const result = getEventDescription(record)
      expect(result).toBe('Deleted the draft form.')
    })

    it('returns undefined when old and new values are identical (no-change)', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamName: 'some team' },
            new: { teamName: 'some team' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBeUndefined()
    })

    it('returns undefined when team email old and new values are identical', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamEmail: 'name@example.gov.uk' },
            new: { teamEmail: 'name@example.gov.uk' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBeUndefined()
    })

    it('returns description for FORM_TEAM_NAME_UPDATED with actual change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamName: 'Old Team' },
            new: { teamName: 'New Team' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Changed the team name from 'Old Team' to 'New Team'."
      )
    })

    it('returns description for FORM_TEAM_EMAIL_UPDATED with actual change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamEmail: 'old@example.gov.uk' },
            new: { teamEmail: 'new@example.gov.uk' }
          }
        }
      })

      const result = getEventDescription(record)
      expect(result).toBe(
        "Updated the shared team address from 'old@example.gov.uk' to 'new@example.gov.uk'."
      )
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
      // Should show times since it's the same day
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

  describe('hasActualChange', () => {
    it('returns true for FORM_CREATED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_CREATED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_UPDATED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_UPDATED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_LIVE_CREATED_FROM_DRAFT events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_DRAFT_CREATED_FROM_LIVE events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_DRAFT_DELETED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_DRAFT_DELETED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_MIGRATED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_MIGRATED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_JSON_UPLOADED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_JSON_UPLOADED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_JSON_DOWNLOADED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_JSON_DOWNLOADED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_SUBMISSION_EXCEL_REQUESTED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for FORM_CSAT_EXCEL_REQUESTED events', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true when title actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TITLE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { title: 'Old Title' },
            new: { title: 'New Title' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when title has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TITLE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { title: 'Same Title' },
            new: { title: 'Same Title' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when organisation actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_ORGANISATION_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { organisation: 'Defra' },
            new: { organisation: 'APHA' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when organisation has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_ORGANISATION_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { organisation: 'Defra' },
            new: { organisation: 'Defra' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when team name actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamName: 'Old Team' },
            new: { teamName: 'New Team' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when team name has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamName: 'Same Team' },
            new: { teamName: 'Same Team' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when team email actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamEmail: 'old@example.gov.uk' },
            new: { teamEmail: 'new@example.gov.uk' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when team email has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { teamEmail: 'same@example.gov.uk' },
            new: { teamEmail: 'same@example.gov.uk' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when notification email actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { notificationEmail: 'old@example.com' },
            new: { notificationEmail: 'new@example.com' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when notification email has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { notificationEmail: 'same@example.com' },
            new: { notificationEmail: 'same@example.com' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when privacy notice actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { privacyNoticeUrl: 'http://old.url' },
            new: { privacyNoticeUrl: 'http://new.url' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when privacy notice has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { privacyNoticeUrl: 'http://same.url' },
            new: { privacyNoticeUrl: 'http://same.url' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when submission guidance actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { submissionGuidance: 'Old guidance' },
            new: { submissionGuidance: 'New guidance' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when submission guidance has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { submissionGuidance: 'Same guidance' },
            new: { submissionGuidance: 'Same guidance' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when support phone actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { phone: '01onal234567890' },
            new: { phone: '07987654321' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when support phone has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { phone: '01234567890' },
            new: { phone: '01234567890' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when support email actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { address: 'old@defra.gov.uk' },
            new: { address: 'new@defra.gov.uk' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when support email has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { address: 'same@defra.gov.uk' },
            new: { address: 'same@defra.gov.uk' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when support online link actually changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { url: 'http://old.link' },
            new: { url: 'http://new.link' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns false when support online link has no change', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { url: 'http://same.link' },
            new: { url: 'http://same.link' }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns false when support contact has no actual changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { phone: '07877877888' } },
            new: { contact: { phone: '07877877888' } }
          }
        }
      })
      expect(hasActualChange(record)).toBe(false)
    })

    it('returns true when support contact phone changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: {
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { phone: '07877877888' } },
            new: { contact: { phone: '07999999999' } }
          }
        }
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true when support contact email changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: /** @type {any} */ ({
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { email: { address: 'old@defra.gov.uk' } } },
            new: { contact: { email: { address: 'new@defra.gov.uk' } } }
          }
        })
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true when support contact online link changes', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED,
        data: /** @type {any} */ ({
          formId: 'form-id',
          slug: 'test-form',
          changes: {
            previous: { contact: { online: { url: 'http://old.link' } } },
            new: { contact: { online: { url: 'http://new.link' } } }
          }
        })
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true for unknown event types', () => {
      const record = createMockAuditRecord({
        type: /** @type {any} */ ('UNKNOWN_EVENT_TYPE'),
        data: /** @type {any} */ ({ some: 'data' })
      })
      expect(hasActualChange(record)).toBe(true)
    })

    it('returns true when event with changes has no data', () => {
      const record = createMockAuditRecord({
        type: AuditEventMessageType.FORM_TITLE_UPDATED,
        data: undefined
      })
      expect(hasActualChange(record)).toBe(true)
    })
  })

  describe('filterNoChangeEvents', () => {
    it('removes events with no actual changes', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_CREATED
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
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
          type: AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
        })
      ]

      const result = filterNoChangeEvents(records)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('1')
      expect(result[1].id).toBe('3')
    })

    it('keeps events with actual changes', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
          data: {
            formId: 'form-id',
            slug: 'test-form',
            changes: {
              previous: { teamName: 'Old Team' },
              new: { teamName: 'New Team' }
            }
          }
        })
      ]

      const result = filterNoChangeEvents(records)

      expect(result).toHaveLength(1)
    })

    it('returns empty array when all events have no changes', () => {
      const records = [
        createMockAuditRecord({
          id: '1',
          type: AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
          data: {
            formId: 'form-id',
            slug: 'test-form',
            changes: {
              previous: { teamName: 'Same' },
              new: { teamName: 'Same' }
            }
          }
        }),
        createMockAuditRecord({
          id: '2',
          type: AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
          data: {
            formId: 'form-id',
            slug: 'test-form',
            changes: {
              previous: { teamEmail: 'same@example.gov.uk' },
              new: { teamEmail: 'same@example.gov.uk' }
            }
          }
        })
      ]

      const result = filterNoChangeEvents(records)

      expect(result).toHaveLength(0)
    })
  })

  describe('consolidateEditEvents with no-change filtering', () => {
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

      // Only FORM_CREATED and FORM_LIVE_CREATED_FROM_DRAFT should remain
      // The two no-change events should be filtered out
      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Form created')
      expect(result[1].title).toBe('Form went live')
    })
  })
})

/**
 * @import { AuditRecord, FormMetadata } from '@defra/forms-model'
 */
