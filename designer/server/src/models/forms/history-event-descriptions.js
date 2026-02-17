import { AuditEventMessageType } from '@defra/forms-model'

import {
  fieldConfigs,
  privacyNoticeFields,
  supportContactFields
} from '~/src/models/forms/history-field-config.js'
import {
  buildFieldChangeDescription,
  safeGet
} from '~/src/models/forms/history-utils.js'

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
 * Builds a change string for a special field
 * @param {string} fieldLabel - The field label (e.g., 'phone number')
 * @param {string | undefined} prevValue - Previous value
 * @param {string | undefined} newValue - New value
 * @returns {string | undefined}
 */
function buildSpecialFieldChangeString(fieldLabel, prevValue, newValue) {
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
 * @param {MultiAuditFieldConfig[]} fields
 * @param {string} [groupWord] - insert in the description, if required
 * @returns {string | undefined}
 */
function buildMultiFieldDescription(data, fields, groupWord = '') {
  const groupWordAndSpace = groupWord ? `${groupWord} ` : ''
  /** @type {string[]} */
  const changes = fields
    .map((field) =>
      buildSpecialFieldChangeString(
        field.label,
        safeGet(data, field.prevPath),
        safeGet(data, field.newPath)
      )
    )
    .filter((v) => v !== undefined)

  if (changes.length === 0) {
    return undefined
  }

  if (changes.length === 1) {
    return `Updated the ${groupWordAndSpace}${changes[0]}.`
  }

  // Use non-mutating approach to get last item and rest
  const lastChange = changes.at(-1)
  const otherChanges = changes.slice(0, -1)
  return `Updated the ${groupWordAndSpace}${otherChanges.join(', ')} and ${lastChange}.`
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
    const bulletList = details.map((d) => `• ${d}`).join('\n')
    return `${parts.join('')}\n\n${bulletList}`
  }

  return parts.join('')
}

/**
 * Handlers for special event types that need custom logic
 * @type {Record<string, (data: MessageData | undefined) => string | undefined>}
 */
const specialEventHandlers = {
  [AuditEventMessageType.FORM_CREATED]: (data) =>
    data ? buildFormCreatedDescription(data) : undefined,

  [AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED]: (data) =>
    data
      ? buildMultiFieldDescription(data, supportContactFields, 'support')
      : undefined,

  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: (data) =>
    data ? buildMultiFieldDescription(data, privacyNoticeFields) : undefined,

  [AuditEventMessageType.FORM_JSON_UPLOADED]: (data) => {
    const filename = data ? safeGet(data, 'changes.new.value') : undefined
    return filename
      ? `Uploaded a form using a JSON file named '${filename}'.`
      : undefined
  },

  [AuditEventMessageType.FORM_DRAFT_DELETED]: (data) => {
    const formName = data ? safeGet(data, 'title') : undefined
    return formName
      ? `Deleted the form named '${formName}'.`
      : 'Deleted the draft form.'
  },

  [AuditEventMessageType.FORM_MIGRATED]: (data) => {
    const formName = data ? safeGet(data, 'title') : undefined
    return formName
      ? `Switched the form named '${formName}' to the new editor.`
      : 'Switched to the new editor.'
  }
}

/**
 * Gets description for special event types that need custom logic
 * @param {string} type
 * @param {MessageData | undefined} data
 * @returns {string | undefined}
 */
function getSpecialEventDescription(type, data) {
  if (type in specialEventHandlers) {
    return specialEventHandlers[type](data)
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

  if (type in fieldConfigs) {
    const config = fieldConfigs[type]
    return buildFieldChangeDescription(
      config.verb,
      config.label,
      data ? safeGet(data, config.prevPath) : undefined,
      data ? safeGet(data, config.newPath) : undefined
    )
  }

  return getSpecialEventDescription(type, data)
}

/**
 * @import { AuditRecord, MessageData, MultiAuditFieldConfig } from '@defra/forms-model'
 */
