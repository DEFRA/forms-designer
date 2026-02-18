import {
  alwaysValidEvents,
  fieldConfigs,
  isConsolidatedRecord,
  supportContactFields
} from '~/src/form/form-audit/consolidation.js'
import { AuditEventMessageType } from '~/src/form/form-audit/enums.js'
import {
  type AuditRecord,
  type ConsolidatedAuditRecord
} from '~/src/form/form-audit/types.js'

describe('consolidation', () => {
  describe('fieldConfigs', () => {
    it.each([
      [
        AuditEventMessageType.FORM_TITLE_UPDATED,
        'the form name',
        'Updated',
        'changes.previous.title',
        'changes.new.title'
      ],
      [
        AuditEventMessageType.FORM_ORGANISATION_UPDATED,
        'the lead organisation',
        'Changed',
        'changes.previous.organisation',
        'changes.new.organisation'
      ],
      [
        AuditEventMessageType.FORM_TEAM_NAME_UPDATED,
        'the team name',
        'Changed',
        'changes.previous.teamName',
        'changes.new.teamName'
      ],
      [
        AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED,
        'the shared team address',
        'Updated',
        'changes.previous.teamEmail',
        'changes.new.teamEmail'
      ],
      [
        AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED,
        'where submitted forms are sent',
        'Updated',
        'changes.previous.notificationEmail',
        'changes.new.notificationEmail'
      ],
      [
        AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED,
        'the next steps guidance',
        'Updated',
        'changes.previous.submissionGuidance',
        'changes.new.submissionGuidance'
      ],
      [
        AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED,
        'the support phone number',
        'Updated',
        'changes.previous.phone',
        'changes.new.phone'
      ],
      [
        AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED,
        'the support email address',
        'Updated',
        'changes.previous.address',
        'changes.new.address'
      ],
      [
        AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED,
        'the support contact link',
        'Updated',
        'changes.previous.url',
        'changes.new.url'
      ]
    ])(
      'should have correct configuration for %s',
      (eventType, label, verb, prevPath, newPath) => {
        expect(fieldConfigs[eventType]).toEqual({
          label,
          verb,
          prevPath,
          newPath
        })
      }
    )

    it('should have exactly 9 field configurations', () => {
      expect(Object.keys(fieldConfigs)).toHaveLength(9)
    })

    it('should return undefined for non-existent event type', () => {
      expect(fieldConfigs.NON_EXISTENT_EVENT).toBeUndefined()
    })
  })

  describe('supportContactFields', () => {
    it.each([
      [
        'phone number',
        'changes.previous.contact.phone',
        'changes.new.contact.phone'
      ],
      [
        'email address',
        'changes.previous.contact.email.address',
        'changes.new.contact.email.address'
      ],
      [
        'email response time',
        'changes.previous.contact.email.responseTime',
        'changes.new.contact.email.responseTime'
      ],
      [
        'online contact link',
        'changes.previous.contact.online.url',
        'changes.new.contact.online.url'
      ],
      [
        'online contact text',
        'changes.previous.contact.online.text',
        'changes.new.contact.online.text'
      ]
    ])(
      'should have correct configuration for %s',
      (label, prevPath, newPath) => {
        const config = supportContactFields.find((f) => f.label === label)
        expect(config).toEqual({ label, prevPath, newPath })
      }
    )

    it('should have exactly 5 support contact fields', () => {
      expect(supportContactFields).toHaveLength(5)
    })
  })

  describe('alwaysValidEvents', () => {
    const expectedEvents = [
      AuditEventMessageType.FORM_CREATED,
      AuditEventMessageType.FORM_UPDATED,
      AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
      AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE,
      AuditEventMessageType.FORM_DRAFT_DELETED,
      AuditEventMessageType.FORM_MIGRATED,
      AuditEventMessageType.FORM_JSON_UPLOADED,
      AuditEventMessageType.FORM_JSON_DOWNLOADED,
      AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED,
      AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
    ]

    it.each(expectedEvents)('should contain %s', (eventType) => {
      expect(alwaysValidEvents.has(eventType)).toBe(true)
    })

    it('should have exactly 10 always valid events', () => {
      expect(alwaysValidEvents.size).toBe(10)
    })

    it.each([
      AuditEventMessageType.FORM_TITLE_UPDATED,
      AuditEventMessageType.FORM_ORGANISATION_UPDATED,
      AuditEventMessageType.FORM_TEAM_NAME_UPDATED
    ])('should not contain change tracking event %s', (eventType) => {
      expect(alwaysValidEvents.has(eventType)).toBe(false)
    })
  })

  describe('isConsolidatedRecord', () => {
    const baseAuditRecord = {
      id: 'test-id',
      messageId: 'msg-id',
      recordCreatedAt: new Date(),
      schemaVersion: 1,
      category: 'FORM',
      source: 'FORMS_MANAGER',
      type: AuditEventMessageType.FORM_CREATED,
      entityId: 'entity-123',
      createdAt: new Date(),
      createdBy: { id: 'user-1', displayName: 'Test User' },
      messageCreatedAt: new Date()
    } as unknown as AuditRecord

    it.each([2, 5, 100, 1000])(
      'should return true when consolidatedCount is %i',
      (count) => {
        const record: ConsolidatedAuditRecord = {
          ...baseAuditRecord,
          consolidatedCount: count,
          consolidatedFrom: new Date('2024-01-01'),
          consolidatedTo: new Date('2024-01-02')
        }
        expect(isConsolidatedRecord(record)).toBe(true)
      }
    )

    it.each([0, 1])(
      'should return false when consolidatedCount is %i',
      (count) => {
        const record = {
          ...baseAuditRecord,
          consolidatedCount: count,
          consolidatedFrom: new Date('2024-01-01'),
          consolidatedTo: new Date('2024-01-01')
        } as ConsolidatedAuditRecord
        expect(isConsolidatedRecord(record)).toBe(false)
      }
    )

    it('should return false for a regular audit record without consolidation properties', () => {
      expect(isConsolidatedRecord(baseAuditRecord)).toBe(false)
    })
  })
})
