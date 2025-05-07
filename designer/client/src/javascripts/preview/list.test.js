import { questionDetailsStubPanels } from '~/src/javascripts/preview/__stubs__/question.js'
import {
  List,
  ListEventListeners,
  ListQuestionElements,
  listsElementToMap
} from '~/src/javascripts/preview/list.js'
import { setupPreview } from '~/src/javascripts/preview.js'
class EmptyListQuestionElements extends ListQuestionElements {
  get values() {
    // @ts-expect-error - inheritance not working properly in linting
    const baseValues = super.values
    return {
      ...baseValues,
      items: []
    }
  }
}

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

describe('list', () => {
  const list1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
  const list1 = /** @type {ListElement} */ ({
    id: list1Id,
    text: 'Treasure Hunting',
    value: 'Treasure Hunting',
    label: {
      classes: '',
      text: 'Treasure Hunting'
    }
  })
  const list2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
  const list2 = /** @type {ListElement} */ ({
    id: list2Id,
    text: 'Rescuing the princess',
    value: 'Rescuing the princess',
    label: {
      classes: '',
      text: 'Rescuing the princess'
    }
  })
  const list3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
  const list3 = /** @type {ListElement} */ ({
    id: list3Id,
    text: 'Saving a city',
    value: 'Saving a city',
    label: {
      classes: '',
      text: 'Saving a city'
    }
  })
  const list4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'
  const list4 = {
    id: list4Id,
    text: 'Defeating the baron',
    value: 'Defeating the baron',
    label: {
      classes: '',
      text: 'Defeating the baron'
    }
  }
  const baronListItemId = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'

  /**
   * @type {ListQuestionElements}
   */
  let questionElements = new ListQuestionElements()
  /**
   * @type {EmptyListQuestionElements}
   */
  let emptyQuestionElements

  beforeEach(() => {
    document.body.innerHTML = questionDetailsStubPanels
    questionElements = new ListQuestionElements()
    emptyQuestionElements = new EmptyListQuestionElements()
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
      document.body.innerHTML = ''
      const preview = /** @type {List} */ (
        setupPreview('radiosfield-non-sortable')
      )
      expect(preview.renderInput.fieldset.legend.text).toBe('Question')
    })
  })

  describe('ListQuestionElements', () => {
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
      expect(ListQuestionElements.getUpdateData(listText)).toBeDefined()
      expect(ListQuestionElements.getUpdateData(listText)).not.toBeNull()
      const listItem = questionElements.listElements[2]
      expect(listItem).toBeDefined()
      listItem.dataset.hint = 'hint 1'
      expect(ListQuestionElements.getListElementValues(listItem).hint).toEqual({
        text: 'hint 1'
      })
      const newElement = document.createElement('li')
      newElement.dataset.text = 'A custom adventure'
      newElement.dataset.val = 'A custom adventure'
      expect(ListQuestionElements.getListElementValues(newElement)).toEqual({
        id: 'new',
        text: 'A custom adventure',
        label: {
          classes: '',
          text: 'A custom adventure'
        },
        value: 'A custom adventure'
      })
    })
  })

  describe('ListEventListeners', () => {
    const mockEvent = /** @type {Event} */ ({})
    describe('editPanelListeners', () => {
      it('should update the List class when listeners are called', () => {
        const preview = /** @type {List} */ (List.setupPreview())
        const listEventListeners = new ListEventListeners(
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

    describe('listHighlightListeners', () => {
      it('should update the List class when listeners are called', () => {
        const preview = /** @type {List} */ (List.setupPreview())
        const listEventListeners = new ListEventListeners(
          preview,
          questionElements,
          questionElements.listElements
        )
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

        const [mouseOverItem, mouseOutItem] =
          listEventListeners.listHighlightListeners
        const listElement = /** @type {HTMLInputElement} */ (
          questionElements.listElements[0]
        )

        const [, mouseOverHandler] = mouseOverItem
        const [, mouseOutHandler] = mouseOutItem

        mouseOverHandler(listElement, mockEvent)

        expect(preview.list[0]).toEqual({
          hint: undefined,
          id: '414d82a3-4cab-416a-bd54-6b86fbd51120',
          label: {
            classes: ' highlight',
            text: 'Treasure Hunting'
          },
          text: 'Treasure Hunting',
          value: 'Treasure Hunting'
        })
        mouseOutHandler(listElement, mockEvent)
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
      })
    })
  })

  describe('List class', () => {
    it('should delete an element', () => {
      const list = new List(emptyQuestionElements)
      list.push(structuredClone(list1))
      expect(list.list).toEqual([list1])
      list.delete(list1Id)
      expect(list.list).toEqual([])
    })

    it('should edit list text', () => {
      const expectedList = [
        {
          ...list2,
          text: 'Rescuing the princess 👸',
          label: { ...list2.label, text: 'Rescuing the princess 👸' }
        }
      ]
      const list = new List(emptyQuestionElements)
      list.push(structuredClone(list2))
      list.updateText(list2Id, 'Rescuing the princess 👸')
      expect(list.list).toEqual(expectedList)
    })

    it('should add an element', () => {
      const list = new List(emptyQuestionElements)
      list.push(structuredClone(list1))
      expect(list.list).toEqual([list1])
    })

    it('should edit list value', () => {
      const list = new List(emptyQuestionElements)
      list.push(structuredClone(list2))
      list.updateValue(list2Id, 'princess-rescuing')
      expect(list.list).toEqual([{ ...list2, value: 'princess-rescuing' }])
    })

    it('should edit hint', () => {
      const expectedHint = 'When you want to rescue a princess'
      const list = new List(emptyQuestionElements)
      list.push(structuredClone(list2))
      list.updateHint(list2Id, expectedHint)
      expect(list.list).toEqual([
        {
          ...list2,
          hint: {
            classes: '',
            text: 'When you want to rescue a princess'
          }
        }
      ])
    })

    it('should return the correct model', () => {
      const list = new List(emptyQuestionElements)
      list.push(list1)
      list.push(list2)
      list.push(list3)
      list.push(list4)
      expect(list.renderInput).toEqual({
        id: 'listInput',
        name: 'listInputField',
        fieldset: {
          legend: {
            text: 'Which quest would you like to pick?',
            classes: 'govuk-fieldset__legend--l'
          }
        },
        hint: {
          classes: '',
          text: 'Choose one adventure that best suits you.'
        },
        items: expectedList
      })
      expect(emptyQuestionElements.preview?.innerHTML).toBe('****UPDATED****')
    })

    it('should highlight', () => {
      const preview = List.setupPreview()
      preview.highlight = `${baronListItemId}-hint`
      expect(preview.list[3]).toMatchObject({
        hint: { text: 'Hint text' }
      })
    })

    it('should handle edge cases', () => {
      const preview = /** @type {List} */ (List.setupPreview())
      expect(preview.list).toEqual(expectedList)
      preview.updateValue(undefined, 'new-value')
      preview.updateValue('b40e1a4f-9777-463a-a657-83f9da39e69e', 'New Text')
      preview.updateHint(undefined, 'New Hint')
      preview.updateHint('b40e1a4f-9777-463a-a657-83f9da39e69e', 'New Hint')
      preview.updateText(undefined, 'New Text')
      preview.updateText('b40e1a4f-9777-463a-a657-83f9da39e69e', 'New Text')
      expect(preview.list).toEqual(expectedList)
      preview.updateText(baronListItemId, '')
      expect(preview.list[3].text).toBe('Item text')
      expect(listsElementToMap(undefined)).toEqual(new Map([]))
    })
  })
})

/**
 * @import { ListElement } from '@defra/forms-model'
 */
