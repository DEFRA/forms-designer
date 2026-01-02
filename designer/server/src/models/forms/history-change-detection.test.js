import { AuditEventMessageType } from '@defra/forms-model'

import {
  filterNoChangeEvents,
  hasActualChange
} from '~/src/models/forms/history-change-detection.js'

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

describe('history-change-detection', () => {
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
            previous: { phone: '01234567890' },
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
})

/**
 * @import { AuditRecord } from '@defra/forms-model'
 */
