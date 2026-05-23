import { FormMetricName, FormStatus, organisations } from '@defra/forms-model'
import { stringify } from 'csv-stringify'
import { format } from 'date-fns'

import config from '~/src/config.js'
import {
  MetricsTileConfig,
  componentUsageFeatures,
  componentUsageFormStructures,
  componentUsageQuestionTypes,
  mapOverviewMetrics,
  mapTotalMetrics
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

const metricNameFull = /** @type {Record<FormMetricName, string>} */ ({
  [FormMetricName.NewFormsCreated]: 'new forms created',
  [FormMetricName.FormsFirstPublished]: 'first published',
  [FormMetricName.FormsRePublished]: 're-published',
  [FormMetricName.Submissions]: 'submissions'
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

const periodSlugs = /** @type {Record<string, string>} */ ({
  'last-7-days': 'last7Days',
  'last-30-days': 'last30Days',
  'all-time': 'allTime'
})

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

  return {
    metricName: metricNameFull[metricName],
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
 * @returns
 */
function createDrilldownHeaderAndRows(metrics, metricName, details) {
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

  const head = [
    {
      text: 'Form name',
      attributes: { 'aria-sort': 'ascending' },
      classes: 'govuk-!-width-one-half'
    },
    { text: 'Organisation', attributes: { 'aria-sort': 'none' } }
  ]
  addCustomHeaders(head, metricName)

  const rows = /** @type {Array<{ text?: any, html?: string }[]>} */ ([])
  const countsMap = /** @type {Map<string, number>} */ (new Map())

  const tileConfig = MetricsTileConfig[metricName]
  // Grouped - sum the drilldown results rather than display separate values for the same form
  if (tileConfig.drillDownGrouped) {
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
          { text: countsMap.get(formId) }
        ])
      }
    })
  } else {
    // Not grouped
    details.forEach((detail) => {
      const formNameInfo = formMap.get(detail.formId)
      if (formNameInfo) {
        rows.push([
          {
            html: `<a href="/library/${formNameInfo.slug}" class="govuk-link govuk-link--no-visited-state">${formNameInfo.name}</a>`
          },
          { text: formNameInfo.organisation },
          { ...mapCustomValue(metricName, detail) }
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
 * @param {{ text: string, attributes?: any, classes?: string }[]} head
 * @param {FormMetricName} metricName
 */
function addCustomHeaders(head, metricName) {
  if (metricName === FormMetricName.NewFormsCreated) {
    head.push({ text: 'Created date', attributes: { 'aria-sort': 'none' } })
  }
  if (metricName === FormMetricName.FormsFirstPublished) {
    head.push({
      text: 'First published date',
      attributes: { 'aria-sort': 'none' }
    })
  }
  if (metricName === FormMetricName.FormsRePublished) {
    head.push({ text: 'Re-published', attributes: { 'aria-sort': 'none' } })
  }
  if (metricName === FormMetricName.Submissions) {
    head.push({ text: 'Submissions', attributes: { 'aria-sort': 'none' } })
  }
}

/**
 * @param {FormMetricName} metricName
 * @param {FormTimelineMetric} detail
 */
function mapCustomValue(metricName, detail) {
  if (metricName === FormMetricName.NewFormsCreated) {
    return dateCell(detail.createdAt)
  }
  if (metricName === FormMetricName.FormsFirstPublished) {
    return dateCell(detail.createdAt)
  }
  if (metricName === FormMetricName.FormsRePublished) {
    return { text: detail.metricValue }
  }
  if (metricName === FormMetricName.Submissions) {
    return numberCell(detail.metricValue)
  }
}

/**
 * @param { string | Date } dateString
 */
function dateCell(dateString) {
  const date = new Date(dateString)
  return {
    text: format(date, 'dd MMM yyyy h:mm aaa'),
    attributes: {
      'data-sort-value': format(date, 'dd MMM yyyy h:mm aaa')
    }
  }
}

/**
 * @param {number} num
 */
function numberCell(num) {
  return {
    text: num,
    attributes: {
      'data-sort-value': num
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
 * @param {Input} input
 * @returns {Promise<string>}
 */
export function createCsv(input) {
  return new Promise((resolve, reject) => {
    stringify(
      input,
      { bom: true, quoted: true },
      /** @type {Callback} */ function (err, output) {
        if (err) {
          reject(
            err instanceof Error
              ? err
              : // @ts-expect-error - error object not strongly typed
                new Error(`CSV stringify error: ${err.message}`)
          )
          return
        }

        resolve(Buffer.from(output, 'utf8').toString())
      }
    )
  })
}

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export async function getLiveMetricsAsCsv(metrics) {
  const liveOnly = metrics.overview.filter(
    (ov) => ov.formStatus === FormStatus.Live
  )

  // Sort forms by name then status
  const formsSorted = liveOnly.toSorted((a, b) => {
    const formNameA = /** @type {string} */ (a.summaryMetrics.name)
    const formNameB = /** @type {string} */ (b.summaryMetrics.name)
    return formNameA.localeCompare(formNameB)
  })

  const headers = ['Form name', 'Form URL', 'Live submissions']

  const values = /** @type {string[][]} */ ([])
  values.push(headers)

  formsSorted.forEach((ov) => {
    const summaryMetrics = /** @type {{ name: string, slug: string }} */ (
      ov.summaryMetrics
    )
    const count = /** @type { number | undefined } */ (ov.submissionsCount)
    values.push([
      summaryMetrics.name,
      `${config.appBaseUrl}/library/${summaryMetrics.slug}`,
      `${count ?? 0}`
    ])
  })

  const csv = await createCsv(values)

  return csv
}

/**
 * @import { FormOverviewMetric, FormTimelineMetric, FormTotalsMetric } from '@defra/forms-model'
 * @import { Input, Callback } from 'csv-stringify'
 * @import { FilterAndSortCriteria } from '~/src/models/admin/metrics-helper.js'
 */
