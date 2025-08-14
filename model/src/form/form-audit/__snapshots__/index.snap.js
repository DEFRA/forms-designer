// Jest Snapshot v1, https://goo.gl/fbAQLP

export const FORM_ORGANISATION_UPDATED = {
  category: 'FORM',
  createdAt: new Date('2025-07-26T00:00:00.000Z'),
  createdBy: {
    displayName: 'Enrique Chase',
    id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  },
  data: {
    changes: {
      new: {
        organisation: 'Defra'
      },
      previous: {
        organisation: 'Natural England'
      }
    },
    formId: '689b7ab1d0eeac9711a7fb33',
    slug: 'audit-form'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-07-26T00:00:00.000Z'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_ORGANISATION_UPDATED'
}

export const FORM_DRAFT_CREATED_FROM_LIVE = {
  category: 'FORM',
  createdAt: new Date('2025-07-24T00:00:00.000Z'),
  createdBy: {
    displayName: 'Gandalf',
    id: 'a53b4360-bdf6-4d13-8975-25032ce76312'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_DRAFT_CREATED_FROM_LIVE'
}

export const FORM_CREATED = {
  category: 'FORM',
  createdAt: new Date('2025-07-23T00:00:00.000Z'),
  createdBy: {
    displayName: 'Enrique Chase',
    id: '83f09a7d-c80c-4e15-bcf3-641559c7b8a7'
  },
  data: {
    formId: '689b7ab1d0eeac9711a7fb33',
    organisation: 'Defra',
    slug: 'audit-form',
    teamEmail: 'forms@example.uk',
    teamName: 'Forms',
    title: 'My Audit Event Form'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_CREATED'
}

export const FORM_DRAFT_DELETED = {
  category: 'FORM',
  createdAt: new Date('2025-08-13T15:26:02.054Z'),
  createdBy: {
    displayName: 'Enrique Chase',
    id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  },
  data: {
    formId: '689b7ab1d0eeac9711a7fb33',
    slug: 'audit-form'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_DRAFT_DELETED'
}

export const REPLACE_DRAFT = {
  category: 'FORM',
  createdAt: new Date('2020-01-01T00:00:00.000Z'),
  createdBy: {
    displayName: 'Enrique Chase',
    id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  },
  data: {
    formId: '661e4ca5039739ef2902b214',
    payload: undefined,
    requestType: 'REPLACE_DRAFT',
    s3Meta: {
      fileId: '3HL4kqtJlcpXrof3W3Zz4YBdvdz2FJ9n',
      filename: '6883d8667a2a64da10af4312.json',
      s3Key: 'audit-definitions/6883d8667a2a64da10af4312.json'
    },
    slug: 'test-form'
  },
  entityId: '661e4ca5039739ef2902b214',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_UPDATED'
}

export const FORM_MIGRATED = {
  category: 'FORM',
  createdAt: new Date('2025-07-24T00:00:00.000Z'),
  createdBy: {
    displayName: 'Gandalf',
    id: 'a53b4360-bdf6-4d13-8975-25032ce76312'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_MIGRATED'
}

export const FORM_TITLE_UPDATED = {
  category: 'FORM',
  createdAt: new Date('2025-07-24T00:00:00.000Z'),
  createdBy: {
    displayName: 'Gandalf',
    id: 'a53b4360-bdf6-4d13-8975-25032ce76312'
  },
  data: {
    changes: {
      new: {
        title: 'My Audit Event Form'
      },
      previous: {
        title: 'Old form title'
      }
    },
    formId: '689b7ab1d0eeac9711a7fb33',
    slug: 'audit-form'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_TITLE_UPDATED'
}

export const FORM_UPDATED = {
  category: 'FORM',
  createdAt: new Date('2020-01-01T00:00:00.000Z'),
  createdBy: {
    displayName: 'Enrique Chase',
    id: 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  },
  data: {
    formId: '661e4ca5039739ef2902b214',
    payload: {
      components: [],
      id: 'ffefd409-f3f4-49fe-882e-6e89f44631b1',
      next: [],
      path: '/page-one',
      title: 'Page One'
    },
    requestType: 'CREATE_PAGE',
    s3Meta: undefined,
    slug: 'test-form'
  },
  entityId: '661e4ca5039739ef2902b214',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_UPDATED'
}

export const FORM_LIVE_CREATED_FROM_DRAFT = {
  category: 'FORM',
  createdAt: new Date('2025-07-24T00:00:00.000Z'),
  createdBy: {
    displayName: 'Gandalf',
    id: 'a53b4360-bdf6-4d13-8975-25032ce76312'
  },
  entityId: '689b7ab1d0eeac9711a7fb33',
  messageCreatedAt: new Date('2025-08-14'),
  schemaVersion: 1,
  source: 'FORMS_MANAGER',
  type: 'FORM_LIVE_CREATED_FROM_DRAFT'
}
