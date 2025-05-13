import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { ShortAnswerQuestion } from '~/src/form/form-editor/preview/short-answer.js'

describe('ShortAnswer', () => {
  it('should create class', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const res = new ShortAnswerQuestion(elements, renderer)
    expect(res).toBeDefined()
  })
})

/**
 * @import { QuestionElements } from '@defra/forms-model'
 */
