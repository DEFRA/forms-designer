import { AuditEventMessageType } from '@defra/forms-model'

/**
 * Safely gets a nested property value from changes data
 * @param {MessageData} data - The data object
 * @param {string} path - The nested path (e.g., 'changes.previous.title')
 * @returns {string | undefined}
 */
export function safeGet(data, path) {
  const parts = path.split('.')
  /** @type {unknown} */
  let current = data
  for (const part of parts) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined
    }
    current = /** @type {Record<string, unknown>} */ (current)[part]
  }
  return typeof current === 'string' ? current : undefined
}

/**
 * Field configurations for events that use buildUpdatedDescription
 * @type {Record<string, { label: string, prevPath: string, newPath: string }>}
 */
const updatedFieldConfigs = {
  [AuditEventMessageType.FORM_TITLE_UPDATED]: {
    label: 'the form name',
    prevPath: 'changes.previous.title',
    newPath: 'changes.new.title'
  },
  [AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED]: {
    label: 'the shared team address',
    prevPath: 'changes.previous.teamEmail',
    newPath: 'changes.new.teamEmail'
  },
  [AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED]: {
    label: 'where submitted forms are sent',
    prevPath: 'changes.previous.notificationEmail',
    newPath: 'changes.new.notificationEmail'
  },
  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: {
    label: 'the privacy notice link',
    prevPath: 'changes.previous.privacyNoticeUrl',
    newPath: 'changes.new.privacyNoticeUrl'
  },
  [AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED]: {
    label: 'the next steps guidance',
    prevPath: 'changes.previous.submissionGuidance',
    newPath: 'changes.new.submissionGuidance'
  },
  [AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED]: {
    label: 'the support phone number',
    prevPath: 'changes.previous.phone',
    newPath: 'changes.new.phone'
  },
  [AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED]: {
    label: 'the support email address',
    prevPath: 'changes.previous.address',
    newPath: 'changes.new.address'
  },
  [AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED]: {
    label: 'the support contact link',
    prevPath: 'changes.previous.url',
    newPath: 'changes.new.url'
  }
}

/**
 * Field configurations for events that use buildChangedDescription
 * @type {Record<string, { label: string, prevPath: string, newPath: string }>}
 */
const changedFieldConfigs = {
  [AuditEventMessageType.FORM_ORGANISATION_UPDATED]: {
    label: 'the lead organisation',
    prevPath: 'changes.previous.organisation',
    newPath: 'changes.new.organisation'
  },
  [AuditEventMessageType.FORM_TEAM_NAME_UPDATED]: {
    label: 'the team name',
    prevPath: 'changes.previous.teamName',
    newPath: 'changes.new.teamName'
  }
}

/**
 * Static descriptions for events that don't need data
 * @type {Record<string, string>}
 */
const staticDescriptions = {
  [AuditEventMessageType.FORM_JSON_DOWNLOADED]:
    'Exported the form in JSON format.',
  [AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT]: 'Made the form live.',
  [AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE]:
    'Created a draft version of the live form.',
  [AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED]:
    'Downloaded form submissions.',
  [AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED]: 'Downloaded user feedback.'
}

/**
 * Builds an "Updated" description string (for most field changes)
 * Returns undefined if old and new values are identical (no actual change)
 * @param {string} fieldName
 * @param {string | undefined} oldValue
 * @param {string | undefined} newValue
 * @returns {string | undefined}
 */
function buildUpdatedDescription(fieldName, oldValue, newValue) {
  if (oldValue && newValue && oldValue === newValue) {
    return undefined
  }
  if (oldValue && newValue) {
    return `Updated ${fieldName} from '${oldValue}' to '${newValue}'.`
  }
  if (newValue) {
    return `Set ${fieldName} to '${newValue}'.`
  }
  return undefined
}

/**
 * Builds a "Changed" description string (for organisation/team name)
 * Returns undefined if old and new values are identical (no actual change)
 * @param {string} fieldName
 * @param {string | undefined} oldValue
 * @param {string | undefined} newValue
 * @returns {string | undefined}
 */
function buildChangedDescription(fieldName, oldValue, newValue) {
  if (oldValue && newValue && oldValue === newValue) {
    return undefined
  }
  if (oldValue && newValue) {
    return `Changed ${fieldName} from '${oldValue}' to '${newValue}'.`
  }
  if (newValue) {
    return `Set ${fieldName} to '${newValue}'.`
  }
  return undefined
}

/**
 * Support contact field configurations for change detection
 * @type {Array<{ label: string, prevPath: string, newPath: string }>}
 */
export const supportContactFields = [
  {
    label: 'phone number',
    prevPath: 'changes.previous.contact.phone',
    newPath: 'changes.new.contact.phone'
  },
  {
    label: 'email address',
    prevPath: 'changes.previous.contact.email.address',
    newPath: 'changes.new.contact.email.address'
  },
  {
    label: 'online contact link',
    prevPath: 'changes.previous.contact.online.url',
    newPath: 'changes.new.contact.online.url'
  }
]

/**
 * Builds a change string for a contact field
 * @param {string} fieldLabel - The field label (e.g., 'phone number')
 * @param {string | undefined} prevValue - Previous value
 * @param {string | undefined} newValue - New value
 * @returns {string | undefined}
 */
function buildContactChangeString(fieldLabel, prevValue, newValue) {
  if (!newValue || newValue === prevValue) {
    return undefined
  }
  return prevValue
    ? `${fieldLabel} from '${prevValue}' to '${newValue}'`
    : `${fieldLabel} to '${newValue}'`
}

/**
 * Builds a description for support contact updated event
 * The contact object can contain phone, email, and online sub-objects
 * @param {MessageData} data
 * @returns {string | undefined}
 */
function buildSupportContactDescription(data) {
  const changes = supportContactFields
    .map((field) =>
      buildContactChangeString(
        field.label,
        safeGet(data, field.prevPath),
        safeGet(data, field.newPath)
      )
    )
    .filter(Boolean)

  if (changes.length === 0) {
    return undefined
  }

  if (changes.length === 1) {
    return `Updated the support ${changes[0]}.`
  }

  const lastChange = changes.pop()
  return `Updated the support ${changes.join(', ')} and ${lastChange}.`
}

/**
 * Builds a description for form created event
 * @param {MessageData} data
 * @returns {string}
 */
function buildFormCreatedDescription(data) {
  const parts = []
  const typedData =
    /** @type {import('@defra/forms-model').FormCreatedMessageData} */ (data)

  if (typedData.title) {
    parts.push(`Created a new form named '${typedData.title}' with:`)
  }

  const details = []
  if (typedData.organisation) {
    details.push(`the lead organisation as '${typedData.organisation}'`)
  }
  if (typedData.teamName) {
    details.push(`the team name as '${typedData.teamName}'`)
  }
  if (typedData.teamEmail) {
    details.push(`the shared team email address as '${typedData.teamEmail}'`)
  }

  if (details.length > 0) {
    return parts.join('') + '\n\n' + details.map((d) => `• ${d}`).join('\n')
  }

  return parts.join('')
}

/**
 * Gets description for special event types that need custom logic
 * @param {string} type
 * @param {MessageData | undefined} data
 * @returns {string | undefined}
 */
function getSpecialEventDescription(type, data) {
  if (type === String(AuditEventMessageType.FORM_CREATED) && data) {
    return buildFormCreatedDescription(data)
  }

  if (
    type === String(AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED) &&
    data
  ) {
    return buildSupportContactDescription(data)
  }

  if (type === String(AuditEventMessageType.FORM_JSON_UPLOADED) && data) {
    const filename = safeGet(data, 'changes.new.value')
    return filename
      ? `Uploaded a form using a JSON file named '${filename}'.`
      : undefined
  }

  if (type === String(AuditEventMessageType.FORM_DRAFT_DELETED)) {
    const formName = data ? safeGet(data, 'title') : undefined
    return formName
      ? `Deleted the form named '${formName}'.`
      : 'Deleted the draft form.'
  }

  if (type === String(AuditEventMessageType.FORM_MIGRATED)) {
    const formName = data ? safeGet(data, 'title') : undefined
    return formName
      ? `Switched the form named '${formName}' to the new editor.`
      : 'Switched to the new editor.'
  }

  return undefined
}

/**
 * Gets a description for an event based on its data
 * @param {AuditRecord} record
 * @returns {string | undefined}
 */
export function getEventDescription(record) {
  const { type, data } = record

  if (type in staticDescriptions) {
    return staticDescriptions[type]
  }

  if (type in updatedFieldConfigs) {
    const config = updatedFieldConfigs[type]
    return buildUpdatedDescription(
      config.label,
      data ? safeGet(data, config.prevPath) : undefined,
      data ? safeGet(data, config.newPath) : undefined
    )
  }

  if (type in changedFieldConfigs) {
    const config = changedFieldConfigs[type]
    return buildChangedDescription(
      config.label,
      data ? safeGet(data, config.prevPath) : undefined,
      data ? safeGet(data, config.newPath) : undefined
    )
  }

  return getSpecialEventDescription(type, data)
}

/**
 * @import { AuditRecord, MessageData } from '@defra/forms-model'
 */
