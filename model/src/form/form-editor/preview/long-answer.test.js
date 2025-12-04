import {
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'

/**
 * Test helper stub for multiline text field elements
 * @implements {MultilineTextFieldElements}
 */
class MultilineTextFieldPreviewElements {
  /**
   * @param {MultilineTextFieldSettings} settings
   */
  constructor(settings) {
    this._settings = settings
  }

  get values() {
    return this._settings
  }

  /**
   * @param {string} _value
   */
  setPreviewHTML(_value) {
    // Not implemented for tests
  }

  /**
   * @param {HTMLElement} _value
   */
  setPreviewDOM(_value) {
    // Not implemented for tests
  }
}

describe('Long Answer', () => {
  it('should create class', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 0,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)
    expect(res.renderInput).toEqual({
      id: 'longAnswerField',
      name: 'longAnswerField',
      classes: '',
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      rows: 5,
      previewClasses: ''
    })
  })

  it('should include maxlength when set and greater than 0', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 200,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)
    expect(res.renderInput).toEqual({
      id: 'longAnswerField',
      name: 'longAnswerField',
      classes: '',
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      maxlength: 200,
      rows: 5,
      previewClasses: ''
    })
  })

  it('should get maxLength property', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 150,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)
    expect(res.maxLength).toBe(150)
  })

  it('should set maxLength property and trigger render', () => {
    const renderFn = jest.fn()
    const renderer = new QuestionRendererStub(renderFn)
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 100,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)

    renderFn.mockClear()
    res.maxLength = 300

    expect(res.maxLength).toBe(300)
    expect(renderFn).toHaveBeenCalledTimes(1)
    // @ts-expect-error - maxlength is dynamically added
    expect(res.renderInput.maxlength).toBe(300)
  })

  it('should get rows property', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 0,
      rows: 10
    })
    const res = new LongAnswerQuestion(elements, renderer)
    expect(res.rows).toBe(10)
  })

  it('should set rows property and trigger render', () => {
    const renderFn = jest.fn()
    const renderer = new QuestionRendererStub(renderFn)
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 0,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)

    renderFn.mockClear()
    res.rows = 8

    expect(res.rows).toBe(8)
    expect(renderFn).toHaveBeenCalledTimes(1)
    // @ts-expect-error - rows is dynamically added
    expect(res.renderInput.rows).toBe(8)
  })

  it('should not include maxlength when 0', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 0,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)
    // @ts-expect-error - maxlength is dynamically added
    expect(res.renderInput.maxlength).toBeUndefined()
  })

  it('should handle maxLength set to 0', () => {
    const renderFn = jest.fn()
    const renderer = new QuestionRendererStub(renderFn)
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 200,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)

    renderFn.mockClear()
    res.maxLength = 0

    expect(res.maxLength).toBe(0)
    expect(renderFn).toHaveBeenCalledTimes(1)
    // @ts-expect-error - maxlength is dynamically added
    expect(res.renderInput.maxlength).toBeUndefined()
  })

  it('should handle negative maxLength by treating as falsy', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: -1,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)
    // Negative values should not add maxlength property
    // @ts-expect-error - maxlength is dynamically added
    expect(res.renderInput.maxlength).toBeUndefined()
  })

  it('should not include rows property when 0', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 0,
      rows: 0
    })
    const res = new LongAnswerQuestion(elements, renderer)
    // rows is only added when truthy (not 0)
    // @ts-expect-error - rows is dynamically added
    expect(res.renderInput.rows).toBeUndefined()
  })

  it('should handle custom rows value', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 0,
      rows: 15
    })
    const res = new LongAnswerQuestion(elements, renderer)
    // @ts-expect-error - rows is dynamically added
    expect(res.renderInput.rows).toBe(15)
  })

  it('should update both maxLength and rows independently', () => {
    const renderFn = jest.fn()
    const renderer = new QuestionRendererStub(renderFn)
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 100,
      rows: 5
    })
    const res = new LongAnswerQuestion(elements, renderer)

    renderFn.mockClear()

    // Update maxLength
    res.maxLength = 250
    expect(res.maxLength).toBe(250)
    expect(res.rows).toBe(5)
    expect(renderFn).toHaveBeenCalledTimes(1)

    // Update rows
    res.rows = 10
    expect(res.maxLength).toBe(250)
    expect(res.rows).toBe(10)
    expect(renderFn).toHaveBeenCalledTimes(2)

    // @ts-expect-error - maxlength and rows are dynamically added
    expect(res.renderInput.maxlength).toBe(250)
    // @ts-expect-error - maxlength and rows are dynamically added
    expect(res.renderInput.rows).toBe(10)
  })

  it('should render correctly with large maxLength values', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = new MultilineTextFieldPreviewElements({
      ...baseElements,
      maxLength: 10000,
      rows: 20
    })
    const res = new LongAnswerQuestion(elements, renderer)
    // @ts-expect-error - maxlength and rows are dynamically added
    expect(res.renderInput.maxlength).toBe(10000)
    // @ts-expect-error - maxlength and rows are dynamically added
    expect(res.renderInput.rows).toBe(20)
  })
})

/**
 * @import { MultilineTextFieldElements, MultilineTextFieldSettings } from '~/src/form/form-editor/preview/types.js'
 */
