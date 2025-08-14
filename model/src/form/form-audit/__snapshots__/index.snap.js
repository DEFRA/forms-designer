import {
  AuditEventMessageCategory,
  AuditEventMessageSchemaVersion,
  AuditEventMessageSource
} from '~/src/form/form-audit/enums.js'

const CREATED_BY = {
  displayName: 'Enrique Chase',
  id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
}
const CREATED_AT = new Date('2025-07-26T00:00:00.000Z')
const MESSAGE_CREATED_AT = new Date('2025-07-26T12:00:00.000Z')
const FORM_ID = '689b7ab1d0eeac9711a7fb33'
const SLUG = 'audit-form'

export const FORM_ORGANISATION_UPDATED = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  data: {
    changes: {
      new: {
        organisation: 'Defra'
      },
      previous: {
        organisation: 'Natural England'
      }
    },
    formId: FORM_ID,
    slug: SLUG
  },
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_ORGANISATION_UPDATED'
}

export const FORM_DRAFT_CREATED_FROM_LIVE = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_DRAFT_CREATED_FROM_LIVE'
}

export const FORM_CREATED = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  data: {
    formId: FORM_ID,
    organisation: 'Defra',
    slug: SLUG,
    teamEmail: 'forms@example.uk',
    teamName: 'Forms',
    title: 'My Audit Event Form'
  },
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_CREATED'
}

export const FORM_DRAFT_DELETED = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  data: {
    formId: FORM_ID,
    slug: SLUG
  },
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_DRAFT_DELETED'
}

export const REPLACE_DRAFT = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  data: {
    formId: FORM_ID,
    payload: undefined,
    requestType: 'REPLACE_DRAFT',
    s3Meta: {
      fileId: '3HL4kqtJlcpXrof3W3Zz4YBdvdz2FJ9n',
      filename: '6883d8667a2a64da10af4312.json',
      s3Key: 'audit-definitions/6883d8667a2a64da10af4312.json'
    },
    slug: SLUG
  },
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_UPDATED'
}

export const FORM_MIGRATED = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_MIGRATED'
}

export const FORM_TITLE_UPDATED = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  data: {
    changes: {
      new: {
        title: 'My Audit Event Form'
      },
      previous: {
        title: 'Old form title'
      }
    },
    formId: FORM_ID,
    slug: SLUG
  },
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_TITLE_UPDATED'
}

export const FORM_UPDATED = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  data: {
    formId: FORM_ID,
    payload: {
      components: [],
      id: 'ffefd409-f3f4-49fe-882e-6e89f44631b1',
      next: [],
      path: '/page-one',
      title: 'Page One'
    },
    requestType: 'CREATE_PAGE',
    s3Meta: undefined,
    slug: SLUG
  },
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_UPDATED'
}

export const FORM_LIVE_CREATED_FROM_DRAFT = {
  category: AuditEventMessageCategory.FORM,
  createdAt: CREATED_AT,
  createdBy: CREATED_BY,
  entityId: FORM_ID,
  messageCreatedAt: MESSAGE_CREATED_AT,
  schemaVersion: AuditEventMessageSchemaVersion.V1,
  source: AuditEventMessageSource.FORMS_MANAGER,
  type: 'FORM_LIVE_CREATED_FROM_DRAFT'
}
