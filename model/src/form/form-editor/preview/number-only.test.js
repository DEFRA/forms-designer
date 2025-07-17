import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { NumberOnlyQuestion } from '~/src/form/form-editor/preview/number-only.js'

describe('NumberOnly', () => {
  it('should create class', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const res = new NumberOnlyQuestion(elements, renderer)
    expect(res.renderInput).toEqual({
      id: 'numberField',
      name: 'numberField',
      classes: '',
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l'
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      },
      type: 'number'
    })
  })
})

/**
 * @import { QuestionElements } from '~/src/form/form-editor/preview/types.js'
 */
