import { getQuestionType } from '~/src/routes/forms/editor-v2/helper.js'

const mockFlash = jest.fn().mockImplementation(() => ['UkAddress'])

const mockYar = /** @type {Yar}} */ ({
  flash: mockFlash,
  id: '',
  reset: jest.fn(),
  set: jest.fn(),
  get: jest.fn(),
  clear: jest.fn(),
  touch: jest.fn(),
  lazy: jest.fn(),
  commit: jest.fn()
})

const mockFormValuesNoValue1 = /** @type {FormEditor | undefined} */ ({})

const mockFormValuesNoValue2 = /** @type {FormEditor | undefined} */ ({
  questionType: undefined
})

const mockFormValuesWithFormValues = /** @type {FormEditor | undefined} */ ({
  questionType: 'TextField'
})

describe('Editor v2 route helper', () => {
  test('should get value from session if not in formValues 1', () => {
    expect(getQuestionType(mockYar, undefined)).toBe('UkAddress')
  })

  test('should get value from session if not in formValues 2', () => {
    expect(getQuestionType(mockYar, mockFormValuesNoValue1)).toBe('UkAddress')
  })

  test('should get value from session if not in formValues 3', () => {
    expect(getQuestionType(mockYar, mockFormValuesNoValue2)).toBe('UkAddress')
  })

  test('should get value from formValues if exists', () => {
    expect(getQuestionType(mockYar, mockFormValuesWithFormValues)).toBe(
      'TextField'
    )
  })
})

/**
 * @import { FormEditor } from '@defra/forms-model'
 * @import { Yar } from '@hapi/yar'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
