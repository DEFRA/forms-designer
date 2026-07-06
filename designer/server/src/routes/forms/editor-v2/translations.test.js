import xlsx from 'xlsx'

import { validateWorkbook } from '~/src/models/forms/editor-v2/translations-excel.js'
import { validateFileSelected } from '~/src/routes/forms/editor-v2/translations.js'

const validHeaders = ['Data reference (do not edit)', 'Position in form', 'English content', 'Welsh content', 'Notes']

describe('validateWorkbook', () => {
  // @ts-expect-error - dynamic rows
  function createWorkbook(rows) {
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.aoa_to_sheet(rows)
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations')
    return workbook
  }

  test('accepts a workbook with exact headers and non-empty required cells', () => {
    const workbook = createWorkbook([
      validHeaders,
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo']
    ])

    expect(validateWorkbook(workbook)).toEqual({
      'components.123e4567-e89b-12d3-a456-426614174000.title': 'Helo'
    })
  })

  test('accepts a workbook with an empty Welsh content cell', () => {
    const workbook = createWorkbook([
      validHeaders,
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', '']
    ])

    expect(validateWorkbook(workbook)).toEqual({
      'components.123e4567-e89b-12d3-a456-426614174000.title': ''
    })
  })

  test('rejects a workbook with missing header columns', () => {
    const workbook = createWorkbook([
      ['Data reference (do not edit)', 'Position in form', 'English content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Wrong number of columns (expected 5, got 3)')
  })

  test('rejects a workbook with incorrect header titles', () => {
    const workbook = createWorkbook([
      ['Data reference (do not edit)', 'Position', 'English content', 'Welsh content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Wrong number of columns (expected 5, got 4)')
  })

  test('rejects when required cells are empty', () => {
    const workbook = createWorkbook([
      validHeaders,
      ['', 'Page 1 title', 'Hello', 'Helo']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Missing value in column \'Data reference (do not edit)\'')
  })

  test('rejects an extra non-empty column in a row', () => {
    const workbook = createWorkbook([
      validHeaders,
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo', 'extra']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Extra values found')
  })

  test('validateFileSelected returns translation workbook error for invalid workbook bytes', () => {
    const buffer = Buffer.from('invalid')
    const mockHelpers = { error: jest.fn((type) => ({ type, isJoiError: true })) }

    const result = validateFileSelected(buffer, mockHelpers)

    expect(mockHelpers.error).toHaveBeenCalledWith(
      'custom.invalidTranslationWorkbook',
      {
        reason: 'Wrong number of columns (expected 5, got 1)'
      }
    )
    expect(result).toEqual({ type: 'custom.invalidTranslationWorkbook', isJoiError: true })
  })
})
