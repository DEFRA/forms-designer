import { FormStatus, organisations } from '@defra/forms-model'

import {
  componentUsageFeatures,
  componentUsageFormStructures,
  componentUsageQuestionTypes,
  mapOverviewMetrics,
  mapTotalMetrics
} from '~/src/models/admin/metrics-helper.js'

const tilePeriodNames = {
  last7Days: {
    ariaPeriodName: 'previous 7 days',
    straplinePeriodName: 'last week'
  },
  last30Days: {
    ariaPeriodName: 'previous 30 days',
    straplinePeriodName: 'last month'
  },
  allTime: {
    ariaPeriodName: 'previous year',
    straplinePeriodName: 'last year'
  }
}

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

  return {
    overviewMetrics: mapTotalMetrics(metrics.totals, tilePeriodNames),
    formMetricRows: mapOverviewMetrics(metrics.overview),
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
        checked:
          !filterAndSort.org?.length ||
          filterAndSort.org.includes(encodeURI(key))
      })),
      statusList: [
        {
          text: 'Draft',
          value: 'draft',
          checked:
            !filterAndSort.status?.length ||
            filterAndSort.status.includes(FormStatus.Draft)
        },
        {
          text: 'Live',
          value: 'live',
          checked:
            !filterAndSort.status?.length ||
            filterAndSort.status.includes(FormStatus.Live)
        }
      ]
    }
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
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 * @param {FilterCriteria} filter
 */
export function filterMetrics(metrics, filter) {
  const searchText = filter.searchText?.toLowerCase()
  const statuses = filter.status
  const orgs = filter.org

  return metrics.overview.filter((form) => {
    const formName = /** @type {string} */ (
      form.summaryMetrics.name
    ).toLowerCase()
    const org = /** @type {string} */ (form.summaryMetrics.organisation)
    return (
      (!searchText || formName.includes(searchText)) &&
      (!statuses || statuses.includes(form.formStatus)) &&
      (!orgs || orgs.includes(org))
    )
  })
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 * @import { FilterAndSortCriteria, FilterCriteria, SortCriteria } from '~/src/models/admin/metrics-helper.js'
 */
