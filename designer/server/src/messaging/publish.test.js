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
  publishAuthenticationLogoutManualEvent,
  publishFormDownloadedEvent
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

  describe('publishFormDownloadedEvent', () => {
    const testFormId = '507f1f77bcf86cd799439011'
    const testSlug = 'test-form-slug'

    it('should publish FORM_JSON_DOWNLOADED event', async () => {
      await publishFormDownloadedEvent(testFormId, testSlug, authAuditUser)

      expect(publishEvent).toHaveBeenCalledWith({
        entityId: testFormId,
        source: AuditEventMessageSource.FORMS_DESIGNER,
        messageCreatedAt: expect.any(Date),
        schemaVersion: AuditEventMessageSchemaVersion.V1,
        category: AuditEventMessageCategory.FORM,
        type: AuditEventMessageType.FORM_JSON_DOWNLOADED,
        createdAt: expect.any(Date),
        createdBy: {
          id: authAuditUser.id,
          displayName: authAuditUser.displayName
        },
        data: {
          formId: testFormId,
          slug: testSlug
        }
      })
    })

    it('should return the result from publishEvent', async () => {
      const expectedResult = {
        MessageId: '12345',
        SequenceNumber: undefined,
        $metadata: {}
      }
      jest.mocked(publishEvent).mockResolvedValue(expectedResult)

      const result = await publishFormDownloadedEvent(
        testFormId,
        testSlug,
        authAuditUser
      )

      expect(result).toEqual(expectedResult)
    })

    it('should not publish the event if the schema is incorrect', async () => {
      const invalidFormId = null
      const invalidSlug = null
      const invalidUser = {}

      await expect(
        // @ts-expect-error - invalid schema
        publishFormDownloadedEvent(invalidFormId, invalidSlug, invalidUser)
      ).rejects.toThrow(
        new ValidationError(
          '"entityId" must be a string. "createdBy.id" is required. "createdBy.displayName" is required. "data.formId" must be a string. "data.slug" must be a string',
          [],
          {}
        )
      )
    })

    it('should handle publishEvent rejection', async () => {
      const expectedError = new Error('SNS publish failed')
      jest.mocked(publishEvent).mockRejectedValue(expectedError)

      await expect(
        publishFormDownloadedEvent(testFormId, testSlug, authAuditUser)
      ).rejects.toThrow(expectedError)
    })

    it('should validate all required fields', async () => {
      await expect(
        // @ts-expect-error - invalid schema
        publishFormDownloadedEvent(undefined, testSlug, authAuditUser)
      ).rejects.toThrow(ValidationError)

      await expect(
        // @ts-expect-error - invalid schema
        publishFormDownloadedEvent(testFormId, undefined, authAuditUser)
      ).rejects.toThrow(ValidationError)

      await expect(
        // @ts-expect-error - invalid schema
        publishFormDownloadedEvent(testFormId, testSlug, undefined)
      ).rejects.toThrow(TypeError)
    })

    it('should use the correct message structure for form events', async () => {
      await publishFormDownloadedEvent(testFormId, testSlug, authAuditUser)

      const callArgs = jest.mocked(publishEvent).mock.calls[0][0]

      // Verify it's a form event
      expect(callArgs.category).toBe(AuditEventMessageCategory.FORM)
      expect(callArgs.source).toBe(AuditEventMessageSource.FORMS_DESIGNER)
      expect(callArgs.type).toBe(AuditEventMessageType.FORM_JSON_DOWNLOADED)

      // Verify entityId is the form ID, not user ID
      expect(callArgs.entityId).toBe(testFormId)

      // Verify user info is in createdBy
      expect(callArgs.createdBy.id).toBe(authAuditUser.id)
      expect(callArgs.createdBy.displayName).toBe(authAuditUser.displayName)
    })
  })
})
