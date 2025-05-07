import {
  list1HTML,
  listEmptyHTML
} from '~/src/javascripts/preview/__stubs__/list'
import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewTabsHTML,
  questionDetailsStubPanels
} from '~/src/javascripts/preview/__stubs__/question.js'
import {
  ListSortable,
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable'
import { List } from '~/src/javascripts/preview/list.js'
import { setupPreview } from '~/src/javascripts/preview.js'

jest.mock('~/src/javascripts/preview/nunjucks.js', () => {
  return {
    /**
     * @param {string} _template
     * @param {{ model: QuestionBaseModel }} _context
     * @returns {string}
     */
    render(_template, _context) {
      return '****UPDATED****'
    }
  }
})

jest.mock(
  '~/src/views/components/inset.njk',
  () => '<div class="govuk-inset-text"></div>'
)
jest.mock(
  '~/src/views/components/textfield.njk',
  () =>
    '<input class="govuk-input" id="question" name="question" type="text" value="What is your answer?">'
)
jest.mock(
  '~/src/views/components/radios.njk',
  () => '<div class="govuk-inset-text"></div>'
)

jest.mock(
  '~/src/views/components/date-input.njk',
  () =>
    '<div class="govuk-date-input" id="dateInput">' +
    '  <div class="govuk-date-input__item">' +
    '    <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="dateInput-day" name="day" type="text" inputmode="numeric">' +
    '  </div>' +
    '  <div class="govuk-date-input__item">' +
    '    <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="dateInput-month" name="month" type="text" inputmode="numeric">' +
    '  </div>' +
    '  <div class="govuk-date-input__item">' +
    '    <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="dateInput-year" name="year" type="text" inputmode="numeric">' +
    '  </div>' +
    '</div>'
)

describe('list-sortable', () => {
  const list1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
  const list2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
  const list3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
  const list4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'

  /**
   * @type {ListSortableQuestionElements}
   */
  let questionElements = new ListSortableQuestionElements()

  beforeEach(() => {
    document.body.innerHTML = questionDetailsStubPanels
    questionElements = new ListSortableQuestionElements()
  })

  const expectedList = [
    {
      id: list1Id,
      text: 'Treasure Hunting',
      value: 'Treasure Hunting',
      label: {
        classes: '',
        text: 'Treasure Hunting'
      }
    },
    {
      id: list2Id,
      text: 'Rescuing the princess',
      value: 'Rescuing the princess',
      label: {
        classes: '',
        text: 'Rescuing the princess'
      }
    },
    {
      id: list3Id,
      text: 'Saving a city',
      value: 'Saving a city',
      label: {
        classes: '',
        text: 'Saving a city'
      }
    },
    {
      id: list4Id,
      text: 'Defeating the baron',
      value: 'Defeating the baron',
      label: {
        classes: '',
        text: 'Defeating the baron'
      }
    }
  ]

  describe('integration', () => {
    it('should setup', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewTabsHTML
      const preview = /** @type {ListSortable} */ (setupPreview('radiosfield'))
      expect(preview.renderInput.fieldset.legend.text).toBe(
        'Which quest would you like to pick?'
      )
    })
  })

  describe('ListSortableQuestionElements', () => {
    it('should get all correct defaults', () => {
      expect(questionElements.values).toEqual({
        question: 'Which quest would you like to pick?',
        hintText: 'Choose one adventure that best suits you.',
        optional: false,
        shortDesc: 'your quest',
        items: expectedList
      })
      const listText = /** @type {HTMLInputElement} */ (
        document.getElementById('radioText')
      )
      expect(ListSortableQuestionElements.getUpdateData(listText)).toBeDefined()
      expect(
        ListSortableQuestionElements.getUpdateData(listText)
      ).not.toBeNull()
      const listItem = questionElements.listElements[2]
      expect(listItem).toBeDefined()
      listItem.dataset.hint = 'hint 1'
      expect(
        ListSortableQuestionElements.getListElementValues(listItem).hint
      ).toEqual({
        text: 'hint 1'
      })
      const newElement = document.createElement('li')
      newElement.dataset.text = 'A custom adventure'
      newElement.dataset.val = 'A custom adventure'
      expect(
        ListSortableQuestionElements.getListElementValues(newElement)
      ).toEqual({
        id: 'new',
        text: 'A custom adventure',
        label: {
          classes: '',
          text: 'A custom adventure'
        },
        value: 'A custom adventure'
      })
    })

    describe('should determine correct state of re-ordering', () => {
      it('should return true', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' + list1HTML
        const listSortable = new ListSortableQuestionElements()
        expect(listSortable.isReordering()).toBeTruthy()
      })

      it('should return false', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Done</button>'
        const listSortable = new ListSortableQuestionElements()
        expect(listSortable.isReordering()).toBeFalsy()
      })
    })

    describe('should handle re-order', () => {
      it('should set for reorder mode', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements()
        listSortable.handleReorder(new Event('dummy event'))
        const listContainer = document.getElementById('options-container')
        const allChildren = listContainer?.querySelectorAll('*')
        let cursorCount = 0
        allChildren?.forEach((child) => {
          const style = window.getComputedStyle(child)
          if (style.getPropertyValue('cursor') === 'move') {
            cursorCount++
          }
        })
        expect(cursorCount).toBe(49)
      })

      it('should set for non-reorder mode', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Done</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements()
        listSortable.handleReorder(new Event('dummy event'))
        const listContainer = document.getElementById('options-container')
        const allChildren = listContainer?.querySelectorAll('*')
        let cursorCount = 0
        allChildren?.forEach((child) => {
          const style = window.getComputedStyle(child)
          if (style.getPropertyValue('cursor') === 'default') {
            cursorCount++
          }
        })
        expect(cursorCount).toBe(49)
      })
    })
  })

  describe('ListSortableEventListeners', () => {
    const mockEvent = /** @type {Event} */ ({})
    describe('editPanelListeners', () => {
      it('should update the List class when listeners are called', () => {
        const preview = /** @type {ListSortable} */ (List.setupPreview())
        const listEventListeners = new ListSortableEventListeners(
          preview,
          questionElements,
          questionElements.listElements
        )
        expect(listEventListeners.editFieldHasFocus()).toBe(false)
        expect(preview.list[0]).toEqual({
          hint: undefined,
          id: '414d82a3-4cab-416a-bd54-6b86fbd51120',
          label: {
            classes: '',
            text: 'Treasure Hunting'
          },
          text: 'Treasure Hunting',
          value: 'Treasure Hunting'
        })

        const [
          textInputListener,
          textFocusListener,
          textBlurListener,
          hintInputListener,
          hintFocusListener,
          hintBlurListener
        ] = listEventListeners.editPanelListeners
        const listTextTarget = questionElements.listText
        listTextTarget.value = 'Extreme Treasure Hunting'
        const [, textInputListenerElement] = textInputListener
        const [, listTextHighlightHandler] = textFocusListener
        const [, listTextBlurHandler] = textBlurListener
        const [, listHintInputHandler] = hintInputListener
        const [, listHintHighlightHandler] = hintFocusListener
        const [, listHintBlurHandler] = hintBlurListener

        textInputListenerElement(listTextTarget, mockEvent)
        listTextHighlightHandler(listTextTarget, mockEvent)
        expect(preview.list[0]).toEqual({
          hint: undefined,
          id: '414d82a3-4cab-416a-bd54-6b86fbd51120',
          label: {
            classes: ' highlight',
            text: 'Extreme Treasure Hunting'
          },
          text: 'Extreme Treasure Hunting',
          value: 'Treasure Hunting'
        })
        listTextBlurHandler(listTextTarget, mockEvent)
        const listHint = questionElements.listHint
        listHint.value = 'Looking for gold'
        listHintInputHandler(listHint, mockEvent)
        expect(preview.list[0]).toEqual({
          hint: {
            text: 'Looking for gold',
            classes: ''
          },
          id: '414d82a3-4cab-416a-bd54-6b86fbd51120',
          label: {
            classes: '',
            text: 'Extreme Treasure Hunting'
          },
          text: 'Extreme Treasure Hunting',
          value: 'Treasure Hunting'
        })
        listHintHighlightHandler(listHint, mockEvent)
        listHintBlurHandler(listHint, mockEvent)
        expect(preview.list[0]).toEqual({
          hint: {
            text: 'Looking for gold',
            classes: ''
          },
          id: '414d82a3-4cab-416a-bd54-6b86fbd51120',
          label: {
            classes: '',
            text: 'Extreme Treasure Hunting'
          },
          text: 'Extreme Treasure Hunting',
          value: 'Treasure Hunting'
        })
      })
    })

    describe('ListSortable class', () => {
      it('should resync preview after reorder', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Done</button>' +
          '<button id="add-option-button">Add item</button>' +
          listEmptyHTML
        const preview = ListSortable.setupPreview()
        expect(preview._list.size).toBe(0)
        document.body.innerHTML =
          '<button id="edit-options-button">Done</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const preview2 = ListSortable.setupPreview()
        preview.resyncPreviewAfterReorder()
        expect(preview2._list.size).toBe(4)
      })
    })
  })
})
