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
  authenticationLogoutManualMapper
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
          email: authAuditUser.email,
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
          email: authAuditUser.email,
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
          email: authAuditUser.email,
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
            email: authAuditUser.email,
            displayName: authAuditUser.displayName
          }
        }
      )
    })
  })
})
