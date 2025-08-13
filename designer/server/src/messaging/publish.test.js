import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource,
  AuditEventMessageType
} from '@defra/forms-model'
import { ValidationError } from 'joi'

import { authAuditUser } from '~/src/messaging/__stubs__/users.js'
import { publishEvent } from '~/src/messaging/publish-base.js'
import {
  publishAuthenticationLoginEvent,
  publishAuthenticationLogoutAutoEvent,
  publishAuthenticationLogoutDifferentDeviceEvent,
  publishAuthenticationLogoutManualEvent
} from '~/src/messaging/publish.js'

jest.mock('~/src/messaging/publish-base.js')

describe('publish', () => {
  beforeEach(() => {
    jest.mocked(publishEvent).mockResolvedValue({
      MessageId: '2888a402-7609-43c5-975f-b1974969cdb6',
      SequenceNumber: undefined,
      $metadata: {}
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('publishAuthenticationLoginEvent', () => {
    it('should publish AUTHENTICATION_LOGIN event', async () => {
      await publishAuthenticationLoginEvent(authAuditUser)

      expect(publishEvent).toHaveBeenCalledWith({
        entityId: authAuditUser.id,
        source: AuditEventMessageSource.AUTHENTICATION,
        messageCreatedAt: expect.any(Date),
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGIN,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        data: {
          userId: authAuditUser.id,
          email: authAuditUser.email,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should not publish the event if the schema is incorrect', async () => {
      jest.mocked(publishEvent).mockRejectedValue(new Error('rejected'))
      const invalidUser = {}

      await expect(
        // @ts-expect-error - invalid schema
        publishAuthenticationLoginEvent(invalidUser)
      ).rejects.toThrow(
        new ValidationError(
          '"entityId" is required. "createdBy.id" is required. "createdBy.displayName" is required. "data.userId" is required. "data.displayName" is required',
          [],
          {}
        )
      )
    })
  })

  describe('publishAuthenticationLogoutManualEvent', () => {
    it('should publish AUTHENTICATION_LOGOUT_MANUAL event', async () => {
      await publishAuthenticationLogoutManualEvent(authAuditUser)

      expect(publishEvent).toHaveBeenCalledWith({
        entityId: authAuditUser.id,
        source: AuditEventMessageSource.AUTHENTICATION,
        messageCreatedAt: expect.any(Date),
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGOUT_MANUAL,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        data: {
          userId: authAuditUser.id,
          email: authAuditUser.email,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should not publish the event if the schema is incorrect', async () => {
      jest.mocked(publishEvent).mockRejectedValue(new Error('rejected'))
      const invalidUser = {}

      await expect(
        // @ts-expect-error - invalid schema
        publishAuthenticationLogoutManualEvent(invalidUser)
      ).rejects.toThrow(
        new ValidationError(
          '"entityId" is required. "createdBy.id" is required. "createdBy.displayName" is required. "data.userId" is required. "data.displayName" is required',
          [],
          {}
        )
      )
    })
  })

  describe('publishAuthenticationLogoutAutoEvent', () => {
    it('should publish AUTHENTICATION_LOGOUT_AUTO event', async () => {
      await publishAuthenticationLogoutAutoEvent(authAuditUser)

      expect(publishEvent).toHaveBeenCalledWith({
        entityId: authAuditUser.id,
        source: AuditEventMessageSource.AUTHENTICATION,
        messageCreatedAt: expect.any(Date),
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGOUT_AUTO,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        data: {
          userId: authAuditUser.id,
          email: authAuditUser.email,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should not publish the event if the schema is incorrect', async () => {
      jest.mocked(publishEvent).mockRejectedValue(new Error('rejected'))
      const invalidUser = {}

      await expect(
        // @ts-expect-error - invalid schema
        publishAuthenticationLogoutAutoEvent(invalidUser)
      ).rejects.toThrow(
        new ValidationError(
          '"entityId" is required. "createdBy.id" is required. "createdBy.displayName" is required. "data.userId" is required. "data.displayName" is required',
          [],
          {}
        )
      )
    })
  })

  describe('publishAuthenticationLogoutDifferentDeviceEvent', () => {
    it('should publish AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE event', async () => {
      await publishAuthenticationLogoutDifferentDeviceEvent(authAuditUser)

      expect(publishEvent).toHaveBeenCalledWith({
        entityId: authAuditUser.id,
        source: AuditEventMessageSource.AUTHENTICATION,
        messageCreatedAt: expect.any(Date),
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.AUTHENTICATION,
        type: AuditEventMessageType.AUTHENTICATION_LOGOUT_DIFFERENT_DEVICE,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        data: {
          userId: authAuditUser.id,
          email: authAuditUser.email,
          displayName: authAuditUser.displayName
        }
      })
    })

    it('should not publish the event if the schema is incorrect', async () => {
      jest.mocked(publishEvent).mockRejectedValue(new Error('rejected'))
      const invalidUser = {}

      await expect(
        // @ts-expect-error - invalid schema
        publishAuthenticationLogoutDifferentDeviceEvent(invalidUser)
      ).rejects.toThrow(
        new ValidationError(
          '"entityId" is required. "createdBy.id" is required. "createdBy.displayName" is required. "data.userId" is required. "data.displayName" is required',
          [],
          {}
        )
      )
    })
  })
})
