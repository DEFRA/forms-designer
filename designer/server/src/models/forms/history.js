import { AuditEventMessageType } from '@defra/forms-model'

import { getFormSpecificNavigation } from '~/src/models/forms/library.js'
import { formOverviewBackLink, formOverviewPath } from '~/src/models/links.js'

const OVERVIEW_HISTORY_LIMIT = 5

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
 * Gets a description for an event based on its data
 * @param {AuditRecord} record
 * @returns {string | undefined}
 */
export function getEventDescription(record) {
  const { type, data } = record

  switch (type) {
    case AuditEventMessageType.FORM_CREATED: {
      return buildFormCreatedDescription(data)
    }

    case AuditEventMessageType.FORM_TITLE_UPDATED: {
      return buildUpdatedDescription(
        'the form name',
        safeGet(data, 'changes.previous.title'),
        safeGet(data, 'changes.new.title')
      )
    }

    case AuditEventMessageType.FORM_ORGANISATION_UPDATED: {
      return buildChangedDescription(
        'the lead organisation',
        safeGet(data, 'changes.previous.organisation'),
        safeGet(data, 'changes.new.organisation')
      )
    }

    case AuditEventMessageType.FORM_TEAM_NAME_UPDATED: {
      return buildChangedDescription(
        'the team name',
        safeGet(data, 'changes.previous.teamName'),
        safeGet(data, 'changes.new.teamName')
      )
    }

    case AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED: {
      return buildUpdatedDescription(
        'the shared team address',
        safeGet(data, 'changes.previous.teamEmail'),
        safeGet(data, 'changes.new.teamEmail')
      )
    }

    case AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED: {
      return buildUpdatedDescription(
        'where submitted forms are sent',
        safeGet(data, 'changes.previous.notificationEmail'),
        safeGet(data, 'changes.new.notificationEmail')
      )
    }

    case AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED: {
      return buildUpdatedDescription(
        'the privacy notice link',
        safeGet(data, 'changes.previous.privacyNoticeUrl'),
        safeGet(data, 'changes.new.privacyNoticeUrl')
      )
    }

    case AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED: {
      return buildUpdatedDescription(
        'the next steps guidance',
        safeGet(data, 'changes.previous.submissionGuidance'),
        safeGet(data, 'changes.new.submissionGuidance')
      )
    }

    case AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED: {
      return buildUpdatedDescription(
        'the support phone number',
        safeGet(data, 'changes.previous.phone'),
        safeGet(data, 'changes.new.phone')
      )
    }

    case AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED: {
      return buildUpdatedDescription(
        'the support email address',
        safeGet(data, 'changes.previous.address'),
        safeGet(data, 'changes.new.address')
      )
    }

    case AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED: {
      return buildUpdatedDescription(
        'the support contact link',
        safeGet(data, 'changes.previous.url'),
        safeGet(data, 'changes.new.url')
      )
    }

    case AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED: {
      return buildSupportContactDescription(data)
    }

    case AuditEventMessageType.FORM_JSON_UPLOADED: {
      const filename = safeGet(data, 'changes.new.value')
      if (filename) {
        return `Uploaded a form using a JSON file named '${filename}'.`
      }
      return undefined
    }

    case AuditEventMessageType.FORM_JSON_DOWNLOADED: {
      return 'Exported the form in JSON format.'
    }

    case AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT: {
      return 'Made the form live.'
    }

    case AuditEventMessageType.FORM_DRAFT_CREATED_FROM_LIVE: {
      return 'Created a draft version of the live form.'
    }

    case AuditEventMessageType.FORM_DRAFT_DELETED: {
      if (data) {
        const formName = safeGet(data, 'title')
        if (formName) {
          return `Deleted the form named '${formName}'.`
        }
      }
      return 'Deleted the draft form.'
    }

    case AuditEventMessageType.FORM_MIGRATED: {
      if (data) {
        const formName = safeGet(data, 'title')
        if (formName) {
          return `Switched the form named '${formName}' to the new editor.`
        }
      }
      return 'Switched to the new editor.'
    }

    case AuditEventMessageType.FORM_SUBMISSION_EXCEL_REQUESTED: {
      return 'Downloaded form submissions.'
    }

    case AuditEventMessageType.FORM_CSAT_EXCEL_REQUESTED: {
      return 'Downloaded user feedback.'
    }

    default:
      return undefined
  }
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
 * Builds a description for support contact updated event
 * The contact object can contain phone, email, and online sub-objects
 * @param {MessageData} data
 * @returns {string | undefined}
 */
function buildSupportContactDescription(data) {
  const changes = []

  const prevPhone = safeGet(data, 'changes.previous.contact.phone')
  const newPhone = safeGet(data, 'changes.new.contact.phone')
  if (newPhone && newPhone !== prevPhone) {
    if (prevPhone) {
      changes.push(`phone number from '${prevPhone}' to '${newPhone}'`)
    } else {
      changes.push(`phone number to '${newPhone}'`)
    }
  }

  const prevEmail = safeGet(data, 'changes.previous.contact.email.address')
  const newEmail = safeGet(data, 'changes.new.contact.email.address')
  if (newEmail && newEmail !== prevEmail) {
    if (prevEmail) {
      changes.push(`email address from '${prevEmail}' to '${newEmail}'`)
    } else {
      changes.push(`email address to '${newEmail}'`)
    }
  }

  const prevOnline = safeGet(data, 'changes.previous.contact.online.url')
  const newOnline = safeGet(data, 'changes.new.contact.online.url')
  if (newOnline && newOnline !== prevOnline) {
    if (prevOnline) {
      changes.push(`online contact link from '${prevOnline}' to '${newOnline}'`)
    } else {
      changes.push(`online contact link to '${newOnline}'`)
    }
  }

  if (changes.length === 0) {
    return undefined
  }

  if (changes.length === 1) {
    return `Updated the support ${changes[0]}.`
  }

  // Multiple changes - list them
  const lastChange = changes.pop()
  return `Updated the support ${changes.join(', ')} and ${lastChange}.`
}

/**
 * Checks if an audit record represents an actual change
 * Returns false if the record has changes where previous and new values are identical
 * @param {AuditRecord} record
 * @returns {boolean}
 */
export function hasActualChange(record) {
  const { type, data } = record

  const alwaysValidEvents = [
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
  ]

  if (alwaysValidEvents.includes(type)) {
    return true
  }

  if (!data) {
    return true
  }

  switch (type) {
    case AuditEventMessageType.FORM_TITLE_UPDATED: {
      const prev = safeGet(data, 'changes.previous.title')
      const next = safeGet(data, 'changes.new.title')
      return prev !== next
    }

    case AuditEventMessageType.FORM_ORGANISATION_UPDATED: {
      const prev = safeGet(data, 'changes.previous.organisation')
      const next = safeGet(data, 'changes.new.organisation')
      return prev !== next
    }

    case AuditEventMessageType.FORM_TEAM_NAME_UPDATED: {
      const prev = safeGet(data, 'changes.previous.teamName')
      const next = safeGet(data, 'changes.new.teamName')
      return prev !== next
    }

    case AuditEventMessageType.FORM_TEAM_EMAIL_UPDATED: {
      const prev = safeGet(data, 'changes.previous.teamEmail')
      const next = safeGet(data, 'changes.new.teamEmail')
      return prev !== next
    }

    case AuditEventMessageType.FORM_NOTIFICATION_EMAIL_UPDATED: {
      const prev = safeGet(data, 'changes.previous.notificationEmail')
      const next = safeGet(data, 'changes.new.notificationEmail')
      return prev !== next
    }

    case AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED: {
      const prev = safeGet(data, 'changes.previous.privacyNoticeUrl')
      const next = safeGet(data, 'changes.new.privacyNoticeUrl')
      return prev !== next
    }

    case AuditEventMessageType.FORM_SUBMISSION_GUIDANCE_UPDATED: {
      const prev = safeGet(data, 'changes.previous.submissionGuidance')
      const next = safeGet(data, 'changes.new.submissionGuidance')
      return prev !== next
    }

    case AuditEventMessageType.FORM_SUPPORT_PHONE_UPDATED: {
      const prev = safeGet(data, 'changes.previous.phone')
      const next = safeGet(data, 'changes.new.phone')
      return prev !== next
    }

    case AuditEventMessageType.FORM_SUPPORT_EMAIL_UPDATED: {
      const prev = safeGet(data, 'changes.previous.address')
      const next = safeGet(data, 'changes.new.address')
      return prev !== next
    }

    case AuditEventMessageType.FORM_SUPPORT_ONLINE_UPDATED: {
      const prev = safeGet(data, 'changes.previous.url')
      const next = safeGet(data, 'changes.new.url')
      return prev !== next
    }

    case AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED: {
      const prevPhone = safeGet(data, 'changes.previous.contact.phone')
      const newPhone = safeGet(data, 'changes.new.contact.phone')
      const prevEmail = safeGet(data, 'changes.previous.contact.email.address')
      const newEmail = safeGet(data, 'changes.new.contact.email.address')
      const prevOnline = safeGet(data, 'changes.previous.contact.online.url')
      const newOnline = safeGet(data, 'changes.new.contact.online.url')

      const phoneChanged = Boolean(newPhone && newPhone !== prevPhone)
      const emailChanged = Boolean(newEmail && newEmail !== prevEmail)
      const onlineChanged = Boolean(newOnline && newOnline !== prevOnline)

      return phoneChanged || emailChanged || onlineChanged
    }

    default:
      return true
  }
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
    'Form history'
  )

  const items = consolidateEditEvents(auditRecords)

  return {
    backLink: formOverviewBackLink(metadata.slug),
    navigation,
    pageTitle: 'Form history',
    pageHeading: {
      text: 'Form history'
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
