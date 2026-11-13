/**
 * @typedef {object} TileDrillDown
 * @property {boolean} enabled - true if drill down is allowed
 * @property {string} url - the path for the drilldown operation
 */

/**
 * @typedef PeriodName
 * @property {string} ariaPeriodName - period name within aria label
 * @property {string} straplinePeriodName - strapline text for the period
 * @property {string} slug - part of url used for drilldown navigation
 */

/**
 * @typedef {object} FilterCriteria
 * @property {string} [searchText] - text to look for
 * @property {string[]} [status] - allowable statuses
 * @property {string[]} [org] - list of organisations
 * @property {string} [language] - only process records for the specified language
 * @property {string} [activityType] - radio option for whether to show all forms, or forms with a Welsh translation
 */

/**
 * @typedef {object} SortCriteria
 * @property {string} [sortCol] - column name to sort
 * @property {string} [sortDir] - direction of sort (asc/desc)
 */

/**
 * @typedef {FilterCriteria & SortCriteria & { action?: string, showFilter?: string, restoreFilter?: string, currentTab?: string }} FilterAndSortCriteria
 */

/**
 * @typedef {object} TableRowMetric
 * @property {string} formName - name of the form
 * @property {string} features - list of features
 * @property {number} submissions - count of submissions
 * @property {number | string} daysToPublish - number of days from draft to live
 * @property {number | string} republished - number of times the form has been re-published
 */

/**
 * @typedef {object} MetricsTile
 * @property {string} title - title for the tile
 * @property {string} ariaLabel - text for aria label
 * @property {string} strapline - strapline text
 * @property {string} classes - custom classes
 * @property {TileDrillDown} drillDown - drilldown config
 */

/**
 * @typedef {object} FormTilesView
 * @property { string | undefined } fromDate - name of the form
 * @property { string | undefined } toDate - list of features
 * @property {string} title - title for section
 * @property {Record<FormMetricName | FunctionalAreaMetricName, MetricsTile>} tiles - tiles to be displayed
 */

/**
 * @typedef {object} ComponentUsageQuestionType
 * @property {string} questionTypeName - name of question type
 * @property {number} totalUsage - total number of times this question type is used
 * @property {number} formsUsing - total number of forms that use this question type
 * @property {string} percentage - percentage 'number of forms using' / 'total number of forms'
 */

/**
 * @typedef {object} ComponentUsageFeature
 * @property {string} featureName - name of feature
 * @property {number} formsUsing - total number of forms that use this feature
 * @property {string} percentage - percentage 'number of forms using' / 'total number of forms'
 */

/**
 * @typedef {object} ComponentUsageFormStructure
 * @property {string} metricName - name of metric
 * @property {string} average - average value across all forms
 * @property {number} minimum - minimum number across all forms
 * @property {number} maximum - maximum number across all forms
 */

/**
 * @import { FormMetricName, FunctionalAreaMetricName } from '@defra/forms-model'
 */
