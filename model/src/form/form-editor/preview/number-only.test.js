import {
  NumberPreviewElements,
  QuestionRendererStub,
  numberElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { NumberOnlyQuestion } from '~/src/form/form-editor/preview/number-only.js'

describe('NumberOnly', () => {
  it('should create class', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {NumberElements} */ (
      new NumberPreviewElements(numberElements)
    )
    const res = new NumberOnlyQuestion(elements, renderer)
    expect(res.renderInput).toEqual({
      id: 'numberField',
      name: 'numberField',
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
      type: 'number',
      previewClasses: ''
    })
  })

  it('should create class with prefix and suffix', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {NumberElements} */ (
      new NumberPreviewElements({
        ...numberElements,
        prefix: 'pre',
        suffix: 'suf'
      })
    )
    const res = new NumberOnlyQuestion(elements, renderer)
    expect(res.renderInput).toEqual({
      id: 'numberField',
      name: 'numberField',
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
      type: 'number',
      previewClasses: '',
      prefix: {
        text: 'pre'
      },
      suffix: {
        text: 'suf'
      }
    })
  })

  it('should set prefix', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {NumberElements} */ (
      new NumberPreviewElements({
        ...numberElements,
        prefix: '',
        suffix: ''
      })
    )
    const res = new NumberOnlyQuestion(elements, renderer)
    res.prefix = 'pre'
    expect(res.renderInput).toEqual({
      id: 'numberField',
      name: 'numberField',
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
      type: 'number',
      previewClasses: '',
      prefix: {
        text: 'pre'
      }
    })
  })

  it('should set suffix', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {NumberElements} */ (
      new NumberPreviewElements({
        ...numberElements,
        prefix: '',
        suffix: ''
      })
    )
    const res = new NumberOnlyQuestion(elements, renderer)
    res.suffix = 'suf'
    expect(res.renderInput).toEqual({
      id: 'numberField',
      name: 'numberField',
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
      type: 'number',
      previewClasses: '',
      suffix: {
        text: 'suf'
      }
    })
  })
})

/**
 * @import { NumberElements } from '~/src/form/form-editor/preview/types.js'
 */
