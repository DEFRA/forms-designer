import {
  CopyAnswersMetricName,
  FormMetricName,
  SigninMetricName
} from '@defra/forms-model'
import { format } from 'date-fns'

import { formatNumber } from '~/src/common/nunjucks/filters/format-number.js'

/**
 * @typedef {object} TileDrillDownConfig
 * @property {boolean} enabled - true if drill down is allowed
 * @property {boolean} grouped - true if drill down results are to be grouped per form
 * @property {string} displayName - display name for metric
 * @property {{ text: string, attributes?: Record<string, string> }} [headers] - custom headers for drill down
 * @property {(detail: FormDrilldownMetric) => { text: string, attributes?: Record<string, string | number> }} [valueFunc] - function to return custom value
 */

/**
 * @typedef {object} TileTooltipConfig
 * @property {string} id - element id for the tooltip
 * @property {string} text - tooltip text
 */

/**
 * @typedef {object} MetricTileConfigRecordType
 * @property {string} noun - noun used in tile phrase structure
 * @property {string} verb - verb used in tile phrase structure
 * @property {TileTooltipConfig} tooltip - id and text for the tile's tooltip
 * @property {TileDrillDownConfig} drillDown - config for drill down operations
 */

/**
 * @param { string | Date } dateString
 */
export function dateCell(dateString) {
  const date = new Date(dateString)
  return {
    text: format(date, 'dd MMM yyyy h:mm aaa'),
    attributes: {
      'data-sort-value': format(date, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}

/**
 * @param {number} num
 */
export function numberCell(num) {
  return {
    text: formatNumber(num),
    attributes: {
      'data-sort-value': num
    }
  }
}

export const MetricsTileConfig =
  /** @type {Record<FormMetricName | FunctionalAreaMetricName, MetricTileConfigRecordType>} */ ({
    // Form tiles
    [FormMetricName.NewFormsCreated]: {
      noun: 'form',
      verb: 'created',
      tooltip: {
        id: 'new-forms-created-tooltip',
        text: 'How many new forms people started in Form Designer.'
      },
      drillDown: {
        displayName: 'new forms created',
        enabled: true,
        grouped: false,
        headers: { text: 'Created date', attributes: { 'aria-sort': 'none' } },
        valueFunc: (detail) => dateCell(detail.createdAt)
      }
    },
    [FormMetricName.FormsFirstPublished]: {
      noun: 'form',
      verb: 'first published',
      tooltip: {
        id: 'forms-first-published-tooltip',
        text: 'How many forms were made available for people to fill in.'
      },
      drillDown: {
        displayName: 'forms first published',
        enabled: true,
        grouped: false,
        headers: {
          text: 'First published date',
          attributes: { 'aria-sort': 'none' }
        },
        valueFunc: (detail) => dateCell(detail.createdAt)
      }
    },
    [FormMetricName.FormsRePublished]: {
      noun: '',
      verb: 're-published',
      tooltip: {
        id: 'forms-republished-tooltip',
        text: 'How many existing live forms had changes made, and those changes were subsequently made live.'
      },
      drillDown: {
        displayName: 're-published',
        enabled: true,
        grouped: true,
        headers: { text: 'Re-published', attributes: { 'aria-sort': 'none' } },
        valueFunc: (detail) => numberCell(detail.metricValue)
      }
    },
    [FormMetricName.Submissions]: {
      noun: 'submission',
      verb: '',
      tooltip: {
        id: 'form-submissions-tooltip',
        text: 'How many times someone completed and submitted a form.'
      },
      drillDown: {
        displayName: 'submissions',
        enabled: true,
        grouped: true,
        headers: { text: 'Submissions', attributes: { 'aria-sort': 'none' } },
        valueFunc: (detail) => numberCell(detail.metricValue)
      }
    },
    [FormMetricName.FormsInDraft]: {
      noun: 'form',
      verb: '',
      tooltip: {
        id: 'forms-in-draft-tooltip',
        text: 'How many forms are being worked on and have not been published yet.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [FormMetricName.TimeToPublish]: {
      noun: 'day',
      verb: '',
      tooltip: {
        id: 'time-to-publish-tooltip',
        text: 'The average number of days from creating a form to publishing it for the first time.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },

    // Sign-in tiles
    [SigninMetricName.Registration]: {
      noun: 'registration',
      verb: '',
      tooltip: {
        id: 'registrations-tooltip',
        text: 'Total number of registrations.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.SuccessfulAuthentication]: {
      noun: 'authentication',
      verb: '',
      tooltip: {
        id: 'successful-authentications-tooltip',
        text: 'Total number of successful authentications (sign-ins).'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.TooManyCodeRequests]: {
      noun: 'request',
      verb: '',
      tooltip: {
        id: 'too-many-code-requests-tooltip',
        text: 'Number of times a user was locked out for 2 hours after requesting a security code too many times.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.IncorrectCodeEntered]: {
      noun: 'incorrect code',
      verb: '',
      tooltip: {
        id: 'incorrect-code-entered-tooltip',
        text: 'Number of times a user entered a security code incorrectly.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.AccountDeletion]: {
      noun: 'deletion',
      verb: '',
      tooltip: {
        id: 'account-deletions-tooltip',
        text: 'Total number of account deletions.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.EmailAddressUpdate]: {
      noun: 'update',
      verb: '',
      tooltip: {
        id: 'email-address-updates-tooltip',
        text: 'Total number of email address updates.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.PhoneNumberUpdate]: {
      noun: 'update',
      verb: '',
      tooltip: {
        id: 'phone-number-updates-tooltip',
        text: 'Total number of phone number updates.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },

    // Copy answers tiles
    [CopyAnswersMetricName.CopyAnswersForm]: {
      noun: 'form',
      verb: '',
      tooltip: {
        id: 'copy-answers-forms-tooltip',
        text: 'Total number of forms that have copy answers enabled.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [CopyAnswersMetricName.CopyAnswersSubmission]: {
      noun: 'submission',
      verb: '',
      tooltip: {
        id: 'copy-answers-submissions-tooltip',
        text: 'Total number of live submissions based on copy answers.'
      },
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    }
  })

/**
 * @import { FormDrilldownMetric, FunctionalAreaMetricName } from '@defra/forms-model'
 */
