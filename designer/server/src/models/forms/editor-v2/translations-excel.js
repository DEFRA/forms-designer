import xlsx from 'xlsx'

import { buildTranslationRows } from '~/src/models/forms/editor-v2/translations.js'

/**
 * @typedef {{ title: string, dataKey: string, attributes?: { wch?: number } }} WorksheetColumn
 * @typedef {Buffer} XLSXBuffer
 */

const COLUMN_INDEX_DATA_REFERENCE = 0
const COLUMN_INDEX_POSITION_IN_FORM = 1
const COLUMN_INDEX_ENGLISH_CONTENT = 2
const COLUMN_INDEX_WELSH_CONTENT = 3

const COLUMN_HEADERS = [
  {
    title: 'Data reference (do not edit)',
    dataKey: 'dataReference',
    attributes: { wch: 70 }
  },
  {
    title: 'Position in form',
    dataKey: 'positionInForm',
    attributes: { wch: 40 }
  },
  {
    title: 'English content',
    dataKey: 'englishContent',
    attributes: { wch: 40 }
  },
  {
    title: 'Welsh content',
    dataKey: 'welshContent',
    attributes: { wch: 40 }
  },
  {
    title: 'Notes',
    dataKey: 'notes',
    attributes: { wch: 40 }
  }
]

/**
 * @param {FormMetadata} metadata
 * @param {FormDefinition} definition
 */
export function getTranslationsAsExcel(metadata, definition) {
  // Create an excel file
  const workbook = xlsx.utils.book_new()

  const rows = []
  const allTableRows = buildTranslationRows(metadata, definition)

  const tables = allTableRows.filter((tab) => tab.table.length)
  for (const outerTable of tables) {
    for (const translation of outerTable.table) {
      rows.push([
        translation.name,
        translation.label,
        translation.englishContent,
        translation.welshContent,
        ''
      ])
    }
  }

  addWorksheet(
    workbook,
    COLUMN_HEADERS,
    rows,
    definition.name ?? 'Translations'
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
 * @param {any[][]} rows
 * @param {string} worksheetName
 */
function addWorksheet(workbook, columns, rows, worksheetName) {
  const headers = columns.map((col) => col.title)

  const worksheet = xlsx.utils.aoa_to_sheet([headers, ...rows])

  // Apply column widths
  const colAttributes = /** @type {Array<{ wch?: number }>} */ (
    columns.map((col) => col.attributes).filter((attr) => attr !== undefined)
  )
  worksheet['!cols'] = colAttributes

  xlsx.utils.book_append_sheet(workbook, worksheet, worksheetName)
}

/**
 * @param {xlsx.WorkBook | undefined} workbook
 */
export function validateWorkbook(workbook) {
  if (
    !workbook ||
    typeof workbook !== 'object' ||
    !Array.isArray(workbook.SheetNames) ||
    workbook.SheetNames.length === 0
  ) {
    throw new Error('Not a spreadsheet workbook')
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  if (typeof worksheet !== 'object') {
    throw new Error('First sheet is not a spreadsheet')
  }

  const rows = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: ''
  })

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No rows found')
  }

  // @ts-expect-error - dynamic data type
  const headerRow = rows[0].map((value) => String(value).trim())

  const translationHeaders = COLUMN_HEADERS.map((h) => h.title)

  // Validate header row
  validateHeaderRow(headerRow, translationHeaders)

  // Validate data rows
  return validateDataRows(rows, translationHeaders)
}

/**
 * @param {any[]} headerRow
 * @param {string[]} translationHeaders
 */
function validateHeaderRow(headerRow, translationHeaders) {
  if (headerRow.length < translationHeaders.length) {
    throw new Error(
      `Too few columns (expected ${translationHeaders.length}, got ${headerRow.length})`
    )
  }

  for (let i = 0; i < translationHeaders.length; i += 1) {
    if (headerRow[i] !== translationHeaders[i]) {
      throw new Error(`Missing column '${translationHeaders[i]}'`)
    }
  }
}

/**
 * @param {any[]} row
 * @param {number} colIndex
 */
function getCellValue(row, colIndex) {
  return String(row[colIndex] ?? '').trim()
}

/**
 * @param {any[]} rows
 * @param {string[]} translationHeaders
 */
function validateDataRows(rows, translationHeaders) {
  // Get data rows (excluding header row)
  const dataRows = rows.slice(1)
  // Determine last data row that has values
  const lastDataRowIndex = dataRows.reduce((lastIndex, row, index) => {
    // @ts-expect-error - dynamic data type
    const hasValue = row.some((cell) => String(cell).trim() !== '')
    return hasValue ? index : lastIndex
  }, -1)

  /** @type {Record<string, string>} */
  const json = {}
  for (let rowIndex = 0; rowIndex <= lastDataRowIndex; rowIndex += 1) {
    const row = dataRows[rowIndex]
    if (!Array.isArray(row)) {
      throw new Error(`Invalid row ${rowIndex + 1}`)
    }

    const dataReference = getCellValue(row, COLUMN_INDEX_DATA_REFERENCE)
    const positionInForm = getCellValue(row, COLUMN_INDEX_POSITION_IN_FORM)
    const englishContent = getCellValue(row, COLUMN_INDEX_ENGLISH_CONTENT)
    const welshContent = getCellValue(row, COLUMN_INDEX_WELSH_CONTENT)

    if (!dataReference) {
      throw new Error(
        `Missing value in column '${translationHeaders[COLUMN_INDEX_DATA_REFERENCE]}'`
      )
    }
    if (!positionInForm) {
      throw new Error(
        `Missing value in column '${translationHeaders[COLUMN_INDEX_POSITION_IN_FORM]}'`
      )
    }
    if (!englishContent) {
      throw new Error(
        `Missing value in column '${translationHeaders[COLUMN_INDEX_ENGLISH_CONTENT]}'`
      )
    }

    for (let colIndex = 4; colIndex < row.length; colIndex += 1) {
      if (String(row[colIndex] ?? '').trim() !== '') {
        throw new Error('Extra values found')
      }
    }
    json[dataReference] = welshContent
  }

  return json
}

/**
 * @import { FormDefinition, FormMetadata } from '@defra/forms-model'
 */
