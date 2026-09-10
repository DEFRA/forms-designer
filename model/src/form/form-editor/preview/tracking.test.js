import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import { TrackingQuestion } from '~/src/form/form-editor/preview/tracking.js'

describe('TrackingQuestion', () => {
  it('should create class', () => {
    const renderer = new QuestionRendererStub(jest.fn())
    const elements = /** @type {QuestionElements} */ (
      new QuestionPreviewElements(baseElements)
    )
    const res = new TrackingQuestion(elements, renderer)
    expect(res).toBeDefined()
  })
})

/**
 * @import { QuestionElements } from '~/src/form/form-editor/preview/types.js'
 */
