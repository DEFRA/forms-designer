import { AuditEventMessageType } from '@defra/forms-model'

import { getEventDescription } from '~/src/models/forms/history-event-descriptions.js'

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

describe('history-event-descriptions', () => {
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
        "Updated the support email address to 'support@defra.gov.uk' and email response time to '22'."
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
        "Updated the support online contact link to 'https://www.gov.uk/guidance/contact-defra' and online contact text to 'some link'."
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
})

/**
 * @import { AuditRecord } from '@defra/forms-model'
 */
