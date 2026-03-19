/**
 * Model to represent confirmation page dialog
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
        text: 'Redrive',
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
 * @import { DeadLetterQueues } from '@defra/forms-model'
 */
