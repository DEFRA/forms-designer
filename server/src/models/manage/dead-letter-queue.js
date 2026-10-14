/**
 * Model to represent confirmation page dialog for redriving a queue
 * @param {DeadLetterQueues} dlq
 */
export function redriveDeadLetterQueueConfirmationViewModel(dlq) {
  const backOrCancelUrl = `/admin/dead-letter-queues/${dlq}`
  return {
    backLink: {
      href: backOrCancelUrl,
      text: 'Back to view queue messages'
    },
    useNewMasthead: true,
    pageHeading: {
      text: 'Admin tools'
    },
    pageCaption: {
      text: dlq
    },
    bodyHeadingText: `Are you sure you want to redrive all messages from the '${dlq}' queue?`,
    buttons: [
      {
        text: 'Redrive all messages',
        classes: 'govuk-button--warning'
      },
      {
        href: backOrCancelUrl,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ]
  }
}

/**
 * Model to represent confirmation page dialog for deleting a message
 * @param {DeadLetterQueues} dlq
 * @param {string} messageId
 */
export function deleteDeadLetterMessageConfirmationViewModel(dlq, messageId) {
  const backOrCancelUrl = `/admin/dead-letter-queues/${dlq}`
  return {
    backLink: {
      href: backOrCancelUrl,
      text: 'Back to view queue messages'
    },
    useNewMasthead: true,
    pageHeading: {
      text: 'Admin tools'
    },
    pageCaption: {
      text: dlq
    },
    bodyHeadingText: `Are you sure you want to delete message '${messageId}' from the '${dlq}' queue?`,
    buttons: [
      {
        text: 'Delete message',
        classes: 'govuk-button--warning'
      },
      {
        href: backOrCancelUrl,
        text: 'Cancel',
        classes: 'govuk-button--secondary'
      }
    ],
    customPayload: [
      { key: 'action', value: 'delete' },
      { key: 'messageId', value: messageId }
    ]
  }
}

/**
 * @import { DeadLetterQueues } from '@defra/forms-model'
 */
