import { ComponentType } from '@defra/forms-model'

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

jest.mock('~/src/javascripts/preview/nunjucks.js')
jest.mock('~/src/views/components/ukaddressfield.njk', () => '')
jest.mock('~/src/views/components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/components/inset.njk', () => '')
jest.mock('~/src/views/components/textfield.njk', () => '')
jest.mock('~/src/views/components/radios.njk', () => '')
jest.mock('~/src/views/components/date-input.njk', () => '')

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
      const preview = /** @type {ListSortable} */ (
        setupPreview(ComponentType.RadiosField)
      )
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
      it('should set for reorder mode and then back', () => {
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
        expect(cursorCount).toBe(45)
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
        expect(cursorCount).toBe(45)
      })
    })

    describe('updateMoveButtons', () => {
      it('should hide first and last buttons', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements()
        const hiddenCount = document.querySelectorAll(
          '.reorder-button-hidden'
        ).length
        expect(hiddenCount).toBe(0)
        listSortable.updateMoveButtons()
        const hiddenCountAfter = document.querySelectorAll(
          '.reorder-button-hidden'
        ).length
        expect(hiddenCountAfter).toBe(2)
      })
    })

    describe('move up or down', () => {
      const mockResync = jest.fn()
      // @ts-expect-error - time consuming to mock all class methods
      const mockListenerClass = /** @type {ListSortableEventListeners} */ ({
        _listQuestion: {
          resyncPreviewAfterReorder: mockResync
        },
        _listSortableElements: {
          updateMoveButtons: jest.fn(),
          setMoveFocus: jest.fn()
        }
      })
      it('should move up if correct class', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const preview = ListSortable.setupPreview()
        const upButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        const upButton = /** @type {HTMLElement} */ (
          upButtons.find((x) => x.id === 'last-row-up')
        )
        expect(upButtons.findIndex((x) => x.id === 'last-row-up')).toBe(3)
        preview._listElements.moveUp(mockListenerClass, upButton)
        const upButtonsAfter = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        expect(upButtonsAfter.findIndex((x) => x.id === 'last-row-up')).toBe(2)
        expect(mockResync).toHaveBeenCalled()
      })

      it('should not move up if incorrect class', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const preview = ListSortable.setupPreview()
        const upButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        const upButton = /** @type {HTMLElement} */ (
          upButtons.find((x) => x.id === 'last-row-up')
        )
        expect(upButtons.findIndex((x) => x.id === 'last-row-up')).toBe(3)
        upButton.classList.remove('js-reorderable-list-up')
        preview._listElements.moveUp(mockListenerClass, upButton)
        expect(mockResync).not.toHaveBeenCalled()
      })

      it('should move down if correct class', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const preview = ListSortable.setupPreview()
        const downButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-down')
        )
        const downButton = /** @type {HTMLElement} */ (
          downButtons.find((x) => x.id === 'first-row-down')
        )
        expect(downButtons.findIndex((x) => x.id === 'first-row-down')).toBe(0)
        preview._listElements.moveDown(mockListenerClass, downButton)
        const downButtonsAfter = Array.from(
          document.querySelectorAll('.js-reorderable-list-down')
        )
        expect(
          downButtonsAfter.findIndex((x) => x.id === 'first-row-down')
        ).toBe(1)
        expect(mockResync).toHaveBeenCalled()
      })

      it('should not move down if incorrect class', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const preview = ListSortable.setupPreview()
        const downButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-down')
        )
        const downButton = /** @type {HTMLElement} */ (
          downButtons.find((x) => x.id === 'first-row-down')
        )
        expect(downButtons.findIndex((x) => x.id === 'first-row-down')).toBe(0)
        downButton.classList.remove('js-reorderable-list-down')
        preview._listElements.moveDown(mockListenerClass, downButton)
        expect(mockResync).not.toHaveBeenCalled()
      })
    })

    describe('setMoveFocus', () => {
      it('should focus button if button remains visible - move down', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements()
        const downButtonFirstRow = /** @type {HTMLElement} */ (
          document.getElementById('first-row-down')
        )
        jest.spyOn(downButtonFirstRow, 'focus')
        listSortable.setMoveFocus(downButtonFirstRow)
        expect(downButtonFirstRow.focus).toHaveBeenCalled()
      })

      it('should focus button if button remains visible - move up', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements()
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('row-3-up')
        )
        jest.spyOn(upButtonLastRow, 'focus')
        listSortable.setMoveFocus(upButtonLastRow)
        expect(upButtonLastRow.focus).toHaveBeenCalled()
      })

      it('should focus on sibling button if button becomes hidden', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements()
        const downButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-down')
        )
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-up')
        )
        jest.spyOn(downButtonLastRow, 'focus')
        jest.spyOn(upButtonLastRow, 'focus')
        downButtonLastRow.classList.add('reorder-button-hidden')
        listSortable.setMoveFocus(downButtonLastRow)
        expect(downButtonLastRow.focus).not.toHaveBeenCalled()
        expect(upButtonLastRow.focus).toHaveBeenCalled()
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

    describe('configureMoveButtonListeners', () => {
      it('should attach button listeners', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        ListSortable.setupPreview()
        const reorderButton = /** @type {HTMLElement} */ (
          document.getElementById('edit-options-button')
        )
        reorderButton.click()
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-up')
        )
        expect(upButtonLastRow).toBeDefined()
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

    it('updateStateInSession should call API to sync state', () => {
      // @ts-expect-error - Response type
      jest
        .spyOn(global, 'fetch')
        .mockImplementation((str) => Promise.resolve(str))
      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        list1HTML
      const preview = ListSortable.setupPreview()
      expect(preview._list.size).toBe(4)
      preview.updateStateInSession()
      expect(global.fetch).toHaveBeenCalledWith(expect.anything(), {
        body: JSON.stringify({
          listItems: [
            {
              id: 'dc96bf7a-07a0-4f5b-ba6d-c5c4c9d381de',
              text: 'Option 1',
              value: 'option-1'
            },
            {
              id: '21e58240-5d0a-4e52-8003-3d99f318beb8',
              text: 'Option 2',
              value: 'option-2'
            },
            {
              id: '80c4cb93-f079-4836-93f9-509e683e5004',
              text: 'Option 3',
              value: 'option-3'
            },
            {
              id: 'ade6652f-b67e-4665-bf07-66f03877b5c6',
              text: 'Option 4',
              hint: { text: 'hint 4' },
              value: 'option-4'
            }
          ]
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    })
  })
})
