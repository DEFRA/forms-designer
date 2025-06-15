import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { LongAnswerQuestion } from '~/src/form/form-editor/preview/long-answer.js'

describe('Long Answer', () => {
  it('should create class', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const res = new LongAnswerQuestion(elements, renderer)
    expect(res.renderInput).toEqual({
      id: 'longAnswerField',
      name: 'longAnswerField',
      classes: '',
      label: {
        text: 'Which quest would you like to pick?',
        classes: 'govuk-label--l'
      },
      hint: {
        text: 'Choose one adventure that best suits you.',
        classes: ''
      }
    })
  })
})

/**
 * @import { QuestionElements } from '~/src/form/form-editor/preview/types.js'
 */
