import xlsx from 'xlsx'

import { buildTranslationRows } from '~/src/models/forms/editor-v2/translations.js'

/**
 * @typedef {{ title: string, dataKey: string, attributes?: { wch?: number } }} WorksheetColumn
 * @typedef {Buffer} XLSXBuffer
 */

const headers = [
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
        translation.welshContent
      ])
    }
  }

  addWorksheet(workbook, headers, rows, definition.name ?? 'Translations')

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

  // Validate header row

  // @ts-expect-error - dynamic data type
  const headerRow = rows[0].map((value) => String(value).trim())

  const translationHeaders = headers.map((h) => h.title)

  if (headerRow.length !== translationHeaders.length) {
    throw new Error(
      `Wrong number of columns (expected ${translationHeaders.length}, got ${headerRow.length})`
    )
  }

  for (let i = 0; i < translationHeaders.length; i += 1) {
    if (headerRow[i] !== translationHeaders[i]) {
      throw new Error(`Missing column '${translationHeaders[i]}'`)
    }
  }

  // Validate data rows
  return validateDataRows(rows, translationHeaders)
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

    const dataReference = String(row[0] ?? '').trim()
    const positionInForm = String(row[1] ?? '').trim()
    const englishContent = String(row[2] ?? '').trim()
    const welshContent = String(row[3] ?? '')

    if (!dataReference) {
      throw new Error(`Missing value in column '${translationHeaders[0]}'`)
    }
    if (!positionInForm) {
      throw new Error(`Missing value in column '${translationHeaders[1]}'`)
    }
    if (!englishContent) {
      throw new Error(`Missing value in column '${translationHeaders[2]}'`)
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
