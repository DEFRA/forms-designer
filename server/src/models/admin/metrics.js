import {
  FormStatus,
  FunctionalAreaType,
  organisations
} from '@defra/forms-model'

import { getFormMetrics, getFunctionalAreaMetrics } from '~/src/lib/metrics.js'
import {
  mapCopyAnswersFormRows,
  mapCopyAnswersMetrics
} from '~/src/models/admin/metrics-copy-answers.js'
import {
  componentUsageFeatures,
  componentUsageFormStructures,
  componentUsageQuestionTypes,
  mapOverviewMetrics,
  mapTotalMetrics
} from '~/src/models/admin/metrics-helper.js'
import { mapSigninMetrics } from '~/src/models/admin/metrics-signin.js'
import {
  MetricsTileConfig,
  numberCell
} from '~/src/models/admin/metrics-tile-config.js'
import { ROUTE_BASE_PATH } from '~/src/routes/admin/form-metrics.js'

/**
 * @typedef {object} ComponentUsageModel
 * @property {{ questionTypeName: string, draft: ComponentUsageQuestionType, live: ComponentUsageQuestionType }[]} formUsageQuestionTypes - question type metrics
 * @property {{ featureName: string, draft: ComponentUsageFeature, live: ComponentUsageFeature}[]} formUsageFeatures - feature metrics
 * @property {{ metricName: string, draft: ComponentUsageFormStructure, live: ComponentUsageFormStructure}[]} formUsageFormStructures - form structure metrics
 */

/**
 * @typedef {object} FormActivityModel
 * @property {{ last7Days: FormTilesView, last30Days: FormTilesView, allTime: FormTilesView}} overviewMetrics - overview tiles
 * @property {TableRowMetric[]} formMetricRows - row per form for display in the table
 * @property {SortCriteria} sort - sort criteria
 * @property {FilterCriteria} filter - filter criteria
 */

export const tilePeriodNames = {
  last7Days: {
    ariaPeriodName: 'previous 7 days',
    straplinePeriodName: 'last week',
    slug: 'last-7-days'
  },
  last30Days: {
    ariaPeriodName: 'previous 30 days',
    straplinePeriodName: 'last month',
    slug: 'last-30-days'
  },
  allTime: {
    ariaPeriodName: 'previous year',
    straplinePeriodName: 'last year',
    slug: 'all-time'
  }
}

const periodSlugs = /** @type {Record<string, string>} */ ({
  'last-7-days': 'last7Days',
  'last-30-days': 'last30Days',
  'all-time': 'allTime'
})

const FORM_NOT_FOUND = {
  name: 'Form not found',
  slug: 'not-found',
  organisation: 'Unknown'
}

const COMPONENT_USAGE_TAB = 'component-usage'
export const FORM_ACTIVITY_TAB = 'form-activity'
const SIGN_IN_TAB = 'sign-in'
const COPY_ANSWERS_TAB = 'copy-answers'

/**
 * @param { string | undefined } activityType
 */
function getFormActivityToggle(activityType) {
  return {
    name: 'activityType',
    fieldset: {
      legend: {
        text: 'Show metrics for',
        isPageHeading: false,
        classes: 'govuk-fieldset__legend--m'
      }
    },
    classes: 'govuk-radios--inline',
    formGroup: {
      afterInputs: {
        html: '<button type="submit" class="govuk-button js-hidden" data-module="govuk-button" data-govuk-button-init="">Submit</button>'
      }
    },
    items: [
      {
        value: 'all',
        text: 'All forms',
        checked: (activityType ?? 'all') === 'all',
        attributes: {
          onchange: 'this.form.submit()'
        }
      },
      {
        value: 'cy',
        text: 'Forms with a Welsh translation',
        checked: activityType === 'cy',
        attributes: {
          onchange: 'this.form.submit()'
        }
      }
    ]
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {FilterAndSortCriteria} filterAndSort
 * @param { string | undefined } activityType
 */
export function metricsFormActivityViewModel(
  metrics,
  filterAndSort,
  activityType
) {
  const organisationMap = /** @type {Map<string, number>} */ (new Map())
  organisations.forEach((org) => {
    organisationMap.set(org, 0)
  })
  metrics.overview.forEach((row) => {
    const org = /** @type {string} */ (row.summaryMetrics.organisation)
    organisationMap.set(org, (organisationMap.get(org) ?? 0) + 1)
  })

  const rows = mapOverviewMetrics(metrics.overview)

  const formActivityToggle = getFormActivityToggle(activityType)

  return /** @type {FormActivityModel} */ ({
    overviewMetrics: mapTotalMetrics(
      metrics.totals,
      tilePeriodNames,
      filterAndSort.language
    ),
    formMetricRows: sortMetricRows(rows, filterAndSort),
    formActivityToggle,
    sort: {
      sortCol: filterAndSort.sortCol,
      sortDir: filterAndSort.sortDir
    },
    filter: {
      showFilter: filterAndSort.showFilter,
      searchText: filterAndSort.searchText,
      status: filterAndSort.status,
      organisation: filterAndSort.org,
      organisationList: Array.from(organisationMap, ([key, count]) => ({
        text: `${key} (${count})`,
        value: key,
        checked: filterAndSort.org?.includes(key)
      })),
      statusList: [
        {
          text: 'Draft',
          value: 'draft',
          checked: filterAndSort.status?.includes(FormStatus.Draft)
        },
        {
          text: 'Live',
          value: 'live',
          checked: filterAndSort.status?.includes(FormStatus.Live)
        }
      ]
    }
  })
}

/**
 * @param {TableRowMetric[]} rows
 * @param {SortCriteria} sortCriteria
 */
export function sortMetricRows(rows, { sortCol, sortDir }) {
  if (!sortCol || !sortDir) {
    return rows
  }
  return rows.sort((a, b) => {
    // @ts-expect-error - allow lookup since we know the key, even though it's dynamic
    const valA = /** @type {string} */ (a[sortCol] ?? '')
    // @ts-expect-error - allow lookup since we know the key, even though it's dynamic
    const valB = /** @type {string} */ (b[sortCol] ?? '')
    return sortDir === 'ascending'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA)
  })
}

/**
 * @param {string} periodSlug
 */
export function getPeriodNameFromSlug(periodSlug) {
  return periodSlugs[periodSlug]
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} tileMetrics
 * @param {FormDrilldownMetric[]} drilldownMetrics
 * @param {string} period
 * @param {FormMetricName} metricName
 * @param { string | undefined } language
 */
export function metricsDrilldownViewModel(
  tileMetrics,
  drilldownMetrics,
  period,
  metricName,
  language
) {
  const overviewMetrics = /** @type {Record<string, any>} */ (
    mapTotalMetrics(tileMetrics.totals, tilePeriodNames, language)
  )
  const periodSelector = getPeriodNameFromSlug(period)
  const periodDetails = overviewMetrics[periodSelector]

  const table = {
    classes: 'moj-scrollable-pane',
    attributes: {
      'data-module': 'moj-sortable-table'
    },
    firstCellIsHeader: true,
    ...createDrilldownHeaderAndRows(tileMetrics, metricName, drilldownMetrics)
  }

  const tileConfig = MetricsTileConfig[metricName]
  return {
    metricName: tileConfig.drillDown.displayName,
    periodName: periodDetails.title,
    fromDate: periodDetails.fromDate,
    toDate: periodDetails.toDate,
    table
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {FormMetricName} metricName
 * @param {FormDrilldownMetric[]} details
 */
export function createDrilldownHeaderAndRows(metrics, metricName, details) {
  const formMap = new Map()
  metrics.overview.forEach((ov) => {
    if (!formMap.get(ov.formId)) {
      formMap.set(ov.formId, {
        name: ov.summaryMetrics.name,
        slug: ov.summaryMetrics.slug,
        organisation: ov.summaryMetrics.organisation
      })
    }
  })

  const tileConfig = MetricsTileConfig[metricName]

  const head =
    /** @type {{text: string, attributes?: Record<string, string>, classes?: string }[]} */ ([
      {
        text: 'Form name',
        attributes: { 'aria-sort': 'ascending' },
        classes: 'govuk-!-width-one-half'
      },
      { text: 'Organisation', attributes: { 'aria-sort': 'none' } }
    ])

  if (tileConfig.drillDown.headers) {
    head.push(tileConfig.drillDown.headers)
  }

  const rows = /** @type {Array<{ text?: any, html?: string }[]>} */ ([])
  const countsMap = /** @type {Map<string, number>} */ (new Map())

  // Grouped - sum the drilldown results rather than display separate values for the same form
  if (tileConfig.drillDown.grouped) {
    details.forEach((detail) => {
      const total = countsMap.get(detail.formId) ?? 0
      const newTotal = total + detail.metricValue
      countsMap.set(detail.formId, newTotal)
    })
    countsMap.keys().forEach((formId) => {
      const formNameInfo = formMap.get(formId) ?? FORM_NOT_FOUND
      rows.push([
        {
          html: `<a href="/library/${formNameInfo.slug}" class="govuk-link govuk-link--no-visited-state">${formNameInfo.name}</a>`
        },
        { text: formNameInfo.organisation },
        { ...numberCell(countsMap.get(formId) ?? 0) }
      ])
    })
  } else {
    // Not grouped
    details.forEach((detail) => {
      const formNameInfo = formMap.get(detail.formId) ?? FORM_NOT_FOUND
      if (tileConfig.drillDown.valueFunc) {
        rows.push([
          {
            html: `<a href="/library/${formNameInfo.slug}" class="govuk-link govuk-link--no-visited-state">${formNameInfo.name}</a>`
          },
          { text: formNameInfo.organisation },
          { ...tileConfig.drillDown.valueFunc(detail) }
        ])
      }
    })
  }

  return {
    head,
    rows
  }
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function metricsComponentUsageViewModel(metrics) {
  const draftModel = {
    formUsageQuestionTypes: componentUsageQuestionTypes(
      metrics,
      FormStatus.Draft
    ),
    formUsageFeatures: componentUsageFeatures(metrics, FormStatus.Draft),
    formUsageFormStructures: componentUsageFormStructures(
      metrics,
      FormStatus.Draft
    )
  }
  const liveModel = {
    formUsageQuestionTypes: componentUsageQuestionTypes(
      metrics,
      FormStatus.Live
    ),
    formUsageFeatures: componentUsageFeatures(metrics, FormStatus.Live),
    formUsageFormStructures: componentUsageFormStructures(
      metrics,
      FormStatus.Live
    )
  }

  // Combine models into a single structure that includes both draft and live metrics
  const combinedModel = {
    formUsageQuestionTypes: draftModel.formUsageQuestionTypes.map((qt) => ({
      questionTypeName: qt.questionTypeName,
      draft: qt,
      live: {}
    })),
    formUsageFeatures: draftModel.formUsageFeatures.map((f) => ({
      featureName: f.featureName,
      draft: f,
      live: {}
    })),
    formUsageFormStructures: draftModel.formUsageFormStructures.map((s) => ({
      metricName: s.metricName,
      draft: s,
      live: {}
    }))
  }

  combineModel(
    combinedModel.formUsageQuestionTypes,
    liveModel.formUsageQuestionTypes,
    'questionTypeName'
  )

  combineModel(
    combinedModel.formUsageFeatures,
    liveModel.formUsageFeatures,
    'featureName'
  )

  combineModel(
    combinedModel.formUsageFormStructures,
    liveModel.formUsageFormStructures,
    'metricName'
  )

  return /** @type {ComponentUsageModel} */ (combinedModel)
}

/**
 * @param {any[]} combinedElement
 * @param {any[]} liveElement
 * @param {string} typeKeyName
 */
export function combineModel(combinedElement, liveElement, typeKeyName) {
  liveElement.forEach((le) => {
    const found = combinedElement.find(
      (x) => x.draft[typeKeyName] === le[typeKeyName]
    )
    if (found) {
      found.live = le
    } else {
      combinedElement.push({
        [typeKeyName]: le[typeKeyName],
        draft: {},
        live: le
      })
    }
  })
}

/**
 * @param {FunctionalAreaTotalsMetric} metrics
 */
export function metricsSignInViewModel(metrics) {
  return {
    overviewMetrics: mapSigninMetrics(metrics, tilePeriodNames)
  }
}

/**
 * @param {{ overview?: FormOverviewMetric[], totals: FunctionalAreaTotalsMetric }} metrics
 */
export function metricsCopyAnswersViewModel(metrics) {
  const rows = mapCopyAnswersFormRows(metrics)

  return {
    overviewMetrics: mapCopyAnswersMetrics(metrics.totals, tilePeriodNames),
    formMetricRows: sortMetricRows(rows, {})
  }
}

/**
 * @param {string} tab
 * @param {*} filter
 * @param {*} activityType
 * @returns {Promise<{ model?: any, viewName: string, redirectUrl?: string }>}
 */
export async function buildMetricsViewModel(tab, filter, activityType) {
  if (tab === COMPONENT_USAGE_TAB) {
    const metrics = await getFormMetrics(filter)
    return {
      model: metricsComponentUsageViewModel(metrics),
      viewName: 'admin/form-metrics-component-usage'
    }
  } else if (tab === FORM_ACTIVITY_TAB) {
    const metrics = await getFormMetrics(filter)
    return {
      model: metricsFormActivityViewModel(metrics, filter, activityType),
      viewName: 'admin/form-metrics-form-activity'
    }
  } else if (tab === SIGN_IN_TAB) {
    const signinMetrics = await getFunctionalAreaMetrics(
      FunctionalAreaType.Signin
    )
    return {
      model: metricsSignInViewModel(signinMetrics.totals),
      viewName: 'admin/form-metrics-sign-in'
    }
  } else if (tab === COPY_ANSWERS_TAB) {
    const copyAnswersMetrics = await getFunctionalAreaMetrics(
      FunctionalAreaType.CopyAnswers
    )
    return {
      model: metricsCopyAnswersViewModel(copyAnswersMetrics),
      viewName: 'admin/form-metrics-copy-answers'
    }
  } else {
    return {
      redirectUrl: `${ROUTE_BASE_PATH}/${FORM_ACTIVITY_TAB}/all`,
      viewName: 'n/a'
    }
  }
}

/**
 * @import { FormDrilldownMetric, FormMetricName, FormOverviewMetric, FormTotalsMetric, FunctionalAreaTotalsMetric } from '@defra/forms-model'
 * @import { ComponentUsageFeature, ComponentUsageFormStructure, ComponentUsageQuestionType, FilterAndSortCriteria, FilterCriteria, FormTilesView, SortCriteria, TableRowMetric } from '~/src/models/admin/metrics-types.js'
 */
