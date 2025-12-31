import { AuditEventMessageType } from '@defra/forms-model'

import { filterNoChangeEvents } from '~/src/models/forms/history-change-detection.js'
import {
  formatHistoryDate,
  formatShortDate,
  formatTime,
  isSameDay
} from '~/src/models/forms/history-date-utils.js'
import { getEventDescription } from '~/src/models/forms/history-event-descriptions.js'
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
 * @import { AuditRecord, FormDefinition, FormMetadata } from '@defra/forms-model'
 */
