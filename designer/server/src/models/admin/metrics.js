import { FormStatus, organisations } from '@defra/forms-model'

import {
  MetricsTileConfig,
  componentUsageFeatures,
  componentUsageFormStructures,
  componentUsageQuestionTypes,
  mapOverviewMetrics,
  mapTotalMetrics,
  numberCell
} from '~/src/models/admin/metrics-helper.js'

const tilePeriodNames = {
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

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {FilterAndSortCriteria} filterAndSort
 */
export function metricsFormActivityViewModel(metrics, filterAndSort) {
  const organisationMap = /** @type {Map<string, number>} */ (new Map())
  organisations.forEach((org) => {
    organisationMap.set(org, 0)
  })
  metrics.overview.forEach((row) => {
    const org = /** @type {string} */ (row.summaryMetrics.organisation)
    organisationMap.set(org, (organisationMap.get(org) ?? 0) + 1)
  })

  const rows = mapOverviewMetrics(metrics.overview)
  return {
    overviewMetrics: mapTotalMetrics(metrics.totals, tilePeriodNames),
    formMetricRows: sortMetricRows(rows, filterAndSort),
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
  }
}

/**
 * @param {any[]} rows
 * @param {SortCriteria} sortCriteria
 */
export function sortMetricRows(rows, { sortCol, sortDir }) {
  if (!sortCol || !sortDir) {
    return rows
  }
  return rows.sort((a, b) => {
    const valA = /** @type {string} */ (a[sortCol] ?? '')
    const valB = /** @type {string} */ (b[sortCol] ?? '')
    return sortDir === 'ascending'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA)
  })
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {string} period
 * @param {FormMetricName} metricName
 */
export function metricsDrilldownViewModel(metrics, period, metricName) {
  const overviewMetrics = /** @type {Record<string, any>} */ (
    mapTotalMetrics(metrics.totals, tilePeriodNames)
  )
  const periodSelector = periodSlugs[period]
  const periodDetails = overviewMetrics[periodSelector]
  const totals = /** @type {Record<string, any>} */ (metrics.totals)
  const details = totals[periodSelector][metricName].details
  const table = {
    classes: 'moj-scrollable-pane',
    attributes: {
      'data-module': 'moj-sortable-table'
    },
    firstCellIsHeader: true,
    ...createDrilldownHeaderAndRows(metrics, metricName, details)
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
 * @param {FormTimelineMetric[]} details
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
      const formNameInfo = formMap.get(formId)
      if (formNameInfo) {
        rows.push([
          {
            html: `<a href="/library/${formNameInfo.slug}" class="govuk-link govuk-link--no-visited-state">${formNameInfo.name}</a>`
          },
          { text: formNameInfo.organisation },
          { ...numberCell(countsMap.get(formId) ?? 0) }
        ])
      }
    })
  } else {
    // Not grouped
    details.forEach((detail) => {
      const formNameInfo = formMap.get(detail.formId)
      if (formNameInfo && tileConfig.drillDown.valueFunc) {
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

  return combinedModel
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
 * @import { FormMetricName, FormOverviewMetric, FormTimelineMetric, FormTotalsMetric } from '@defra/forms-model'
 * @import { FilterAndSortCriteria , SortCriteria} from '~/src/models/admin/metrics-helper.js'
 */
