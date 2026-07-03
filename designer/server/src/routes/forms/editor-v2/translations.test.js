import xlsx from 'xlsx'

import {
  validateFileSelected,
  validateWorkbook
} from '~/src/routes/forms/editor-v2/translations.js'

describe('validateWorkbook', () => {
  function createWorkbook(rows) {
    const workbook = xlsx.utils.book_new()
    const worksheet = xlsx.utils.aoa_to_sheet(rows)
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations')
    return workbook
  }

  test('accepts a workbook with exact headers and non-empty required cells', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position in form', 'English content', 'Welsh content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo']
    ])

    expect(validateWorkbook(workbook)).toBe(workbook)
  })

  test('accepts a workbook with an empty Welsh content cell', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position in form', 'English content', 'Welsh content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', '']
    ])

    expect(validateWorkbook(workbook)).toBe(workbook)
  })

  test('rejects a workbook with missing header columns', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position in form', 'English content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Invalid workbook')
  })

  test('rejects a workbook with incorrect header titles', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position', 'English content', 'Welsh content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Invalid workbook')
  })

  test('rejects when required cells are empty', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position in form', 'English content', 'Welsh content'],
      ['', 'Page 1 title', 'Hello', 'Helo']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Invalid workbook')
  })

  test('rejects an extra non-empty column in a row', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position in form', 'English content', 'Welsh content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo', 'extra']
    ])

    expect(() => validateWorkbook(workbook)).toThrow('Invalid workbook')
  })

  test('validateFileSelected returns translation workbook error for invalid workbook bytes', () => {
    const workbook = createWorkbook([
      ['Data reference', 'Position', 'English content', 'Welsh content'],
      ['components.123e4567-e89b-12d3-a456-426614174000.title', 'Page 1 title', 'Hello', 'Helo']
    ])
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    const mockHelpers = { error: jest.fn((type) => ({ type, isJoiError: true })) }

    const result = validateFileSelected(buffer, mockHelpers)

    expect(mockHelpers.error).toHaveBeenCalledWith('custom.invalidTranslationWorkbook')
    expect(result).toEqual({ type: 'custom.invalidTranslationWorkbook', isJoiError: true })
  })
})
