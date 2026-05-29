import xlsx from 'xlsx'

import {
  metricsComponentUsageViewModel,
  metricsFormActivityViewModel
} from '~/src/models/admin/metrics.js'

/**
 * @typedef {string | number | Date | undefined} ExcelCellValue
 * @typedef {{ title: string, dataKey: string, attributes?: { wch?: number } }} WorksheetColumn
 * @typedef {Buffer} XLSXBuffer
 */

const activityColumns = [
  {
    title: 'Form name',
    dataKey: 'formName',
    attributes: { wch: 50 }
  },
  {
    title: 'Organisation',
    dataKey: 'organisation',
    attributes: { wch: 30 }
  },
  {
    title: 'Status',
    dataKey: 'status'
  },
  {
    title: 'Pages',
    dataKey: 'pages'
  },
  {
    title: 'Question types',
    dataKey: 'questionTypes'
  },
  {
    title: 'Conditions',
    dataKey: 'conditions'
  },
  {
    title: 'Sections',
    dataKey: 'sections'
  },
  {
    title: 'Republished',
    dataKey: 'republished',
    attributes: { wch: 15 }
  },
  {
    title: 'Days to publish',
    dataKey: 'daysToPublish',
    attributes: { wch: 15 }
  },
  {
    title: 'Features',
    dataKey: 'features',
    attributes: { wch: 30 }
  },
  {
    title: 'Submissions',
    dataKey: 'submissions'
  }
]

const questionTypesColumns = [
  {
    title: 'Question type',
    dataKey: 'questionTypeName',
    attributes: { wch: 30 }
  },
  {
    title: 'Total usage (draft)',
    dataKey: 'draft.totalUsage',
    attributes: { wch: 20 }
  },
  {
    title: 'Forms using (draft)',
    dataKey: 'draft.formsUsing',
    attributes: { wch: 20 }
  },
  {
    title: 'Percentage (draft)',
    dataKey: 'draft.percentage',
    attributes: { wch: 20 }
  },
  {
    title: 'Total usage (live)',
    dataKey: 'live.totalUsage',
    attributes: { wch: 20 }
  },
  {
    title: 'Forms using (live)',
    dataKey: 'live.formsUsing',
    attributes: { wch: 20 }
  },
  {
    title: 'Percentage (live)',
    dataKey: 'live.percentage',
    attributes: { wch: 20 }
  }
]

const featuresColumns = [
  {
    title: 'Feature',
    dataKey: 'featureName',
    attributes: { wch: 25 }
  },
  {
    title: 'Forms using (draft)',
    dataKey: 'draft.formsUsing',
    attributes: { wch: 20 }
  },
  {
    title: 'Percentage (draft)',
    dataKey: 'draft.percentage',
    attributes: { wch: 20 }
  },
  {
    title: 'Forms using (live)',
    dataKey: 'live.formsUsing',
    attributes: { wch: 20 }
  },
  {
    title: 'Percentage (live)',
    dataKey: 'live.percentage',
    attributes: { wch: 20 }
  }
]

const formStructureColumns = [
  {
    title: 'Metric',
    dataKey: 'metricName',
    attributes: { wch: 30 }
  },
  {
    title: 'Average (draft)',
    dataKey: 'draft.average',
    attributes: { wch: 15 }
  },
  {
    title: 'Minimum (draft)',
    dataKey: 'draft.minimum',
    attributes: { wch: 15 }
  },
  {
    title: 'Maximum (draft)',
    dataKey: 'draft.maximum',
    attributes: { wch: 15 }
  },
  {
    title: 'Average (live)',
    dataKey: 'live.average',
    attributes: { wch: 15 }
  },
  {
    title: 'Minimum (live)',
    dataKey: 'live.minimum',
    attributes: { wch: 15 }
  },
  {
    title: 'Maximum (live)',
    dataKey: 'live.maximum',
    attributes: { wch: 15 }
  }
]

/**
 * @param {{ overview: FormOverviewMetric[], totals: FormTotalsMetric }} metrics
 */
export function getMetricsAsExcel(metrics) {
  // Create an excel file - one workbook with multiple worksheets
  const workbook = xlsx.utils.book_new()

  // Form Activity
  const { formMetricRows } = metricsFormActivityViewModel(metrics, {
    sortCol: 'formName',
    sortDir: 'ascending'
  })
  addWorksheet(workbook, activityColumns, formMetricRows, 'Form activity')

  // Component usage - question types
  const componentUsage = metricsComponentUsageViewModel(metrics)
  addWorksheet(
    workbook,
    questionTypesColumns,
    componentUsage.formUsageQuestionTypes,
    'Usage - Question types'
  )

  // Component usage - features
  addWorksheet(
    workbook,
    featuresColumns,
    componentUsage.formUsageFeatures,
    'Usage - Features'
  )

  // Component usage - features
  addWorksheet(
    workbook,
    formStructureColumns,
    componentUsage.formUsageFormStructures,
    'Usage - Form structure'
  )

  const buffer = /** @type {XLSXBuffer} */ (
    xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer'
    })
  )

  return buffer
}

/**
 *
 * @param {xlsx.WorkBook} workbook
 * @param {WorksheetColumn[]} columns
 * @param {any[]} metricRows
 * @param {string} worksheetName
 */
function addWorksheet(workbook, columns, metricRows, worksheetName) {
  const headers = columns.map((col) => col.title)

  const rows = /** @type {(string | number | Date | undefined)[][]} */ ([])
  for (const metricRow of metricRows) {
    const rowMap = constructRowKeyMap(metricRow)
    const row = /** @type {(string | number | Date | undefined)[]} */ ([])
    columns.forEach((col) => {
      const value = rowMap.get(col.dataKey)
      const defaultVal = col.dataKey.includes('percentage') ? '0%' : 0
      return row.push(value ?? defaultVal)
    })
    rows.push(row)
  }

  const worksheet = xlsx.utils.aoa_to_sheet([headers, ...rows], {
    dateNF: 'dd/mm/yyyy'
  })

  // Apply column widths
  const colAttributes = /** @type {Array<{ wch?: number }>} */ (
    columns.map((col) => col.attributes).filter((attr) => attr !== undefined)
  )
  worksheet['!cols'] = colAttributes

  xlsx.utils.book_append_sheet(workbook, worksheet, worksheetName)
}

/**
 * @param {TableRowMetric} metricRow
 */
function constructRowKeyMap(metricRow) {
  const rowMap = /** @type {Map<string, ExcelCellValue>} */ (new Map())
  for (const [key, value] of Object.entries(metricRow)) {
    if (key === 'draft' || key === 'live') {
      // Flatten
      for (const [childKey, childValue] of Object.entries(value)) {
        rowMap.set(`${key}.${childKey}`, childValue)
      }
    } else {
      rowMap.set(key, value)
    }
  }
  return rowMap
}

/**
 * @import { FormOverviewMetric, FormTotalsMetric } from '@defra/forms-model'
 * @import { TableRowMetric } from '~/src/models/admin/metrics-helper.js'
 */
