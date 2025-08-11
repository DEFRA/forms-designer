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
})
