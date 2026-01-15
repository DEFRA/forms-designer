import {
  AuditEventMessageType,
  buildPaginationPages,
  isConsolidatedRecord
} from '@defra/forms-model'

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
  [AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT]: 'Form published',
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
 * Gets the friendly name for an event type
 * @param {string} eventType
 * @returns {string}
 */
export function getEventFriendlyName(eventType) {
  return eventFriendlyNames[eventType] ?? 'Unknown event'
}

/**
 * Builds a timeline item from a consolidated audit record.
 * Consolidated records have consolidatedCount > 1 and include
 * consolidatedFrom and consolidatedTo timestamps.
 * @param {ConsolidatedAuditRecord} record - Pre-consolidated record from API
 * @returns {TimelineItem}
 */
function buildConsolidatedTimelineItem(record) {
  const user = record.createdBy.displayName
  const count = record.consolidatedCount

  const startDate = new Date(record.consolidatedFrom)
  const endDate = new Date(record.consolidatedTo)

  let timeRange
  if (isSameDay(startDate, endDate)) {
    timeRange = `${formatTime(startDate)} and ${formatTime(endDate)}`
  } else {
    timeRange = `${formatShortDate(startDate)} and ${formatShortDate(endDate)}`
  }

  return {
    title: 'Draft edited',
    user,
    date: formatHistoryDate(record.createdAt),
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
  const isFormWentLive =
    record.type === AuditEventMessageType.FORM_LIVE_CREATED_FROM_DRAFT

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
 * Builds timeline items from audit records.
 * Handles both regular and pre-consolidated records from the API.
 * When consolidate=true is passed to the API, consecutive FORM_UPDATED
 * events by the same user are already grouped.
 * @param {(AuditRecord | ConsolidatedAuditRecord)[]} records - Records from API
 * @returns {TimelineItem[]}
 */
export function buildTimelineItems(records) {
  return records.map((record) => {
    if (isConsolidatedRecord(record)) {
      return buildConsolidatedTimelineItem(record)
    }
    return buildTimelineItem(record)
  })
}

/**
 * Builds the view model for the overview sidebar history section
 * @param {FormMetadata} metadata
 * @param {(AuditRecord | ConsolidatedAuditRecord)[]} auditRecords - Records from API
 * @returns {OverviewHistoryViewModel}
 */
export function overviewHistoryViewModel(metadata, auditRecords) {
  const items = buildTimelineItems(auditRecords).slice(
    0,
    OVERVIEW_HISTORY_LIMIT
  )
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
 * Creates a href for a history pagination page
 * @param {number} pageNumber - The page number
 * @param {number} perPage - Items per page
 * @param {string} basePath - Base path for the history page
 * @returns {string} The href for the page
 */
function createHistoryPageHref(pageNumber, perPage, basePath) {
  const queryParams = new URLSearchParams({
    page: pageNumber.toString(),
    perPage: perPage.toString()
  })

  return `${basePath}?${queryParams}`
}

/**
 * Builds the full history page view model
 * @param {FormMetadata} metadata
 * @param {FormDefinition | undefined} formDefinition
 * @param {AuditResponse} auditResponse - API response with records and meta
 * @returns {HistoryViewModel}
 */
export function historyViewModel(metadata, formDefinition, auditResponse) {
  const formPath = formOverviewPath(metadata.slug)
  const navigation = getFormSpecificNavigation(
    formPath,
    metadata,
    formDefinition,
    FORM_HISTORY_TITLE
  )

  const { auditRecords, meta } = auditResponse
  const items = buildTimelineItems(auditRecords)

  const { page, perPage, totalItems, totalPages } = meta.pagination
  const historyPath = `${formPath}/history`
  const pages = buildPaginationPages(page, totalPages, (pageNumber) =>
    createHistoryPageHref(pageNumber, perPage, historyPath)
  )
  const pagination = {
    page,
    perPage,
    totalItems,
    totalPages,
    pages
  }

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
    form: metadata,
    pagination
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
 * @property {boolean} isFormWentLive - Whether this is a "form published" event
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
 * @property {PaginationResultWithPages} [pagination] - Pagination data
 */

/**
 * @import { AuditRecord, ConsolidatedAuditRecord, FormDefinition, FormMetadata, PaginationResultWithPages } from '@defra/forms-model'
 * @import { AuditResponse } from '~/src/lib/audit.js'
 */
