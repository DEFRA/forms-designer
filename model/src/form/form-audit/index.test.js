import Joi from 'joi'

import {
  FORM_CREATED,
  FORM_DRAFT_CREATED_FROM_LIVE,
  FORM_DRAFT_DELETED,
  FORM_LIVE_CREATED_FROM_DRAFT,
  FORM_MIGRATED,
  FORM_ORGANISATION_UPDATED,
  FORM_TITLE_UPDATED,
  FORM_UPDATED,
  REPLACE_DRAFT
} from '~/src/form/form-audit/__snapshots__/index.snap.js'
import { messageSchema } from '~/src/index.js'

describe('schema tests', () => {
  it('should validate FORM_ORGANISATION_UPDATED events', () => {
    expect(() =>
      Joi.attempt(FORM_ORGANISATION_UPDATED, messageSchema, {
        abortEarly: false
      })
    ).not.toThrow()
  })

  it('should validate FORM_DRAFT_DELETED events', () => {
    expect(() =>
      Joi.attempt(FORM_DRAFT_DELETED, messageSchema, {
        abortEarly: false
      })
    ).not.toThrow()
  })

  it('should validate FORM_DRAFT_CREATED_FROM_LIVE events', () => {
    expect(() =>
      Joi.attempt(FORM_DRAFT_CREATED_FROM_LIVE, messageSchema, {
        abortEarly: false
      })
    ).not.toThrow()
  })

  it('should validate FORM_CREATED events', () => {
    expect(() =>
      Joi.attempt(FORM_CREATED, messageSchema, { abortEarly: false })
    ).not.toThrow()
  })

  it('should validate REPLACE_DRAFT events', () => {
    expect(() =>
      Joi.attempt(REPLACE_DRAFT, messageSchema, { abortEarly: false })
    ).not.toThrow()
  })

  it('should validate FORM_MIGRATED events', () => {
    expect(() =>
      Joi.attempt(FORM_MIGRATED, messageSchema, { abortEarly: false })
    ).not.toThrow()
  })

  it('should validate FORM_TITLE_UPDATED events', () => {
    expect(() =>
      Joi.attempt(FORM_TITLE_UPDATED, messageSchema, { abortEarly: false })
    ).not.toThrow()
  })

  it('should validate FORM_UPDATED events', () => {
    expect(() =>
      Joi.attempt(FORM_UPDATED, messageSchema, { abortEarly: false })
    ).not.toThrow()
  })

  it('should validate FORM_LIVE_CREATED_FROM_DRAFT events', () => {
    expect(() =>
      Joi.attempt(FORM_LIVE_CREATED_FROM_DRAFT, messageSchema, {
        abortEarly: false
      })
    ).not.toThrow()
  })

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
