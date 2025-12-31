import { AuditEventMessageType } from '@defra/forms-model'

import { getFormSpecificNavigation } from '~/src/models/forms/library.js'
import { formOverviewBackLink, formOverviewPath } from '~/src/models/links.js'

const OVERVIEW_HISTORY_LIMIT = 5
const FORM_HISTORY_TITLE = 'Form history'

/**
 * Event type to friendly name mapping
 * @type {Record<string, string>}
 */
const eventFriendlyNames = {
  [AuditEventMessageType.FORM_CREATED]: 'Form created',
  [AuditEventMessageType.FORM_UPDATED]: 'Draft edited',
  [AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT]: 'Form went live',
  [AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE]:
    'Draft created from live form',
  [AuditEventMessageType.FORM_DRAFT_DELETED]: 'Draft form deleted',
  [AuditEventMessageType.FORM_TITLE_UPDATED]: 'Form name updated',
  [AuditEventMessageType.FORM_ORGANISATION_UPDATED]:
    'Organisation name updated',
  [AuditEventMessageType.FORM_TEAM_NAME_UPDATED]: 'Team name updated',
  [AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED]: 'Team email updated',
  [AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED]:
    'Notification email updated',
  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: 'Privacy notice updated',
  [AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED]:
    'Support contact updated',
  [AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED]: 'Support phone updated',
  [AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED]: 'Support email updated',
  [AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED]: 'Support link updated',
  [AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED]:
    'Next steps updated',
  [AuditEventMessageType.FORM_MIGRATED]: 'Switched to new editor',
  [AuditEventMessageType.FORM_JSON_UPLOADED]: 'Form uploaded',
  [AuditEventMessageType.FORM_JSON_DOWNLOADED]: 'Form downloaded',
  [AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED]:
    'Form submissions downloaded',
  [AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED]: 'User feedback downloaded'
}

/**
 * Event types that represent "form went live"
 */
const formWentLiveEventType = String(
  AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT
)

/**
 * Event types that represent draft edits (consolidatable)
 */
const consolidatableEventType = String(AuditEventMessageType.FORM_UPDATED)

/**
 * Gets the friendly name for an event type
 * @param {string} eventType
 * @returns {string}
 */
export function getEventFriendlyName(eventType) {
  return eventFriendlyNames[eventType] ?? 'Unknown event'
}

/**
 * Converts a date string or Date object to a Date object
 * @param {Date | string} date
 * @returns {Date}
 */
function toDate(date) {
  return typeof date === 'string' ? new Date(date) : date
}

/**
 * Formats a date for display in the history timeline
 * @param {Date | string} date
 * @returns {string}
 */
export function formatHistoryDate(date) {
  const dateObj = toDate(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('en-GB', { month: 'long' })
  const year = dateObj.getFullYear()
  const time = dateObj.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${day} ${month} ${year} at ${time}`
}

/**
 * Formats a time for display (e.g., "3:30pm")
 * @param {Date | string} date
 * @returns {string}
 */
export function formatTime(date) {
  const dateObj = toDate(date)
  return dateObj.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Formats a short date (e.g., "14 June")
 * @param {Date | string} date
 * @returns {string}
 */
export function formatShortDate(date) {
  const dateObj = toDate(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('en-GB', { month: 'long' })
  return `${day} ${month}`
}

/**
 * Checks if two dates are on the same day
 * @param {Date | string} date1
 * @param {Date | string} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  const d1 = toDate(date1)
  const d2 = toDate(date2)

  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  )
}

/**
 * Safely gets a nested property value from changes data
 * @param {MessageData} data - The data object
 * @param {string} path - The nested path (e.g., 'changes.previous.title')
 * @returns {string | undefined}
 */
function safeGet(data, path) {
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
 * Builds an "Updated" description string (for most field changes)
 * Returns undefined if old and new values are identical (no actual change)
 * @param {string} fieldName
 * @param {string | undefined} oldValue
 * @param {string | undefined} newValue
 * @returns {string | undefined}
 */
function buildUpdatedDescription(fieldName, oldValue, newValue) {
  // Filter out no-change events where old and new values are identical
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
  // Filter out no-change events where old and new values are identical
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
 * Support contact field configurations for change detection
 * @type {Array<{ label: string, prevPath: string, newPath: string }>}
 */
const supportContactFields = [
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
 * Event types that are always considered valid (don't need change comparison)
 * @type {Set<string>}
 */
const alwaysValidEvents = new Set([
  AuditEventMessageType.FORM_CREATED,
  AuditEventMessageType.FORM_UPDATED,
  AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT,
  AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE,
  AuditEventMessageType.FORM_DRAFT_DELETED,
  AuditEventMessageType.FORM_MIGRATED,
  AuditEventMessageType.FORM_JSON_UPLOADED,
  AuditEventMessageType.FORM_JSON_DOWNLOADED,
  AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED,
  AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED
])

/**
 * Field path configurations for single-field change detection
 * @type {Record<string, { prevPath: string, newPath: string }>}
 */
const changeFieldPaths = {
  [AuditEventMessageType.FORM_TITLE_UPDATED]: {
    prevPath: 'changes.previous.title',
    newPath: 'changes.new.title'
  },
  [AuditEventMessageType.FORM_ORGANISATION_UPDATED]: {
    prevPath: 'changes.previous.organisation',
    newPath: 'changes.new.organisation'
  },
  [AuditEventMessageType.FORM_TEAM_NAME_UPDATED]: {
    prevPath: 'changes.previous.teamName',
    newPath: 'changes.new.teamName'
  },
  [AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED]: {
    prevPath: 'changes.previous.teamEmail',
    newPath: 'changes.new.teamEmail'
  },
  [AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED]: {
    prevPath: 'changes.previous.notificationEmail',
    newPath: 'changes.new.notificationEmail'
  },
  [AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED]: {
    prevPath: 'changes.previous.privacyNoticeUrl',
    newPath: 'changes.new.privacyNoticeUrl'
  },
  [AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED]: {
    prevPath: 'changes.previous.submissionGuidance',
    newPath: 'changes.new.submissionGuidance'
  },
  [AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED]: {
    prevPath: 'changes.previous.phone',
    newPath: 'changes.new.phone'
  },
  [AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED]: {
    prevPath: 'changes.previous.address',
    newPath: 'changes.new.address'
  },
  [AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED]: {
    prevPath: 'changes.previous.url',
    newPath: 'changes.new.url'
  }
}

/**
 * Checks if any support contact field has changed
 * @param {MessageData} data
 * @returns {boolean}
 */
function hasSupportContactChange(data) {
  return supportContactFields.some((field) => {
    const prevValue = safeGet(data, field.prevPath)
    const newValue = safeGet(data, field.newPath)
    return Boolean(newValue && newValue !== prevValue)
  })
}

/**
 * Checks if an audit record represents an actual change
 * Returns false if the record has changes where previous and new values are identical
 * @param {AuditRecord} record
 * @returns {boolean}
 */
export function hasActualChange(record) {
  const { type, data } = record

  if (alwaysValidEvents.has(type)) {
    return true
  }

  if (!data) {
    return true
  }

  if (type in changeFieldPaths) {
    const fieldPaths = changeFieldPaths[type]
    return (
      safeGet(data, fieldPaths.prevPath) !== safeGet(data, fieldPaths.newPath)
    )
  }

  if (
    String(type) === String(AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED)
  ) {
    return hasSupportContactChange(data)
  }

  return true
}

/**
 * Filters out audit records that don't represent actual changes
 * @param {AuditRecord[]} records
 * @returns {AuditRecord[]}
 */
export function filterNoChangeEvents(records) {
  return records.filter(hasActualChange)
}

/**
 * Checks if an audit record is a consolidatable event type (draft edit)
 * @param {AuditRecord} record
 * @returns {boolean}
 */
export function isConsolidatableEvent(record) {
  return String(record.type) === consolidatableEventType
}

/**
 * Checks if two audit records were created by the same user
 * @param {AuditRecord} record1
 * @param {AuditRecord} record2
 * @returns {boolean}
 */
export function isSameUser(record1, record2) {
  return record1.createdBy.id === record2.createdBy.id
}

/**
 * Finds consecutive consolidatable events by the same user starting from a given index
 * @param {AuditRecord[]} records - The filtered records array
 * @param {number} startIndex - Index to start searching from
 * @returns {{ group: AuditRecord[], nextIndex: number }}
 */
export function findConsecutiveEditGroup(records, startIndex) {
  const currentRecord = records[startIndex]
  const group = [currentRecord]
  let nextIndex = startIndex + 1

  while (nextIndex < records.length) {
    const nextRecord = records[nextIndex]

    if (
      isConsolidatableEvent(nextRecord) &&
      isSameUser(currentRecord, nextRecord)
    ) {
      group.push(nextRecord)
      nextIndex++
    } else {
      break
    }
  }

  return { group, nextIndex }
}

/**
 * Consolidates consecutive FORM_UPDATED events by the same user
 * Also filters out events where there's no actual change
 * @param {AuditRecord[]} records - Records sorted by createdAt descending (newest first)
 * @returns {TimelineItem[]}
 */
export function consolidateEditEvents(records) {
  const filteredRecords = filterNoChangeEvents(records)

  if (filteredRecords.length === 0) {
    return []
  }

  /** @type {TimelineItem[]} */
  const result = []
  let i = 0

  while (i < filteredRecords.length) {
    const currentRecord = filteredRecords[i]

    if (isConsolidatableEvent(currentRecord)) {
      const { group, nextIndex } = findConsecutiveEditGroup(filteredRecords, i)

      if (group.length > 1) {
        result.push(buildConsolidatedTimelineItem(group))
      } else {
        result.push(buildTimelineItem(currentRecord))
      }

      i = nextIndex
    } else {
      result.push(buildTimelineItem(currentRecord))
      i++
    }
  }

  return result
}

/**
 * Builds a consolidated timeline item from multiple edit events
 * @param {AuditRecord[]} records - Records in the group (newest first)
 * @returns {TimelineItem}
 */
function buildConsolidatedTimelineItem(records) {
  const newestRecord = records[0]
  const oldestRecord = records[records.length - 1]
  const count = records.length
  const user = newestRecord.createdBy.displayName

  const startDate = new Date(oldestRecord.createdAt)
  const endDate = new Date(newestRecord.createdAt)

  let timeRange
  if (isSameDay(startDate, endDate)) {
    timeRange = `${formatTime(startDate)} and ${formatTime(endDate)}`
  } else {
    timeRange = `${formatShortDate(startDate)} and ${formatShortDate(endDate)}`
  }

  return {
    title: 'Draft edited',
    user,
    date: formatHistoryDate(newestRecord.createdAt),
    description: `Edited the draft form ${count} times between ${timeRange}.`,
    isConsolidated: true,
    count,
    isFormWentLive: false
  }
}

/**
 * Builds a single timeline item from an audit record
 * @param {AuditRecord} record
 * @returns {TimelineItem}
 */
export function buildTimelineItem(record) {
  const title = getEventFriendlyName(record.type)
  const user = record.createdBy.displayName
  const date = formatHistoryDate(record.createdAt)
  const description = getEventDescription(record)
  const recordType = String(record.type)
  const isFormWentLive = recordType === formWentLiveEventType

  return {
    title,
    user,
    date,
    description,
    isConsolidated: false,
    isFormWentLive
  }
}

/**
 * Builds the view model for the overview sidebar history section
 * @param {FormMetadata} metadata
 * @param {AuditRecord[]} auditRecords - Records sorted by createdAt descending
 * @returns {OverviewHistoryViewModel}
 */
export function overviewHistoryViewModel(metadata, auditRecords) {
  const consolidatedItems = consolidateEditEvents(auditRecords)
  const items = consolidatedItems.slice(0, OVERVIEW_HISTORY_LIMIT)
  const formPath = formOverviewPath(metadata.slug)

  return {
    heading: {
      text: 'History',
      size: 'medium',
      level: '3'
    },
    items,
    viewFullHistoryLink: {
      text: 'View full history',
      href: `${formPath}/history`
    },
    hasItems: items.length > 0
  }
}

/**
 * Builds the full history page view model
 * @param {FormMetadata} metadata
 * @param {FormDefinition | undefined} formDefinition
 * @param {AuditRecord[]} auditRecords - Records sorted by createdAt descending
 * @returns {HistoryViewModel}
 */
export function historyViewModel(metadata, formDefinition, auditRecords) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    formDefinition,
    FORM_HISTORY_TITLE
  )

  const items = consolidateEditEvents(auditRecords)

  return {
    backLink: formOverviewBackLink(metadata.slug),
    navigation,
    pageTitle: FORM_HISTORY_TITLE,
    pageHeading: {
      text: FORM_HISTORY_TITLE
    },
    caption: {
      text: metadata.title
    },
    items,
    hasItems: items.length > 0,
    form: metadata
  }
}

/**
 * Timeline item view model
 * @typedef {object} TimelineItem
 * @property {string} title - The event title/friendly name
 * @property {string} user - The user who performed the action
 * @property {string} date - The formatted date string
 * @property {string} [description] - Optional event description
 * @property {boolean} isConsolidated - Whether this is a consolidated item
 * @property {number} [count] - Number of consolidated events
 * @property {boolean} isFormWentLive - Whether this is a "form went live" event
 */

/**
 * Overview history section view model
 * @typedef {object} OverviewHistoryViewModel
 * @property {{ text: string, size: string, level: string }} heading - Section heading config
 * @property {TimelineItem[]} items - Timeline items to display
 * @property {{ text: string, href: string }} viewFullHistoryLink - Link to full history page
 * @property {boolean} hasItems - Whether there are items to display
 */

/**
 * Full history page view model
 * @typedef {object} HistoryViewModel
 * @property {{ text: string, href: string }} backLink - Back link to overview
 * @property {Array<{ text: string, url: string, isActive: boolean }>} navigation - Page navigation
 * @property {string} pageTitle - The page title (for browser tab)
 * @property {{ text: string }} pageHeading - Page heading config
 * @property {{ text: string }} caption - Caption showing the form name
 * @property {TimelineItem[]} items - All timeline items
 * @property {boolean} hasItems - Whether there are items to display
 * @property {FormMetadata} form - The form metadata
 */

/**
 * @import { AuditRecord, FormDefinition, FormMetadata, MessageData } from '@defra/forms-model'
 */
