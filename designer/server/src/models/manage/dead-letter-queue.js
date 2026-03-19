/**
 * Model to represent confirmation page dialog
 * @param {DeadLetterQueues} dlq
 */
export function redriveDeadLetterQueueConfirmationViewModel(dlq) {
  const backOrCancelUrl = '#' // `${editUrl}${user.userId}/amend`
  return {
    backLink: {
      href: backOrCancelUrl,
      text: 'Back to view queue'
    },
    useNewMasthead: true,
    pageHeading: {
      text: `Are you sure you want to redrive all message from the ${dlq} queue?`
    },
    pageCaption: {
      text: dlq
    },
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
