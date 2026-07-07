import { ComponentType, hasComponents } from '@defra/forms-model'
import xlsx from 'xlsx'

import { testFormDefinitionWithRadioQuestionAndList } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import {
  getTranslationsAsExcel,
  validateWorkbook
} from '~/src/models/forms/editor-v2/translations-excel.js'

const validHeaders = [
  'Data reference (do not edit)',
  'Position in form',
  'English content',
  'Welsh content',
  'Notes'
]

describe('translations-excel', () => {
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
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          'Page 1 title',
          'Hello',
          'Helo'
        ]
      ])

      expect(validateWorkbook(workbook)).toEqual({
        'components.123e4567-e89b-12d3-a456-426614174000.title': 'Helo'
      })
    })

    test('accepts a workbook with an empty Welsh content cell', () => {
      const workbook = createWorkbook([
        validHeaders,
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          'Page 1 title',
          'Hello',
          ''
        ]
      ])

      expect(validateWorkbook(workbook)).toEqual({
        'components.123e4567-e89b-12d3-a456-426614174000.title': ''
      })
    })

    test('rejects a workbook with invalid data', () => {
      // @ts-expect-error - invalid data
      expect(() => validateWorkbook({})).toThrow('Not a spreadsheet workbook')
    })

    test('rejects a workbook with no rows', () => {
      const workbook = createWorkbook([])

      expect(() => validateWorkbook(workbook)).toThrow('No rows found')
    })

    test('rejects a workbook with missing header columns', () => {
      const workbook = createWorkbook([
        ['Data reference (do not edit)', 'Position in form', 'English content'],
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          'Page 1 title',
          'Hello'
        ]
      ])

      expect(() => validateWorkbook(workbook)).toThrow(
        'Too few columns (expected 5, got 3)'
      )
    })

    test('rejects a workbook with incorrect header titles', () => {
      const workbook = createWorkbook([
        [
          'Data reference (do not edit)',
          'Position',
          'English content',
          'Welsh content',
          'Notes'
        ],
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          'Page 1 title',
          'Hello',
          'Helo',
          ''
        ]
      ])

      expect(() => validateWorkbook(workbook)).toThrow(
        "Missing column 'Position in form'"
      )
    })

    test('rejects when required cells are empty', () => {
      const workbook = createWorkbook([
        validHeaders,
        ['', 'Page 1 title', 'Hello', 'Helo']
      ])

      expect(() => validateWorkbook(workbook)).toThrow(
        "Missing value in column 'Data reference (do not edit)'"
      )
    })

    test('rejects an extra non-empty column in a row', () => {
      const workbook = createWorkbook([
        validHeaders,
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          'Page 1 title',
          'Hello',
          'Helo',
          'extra'
        ]
      ])

      expect(() => validateWorkbook(workbook)).toThrow('Extra values found')
    })

    test('rejects a row with missing positionInForm value', () => {
      const workbook = createWorkbook([
        validHeaders,
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          '',
          'Hello',
          'Helo',
          'extra'
        ]
      ])

      expect(() => validateWorkbook(workbook)).toThrow(
        "Missing value in column 'Position in form'"
      )
    })

    test('rejects a row with missing englishContent value', () => {
      const workbook = createWorkbook([
        validHeaders,
        [
          'components.123e4567-e89b-12d3-a456-426614174000.title',
          'Page 1 title',
          '',
          'Helo',
          'extra'
        ]
      ])

      expect(() => validateWorkbook(workbook)).toThrow(
        "Missing value in column 'English content'"
      )
    })
  })

  describe('getTranslationsAsExcel', () => {
    it('should create buffer', () => {
      const definition = {
        ...testFormDefinitionWithRadioQuestionAndList,
        name: 'my form name'
      }

      // Override to populate shortDescription, option item itds, and option item hint
      const page = /** @type {PageQuestion} */ (definition.pages[0])
      const component = hasComponents(page) ? page.components[0] : undefined
      if (component?.type === ComponentType.RadiosField) {
        component.shortDescription = 'radio field'
      }
      const list = definition.lists[0]
      list.items[0].hint = { text: 'Radio hint 1' }
      list.items[0].id = 'option-1-guid'
      list.items[1].id = 'option-2-guid'
      list.items[2].id = 'option-3-guid'

      // Add some translations into definition
      definition.metadata = {
        translations: {
          cy: {
            'components.q1.shortDescription': 'welsh short desc',
            'metadata.contact.phone': '0555777888',
            'listItems.option-1-guid.hint': 'welsh option 1 hint'
          }
        }
      }

      const res = getTranslationsAsExcel(testFormMetadata, definition)

      const workbook = xlsx.read(res)

      // Convert from XLSX to JSON and check entries
      const json = validateWorkbook(workbook)
      expect(json).toEqual({
        'components.q1.shortDescription': 'welsh short desc',
        'components.q1.title': '',
        'listItems.option-1-guid.text': '',
        'listItems.option-1-guid.hint': 'welsh option 1 hint',
        'listItems.option-2-guid.text': '',
        'listItems.option-3-guid.text': '',
        'metadata.contact.email.address': '',
        'metadata.contact.email.responseTime': '',
        'metadata.contact.online.text': '',
        'metadata.contact.online.url': '',
        'metadata.contact.phone': '0555777888',
        'metadata.formName': '',
        'metadata.privacyNoticeText': '',
        'metadata.submissionGuidance': '',
        'pages.p1.title': ''
      })
    })
  })
})

/**
 * @import { PageQuestion } from '@defra/forms-model'
 */
