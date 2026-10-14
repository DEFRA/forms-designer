import { AuditEventMessageType } from '@defra/forms-model'

import {
  alwaysValidEvents,
  fieldConfigs,
  privacyNoticeFields,
  supportContactFields
} from '~/src/models/forms/history-field-config.js'
import { safeGet } from '~/src/models/forms/history-utils.js'

/**
 * Checks if any field in a multi-field object has changed
 * @param {MessageData} data
 * @param {MultiAuditFieldConfig[]} fields
 * @returns {boolean}
 */
function hasFieldInMultiFieldChanged(data, fields) {
  return fields.some((field) => {
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

  if (type in fieldConfigs) {
    const config = fieldConfigs[type]
    return safeGet(data, config.prevPath) !== safeGet(data, config.newPath)
  }

  if (type === AuditEventMessageType.FORM_SUPPORT_CONTACT_UPDATED) {
    return hasFieldInMultiFieldChanged(data, supportContactFields)
  }

  if (type === AuditEventMessageType.FORM_PRIVACY_NOTICE_UPDATED) {
    return hasFieldInMultiFieldChanged(data, privacyNoticeFields)
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
 * @import { AuditRecord, MessageData, MultiAuditFieldConfig } from '@defra/forms-model'
 */
