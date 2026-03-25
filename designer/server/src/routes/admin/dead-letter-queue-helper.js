import { sessionNames } from '~/src/common/constants/session-names.js'

/**
 * Lookup the receipt handle from a previously-saved list of messageIds/receiptHandles
 * @param {Yar} yar
 * @param {string} messageId
 */
export function getSavedReceiptHandle(yar, messageId) {
  const messageList = yar.flash(sessionNames.deadLetterQueueMessages)
  const receiptHandleLookup = messageList.find((x) => x.messageId === messageId)
  return receiptHandleLookup ? receiptHandleLookup.receiptHandle : undefined
}

/**
 * @import { Yar } from '@hapi/yar'
 */
