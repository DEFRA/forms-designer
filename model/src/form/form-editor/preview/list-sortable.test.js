import {
  QuestionPreviewElements,
  QuestionRendererStub,
  listElementsStub
} from '~/src/form/form-editor/__stubs__/preview.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'

describe('list-sortable', () => {
  const { baseElements } = listElementsStub
  const renderer = new QuestionRendererStub(jest.fn())
  /**
   * @type {ListElements}
   */
  let questionElements = new QuestionPreviewElements(baseElements)

  beforeEach(() => {
    questionElements = new QuestionPreviewElements(baseElements)
  })

  describe('integration', () => {
    it('should setup', () => {
      const preview = new ListSortableQuestion(questionElements, renderer)
      expect(preview.renderInput.fieldset?.legend.text).toBe(
        'Which quest would you like to pick?'
      )
    })
  })

  describe('ListSortable class', () => {
    it('should resync preview after reorder', () => {
      const emptyQuestionElements = new QuestionPreviewElements({
        ...baseElements,
        items: []
      })
      const preview = new ListSortableQuestion(emptyQuestionElements, renderer)
      expect(preview._list.size).toBe(0)
      const preview2 = new ListSortableQuestion(questionElements, renderer)
      preview2.resyncPreviewAfterReorder()
      expect(preview2._list.size).toBe(4)
    })
  })
})

/**
 * @import { ListElements, BaseSettings } from '~/src/form/form-editor/preview/types.js'
 */
