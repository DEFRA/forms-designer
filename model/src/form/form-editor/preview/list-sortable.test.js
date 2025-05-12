import {
  QuestionPreviewElements,
  QuestionRendererStub,
  baseElements as baseElementsBase
} from '~/src/form/form-editor/__stubs__/preview.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'

describe('list-sortable', () => {
  const list1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
  const list2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
  const list3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
  const list4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'
  const baseElements = /** @type {BaseSettings} */ ({
    ...baseElementsBase,
    items: [
      {
        label: { text: 'Treasure Hunting' },
        text: 'Treasure Hunting',
        value: 'Treasure Hunting',
        id: list1Id
      },
      {
        label: { text: 'Rescuing the princess' },
        text: 'Rescuing the princess',
        value: 'Rescuing the princess',
        id: list2Id
      },
      {
        label: { text: 'Saving a city' },
        text: 'Saving a city',
        value: 'Saving a city',
        id: list3Id
      },
      {
        label: { text: 'Defeating the baron' },
        text: 'Defeating the baron',
        value: 'Defeating the baron',
        id: list4Id
      }
    ]
  })
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
      expect(preview.renderInput.fieldset.legend.text).toBe(
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
 * @import { List, ListElements, BaseSettings } from '@defra/forms-model'
 */
