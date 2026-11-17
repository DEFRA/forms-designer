import { FormMetricName, SigninMetricName } from '@defra/forms-model'
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
 * @typedef {object} MetricTileConfigRecordType
 * @property {string} noun - noun used in tile phrase structure
 * @property {string} verb - verb used in tile phrase structure
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
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [FormMetricName.TimeToPublish]: {
      noun: 'day',
      verb: '',
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
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.SuccessfulAuthentication]: {
      noun: 'authentication',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.TooManyCodeRequests]: {
      noun: 'request',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.IncorrectCodeEntered]: {
      noun: 'incorrect code',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.AccountDeletion]: {
      noun: 'deletion',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.EmailAddressUpdate]: {
      noun: 'update',
      verb: '',
      drillDown: {
        displayName: '',
        enabled: false,
        grouped: false
      }
    },
    [SigninMetricName.PhoneNumberUpdate]: {
      noun: 'update',
      verb: '',
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
