import Joi from 'joi'

import { messageSchema } from '~/src/index.js'

describe('schema tests', () => {
  describe('FORM_DRAFT_DELETED', () => {
    it('a valid FORM_DRAFT_DELETED event should pass', () => {
      const test = {
        category: 'FORM',
        createdAt: '2020-01-01T00:00:00.000Z',
        createdBy: {
          displayName: 'Enrique Chase',
          id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
        },
        data: { formId: '661e4ca5039739ef2902b214', slug: 'test-form' },
        entityId: '661e4ca5039739ef2902b214',
        messageCreatedAt: '2020-01-01T00:00:00.000Z',
        schemaVersion: 1,
        source: 'FORMS_MANAGER',
        type: 'FORM_DRAFT_DELETED'
      }
      expect(() =>
        Joi.attempt(test, messageSchema, {
          abortEarly: false
        })
      ).not.toThrow()
    })
  })

  describe('FORM_NOTIFICATION_EMAIL_UPDATED', () => {
    it('should allow empty previous body', () => {
      const message = {
        schemaVersion: 1,
        source: 'FORMS_MANAGER',
        entityId: '689c349a4fe32fcd09445523',
        createdAt: '2025-08-13T11:09:55.393Z',
        createdBy: {
          id: '17ab7e7d-c6b7-4675-bd11-50d56e975cb2',
          displayName: 'Dummy user'
        },
        messageCreatedAt: '2025-08-13T11:09:55.399Z',
        data: {
          formId: '689c349a4fe32fcd09445523',
          slug: 'test-form',
          changes: {
            previous: {},
            new: { notificationEmail: 'tester@defra.gov.uk' }
          }
        },
        category: 'FORM',
        type: 'FORM_NOTIFICATION_EMAIL_UPDATED'
      }

      expect(() => Joi.attempt(message, messageSchema)).not.toThrow()
    })
  })
})
