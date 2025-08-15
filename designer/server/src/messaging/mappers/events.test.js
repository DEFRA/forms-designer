import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource,
  AuditEventMessageType
} from '@defra/forms-model'

import { authAuditUser } from '~/src/messaging/__stubs__/users.js'
import {
  authenticationLoginMapper,
  authenticationLogoutAutoMapper,
  authenticationLogoutDifferentDevicelMapper,
  authenticationLogoutManualMapper,
  formDownloadedMapper
} from '~/src/messaging/mappers/events.js'

describe('authentication-events', () => {
  describe('authenticationMapper', () => {
    it('should map a payload into a AUTHENTICATION_LOGIN event', () => {
      expect(authenticationLoginMapper(authAuditUser)).toEqual({
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        source: AuditEventMessageSource.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGIN,
        entityId: authAuditUser.id,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        messageCreatedAt: expect.any(Date),
        data: {
          userId: authAuditUser.id,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should map a payload into a AUTHENTICATION_LOGOUT_MANUAL event', () => {
      expect(authenticationLogoutManualMapper(authAuditUser)).toEqual({
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        source: AuditEventMessageSource.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGOUT_MANUAL,
        entityId: authAuditUser.id,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        messageCreatedAt: expect.any(Date),
        data: {
          userId: authAuditUser.id,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should map a payload into a AUTHENTICATION_LOGOUT_AUTO event', () => {
      expect(authenticationLogoutAutoMapper(authAuditUser)).toEqual({
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        source: AuditEventMessageSource.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGOUT_AUTO,
        entityId: authAuditUser.id,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        messageCreatedAt: expect.any(Date),
        data: {
          userId: authAuditUser.id,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should map a payload into a AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE event', () => {
      expect(authenticationLogoutDifferentDevicelMapper(authAuditUser)).toEqual(
        {
          schemaVersion: AuditEventMessageSchemaVersion.V1,
          category: AuditEventMessageCategory.AUTHENTICATION,
          source: AuditEventMessageSource.AUTHENTICATION,
          type: AuditEventMessageType.AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE,
          entityId: authAuditUser.id,
          createdAt: expect.any(Date),
          createdBy: {
            id: authAuditUser.id,
            displayName: authAuditUser.displayName
          },
          messageCreatedAt: expect.any(Date),
          data: {
            userId: authAuditUser.id,
            displayName: authAuditUser.displayName
          }
        }
      )
    })
  })
})

describe('form-events', () => {
  describe('formDownloadedMapper', () => {
    const testFormId = '507f1f77bcf86cd799439011' // Valid 24-char hex string (MongoDB ObjectId format)
    const testSlug = 'test-form-slug'
    const downloadData = {
      formId: testFormId,
      slug: testSlug,
      user: authAuditUser
    }

    it('should map a payload into a FORM_JSON_DOWNLOADED event', () => {
      expect(formDownloadedMapper(downloadData)).toEqual({
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.FORM,
        source: AuditEventMessageSource.FORMS_DESIGNER,
        type: AuditEventMessageType.FORM_JSON_DOWNLOADED,
        entityId: testFormId,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        messageCreatedAt: expect.any(Date),
        data: {
          formId: testFormId,
          slug: testSlug
        }
      })
    })

    it('should use the same timestamps for createdAt and messageCreatedAt', () => {
      const result = formDownloadedMapper(downloadData)
      expect(result.createdAt).toEqual(result.messageCreatedAt)
    })

    it('should set the entityId to the formId', () => {
      const result = formDownloadedMapper(downloadData)
      expect(result.entityId).toBe(testFormId)
    })

    it('should include form data in the data payload', () => {
      const result = formDownloadedMapper(downloadData)
      expect(result.data).toEqual({
        formId: testFormId,
        slug: testSlug
      })
    })

    it('should use FORMS_DESIGNER as the source', () => {
      const result = formDownloadedMapper(downloadData)
      expect(result.source).toBe(AuditEventMessageSource.FORMS_DESIGNER)
    })

    it('should use FORM category', () => {
      const result = formDownloadedMapper(downloadData)
      expect(result.category).toBe(AuditEventMessageCategory.FORM)
    })

    it('should map user information correctly in createdBy field', () => {
      const result = formDownloadedMapper(downloadData)
      expect(result.createdBy).toEqual({
        id: authAuditUser.id,
        displayName: authAuditUser.displayName
      })
    })
  })
})
