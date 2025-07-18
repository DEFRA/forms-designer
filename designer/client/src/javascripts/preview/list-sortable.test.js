import { ListSortableQuestion } from '@defra/forms-model'

import {
  list1HTML,
  listEmptyHTML,
  listSingleEntryDownHTML,
  listSingleEntryUpHTML
} from '~/src/javascripts/preview/__stubs__/list'
import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewTabsHTML,
  questionDetailsStubPanels
} from '~/src/javascripts/preview/__stubs__/question.js'
import {
  ListSortableEventListeners,
  ListSortableQuestionElements
} from '~/src/javascripts/preview/list-sortable'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('list-sortable', () => {
  const list1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
  const list2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
  const list3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
  const list4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'

  /**
   * @type {ListSortableQuestionElements}
   */
  let questionElements = new ListSortableQuestionElements(NunjucksRenderer)
  let nunjucksRenderer = new NunjucksRenderer(questionElements)

  beforeEach(() => {
    document.body.innerHTML = questionDetailsStubPanels
    questionElements = new ListSortableQuestionElements(NunjucksRenderer)
    nunjucksRenderer = new NunjucksRenderer(questionElements)
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
      const preview = /** @type {ListSortableQuestion} */ (
        SetupPreview.RadiosField()
      )
      expect(preview.renderInput.fieldset?.legend.text).toBe(
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
        largeTitle: true,
        content: '',
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
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        expect(listSortable.isReordering()).toBeTruthy()
      })

      it('should return false', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Done</button>'
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        expect(listSortable.isReordering()).toBeFalsy()
      })
    })

    describe('should handle re-order', () => {
      it('should set for reorder mode and then back', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
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
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
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
        expect(cursorCount).toBe(53)
      })
    })

    describe('updateMoveButtons', () => {
      it('should hide first and last buttons', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
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
          setMoveFocus: jest.fn(),
          setItemFocus: jest.fn()
        }
      })
      it('should move up if correct class', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortableQuestionElements = new ListSortableQuestionElements(
          NunjucksRenderer
        )
        const upButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        const upButton = /** @type {HTMLElement} */ (
          upButtons.find((x) => x.id === 'last-row-up')
        )
        expect(upButtons.findIndex((x) => x.id === 'last-row-up')).toBe(3)
        listSortableQuestionElements.moveUp(mockListenerClass, upButton)
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
        const listSortableQuestionElements = new ListSortableQuestionElements(
          NunjucksRenderer
        )
        const upButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        const upButton = /** @type {HTMLElement} */ (
          upButtons.find((x) => x.id === 'last-row-up')
        )
        expect(upButtons.findIndex((x) => x.id === 'last-row-up')).toBe(3)
        upButton.classList.remove('js-reorderable-list-up')
        listSortableQuestionElements.moveUp(mockListenerClass, upButton)
        expect(mockResync).not.toHaveBeenCalled()
      })

      it('should not error for move up if no siblings', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          listSingleEntryUpHTML
        const listSortableQuestionElements = new ListSortableQuestionElements(
          NunjucksRenderer
        )
        const upButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        const upButton = /** @type {HTMLElement} */ (
          upButtons.find((x) => x.id === 'first-row-up')
        )
        expect(upButtons.findIndex((x) => x.id === 'first-row-up')).toBe(0)
        listSortableQuestionElements.moveUp(mockListenerClass, upButton)
        const upButtonsAfter = Array.from(
          document.querySelectorAll('.js-reorderable-list-up')
        )
        expect(upButtonsAfter.findIndex((x) => x.id === 'first-row-up')).toBe(0)
        expect(mockResync).toHaveBeenCalled()
      })

      it('should move down if correct class', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortableQuestionElements = new ListSortableQuestionElements(
          NunjucksRenderer
        )
        const downButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-down')
        )
        const downButton = /** @type {HTMLElement} */ (
          downButtons.find((x) => x.id === 'first-row-down')
        )
        expect(downButtons.findIndex((x) => x.id === 'first-row-down')).toBe(0)
        listSortableQuestionElements.moveDown(mockListenerClass, downButton)
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
        const listSortableQuestionElements = new ListSortableQuestionElements(
          NunjucksRenderer
        )
        const downButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-down')
        )
        const downButton = /** @type {HTMLElement} */ (
          downButtons.find((x) => x.id === 'first-row-down')
        )
        expect(downButtons.findIndex((x) => x.id === 'first-row-down')).toBe(0)
        downButton.classList.remove('js-reorderable-list-down')
        listSortableQuestionElements.moveDown(mockListenerClass, downButton)
        expect(mockResync).not.toHaveBeenCalled()
      })

      it('should not error if down has no siblings', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          listSingleEntryDownHTML
        const listSortableQuestionElements = new ListSortableQuestionElements(
          NunjucksRenderer
        )
        const downButtons = Array.from(
          document.querySelectorAll('.js-reorderable-list-down')
        )
        const downButton = /** @type {HTMLElement} */ (
          downButtons.find((x) => x.id === 'first-row-down')
        )
        expect(downButtons.findIndex((x) => x.id === 'first-row-down')).toBe(0)
        listSortableQuestionElements.moveDown(mockListenerClass, downButton)
        expect(mockResync).toHaveBeenCalled()
      })
    })

    describe('setMoveFocus', () => {
      it('should focus button if button remains visible - move down', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
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
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
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
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
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

      it('should not error if no sibling', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          listSingleEntryDownHTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        const downButtonFirstRow = /** @type {HTMLElement} */ (
          document.getElementById('first-row-down')
        )
        jest.spyOn(downButtonFirstRow, 'focus')
        downButtonFirstRow.classList.add('reorder-button-hidden')
        listSortable.setMoveFocus(downButtonFirstRow)
        expect(downButtonFirstRow.focus).not.toHaveBeenCalled()
      })
    })

    describe('setItemFocus', () => {
      it('should focus item and remove any previous highlight', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        const downButtonFirstRow = /** @type {HTMLElement} */ (
          document.getElementById('first-row-down')
        )
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('row-3-up')
        )
        upButtonLastRow.classList.add('reorder-panel-focus')
        listSortable.setItemFocus(downButtonFirstRow)
        expect(downButtonFirstRow.classList).toContain('reorder-panel-focus')
        expect(upButtonLastRow.classList).not.toContain('reorder-panel-focus')
      })

      it('should ignore if item is not an element', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          listSingleEntryDownHTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        const downButtonFirstRow = null
        expect(() =>
          listSortable.setItemFocus(downButtonFirstRow)
        ).not.toThrow()
      })
    })

    describe('announceReorder', () => {
      it('should announce, then clear announcement fater a timeout', async () => {
        document.body.innerHTML =
          '<div class="govuk-visually-hidden" id="reorder-announcement" aria-live="polite" aria-atomic="true"></div>' +
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        listSortable.announceClearTimeMs = 1000
        const announcementRegion = /** @type {HTMLElement} */ (
          document.getElementById('reorder-announcement')
        )
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-up')
        )
        expect(announcementRegion.textContent).toBe('')
        listSortable.announceReorder(upButtonLastRow)
        await new Promise((_resolve) => setTimeout(_resolve, 500))
        expect(announcementRegion.textContent).toBe(
          'List reordered, Option 4 is now option 4 of 4.'
        )
        await new Promise((_resolve) => setTimeout(_resolve, 1000))
        expect(announcementRegion.textContent).toBe('')
      })

      it('should ignore if no announcement region', async () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const listSortable = new ListSortableQuestionElements(NunjucksRenderer)
        listSortable.announceClearTimeMs = 1000
        listSortable.announceReorder(
          /** @type {HTMLElement} */ (
            document.getElementById('edit-options-button')
          )
        )
        await new Promise((_resolve) => setTimeout(_resolve, 500))
        expect(listSortable.announcementRegion).toBeNull()
      })
    })
  })

  describe('ListSortableEventListeners', () => {
    const mockEvent = /** @type {Event} */ ({})
    describe('editPanelListeners', () => {
      it('should update the List class when listeners are called', () => {
        const preview = /** @type {ListSortableQuestion} */ (
          SetupPreview.ListSortable()
        )
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
        SetupPreview.ListSortable()
        const reorderButton = /** @type {HTMLElement} */ (
          document.getElementById('edit-options-button')
        )
        reorderButton.click()
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-up')
        )
        expect(upButtonLastRow).toBeDefined()
      })

      it('should ignore if not reordering', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Done</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        SetupPreview.ListSortable()
        const reorderButton = /** @type {HTMLElement} */ (
          document.getElementById('edit-options-button')
        )
        reorderButton.click()
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-up')
        )
        expect(upButtonLastRow.dataset.click).toBeUndefined()
      })

      it('should ignore if not an up or down button', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        const upButtons = /** @type {HTMLElement[]} */ (
          Array.from(document.getElementsByClassName('js-reorderable-list-up'))
        )
        const downButtons = /** @type {HTMLElement[]} */ (
          Array.from(
            document.getElementsByClassName('js-reorderable-list-down')
          )
        )
        upButtons.forEach((x) => {
          x.textContent = 'Not up or down'
        })
        downButtons.forEach((x) => {
          x.textContent = 'Not up or down'
        })

        SetupPreview.ListSortable()
        const reorderButton = /** @type {HTMLElement} */ (
          document.getElementById('edit-options-button')
        )
        reorderButton.click()
        const upButtonLastRow = /** @type {HTMLElement} */ (
          document.getElementById('last-row-up')
        )
        expect(upButtonLastRow.dataset.click).toBeUndefined()
      })

      it('should handle up button', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        SetupPreview.ListSortable()
        const reorderButton = /** @type {HTMLElement} */ (
          document.getElementById('edit-options-button')
        )
        reorderButton.click()
        const row3UpButton = /** @type {HTMLElement} */ (
          document.getElementById('row-3-up')
        )
        const listContainer = /** @type {HTMLElement} */ (
          document.getElementById('options-container')
        )
        const listOrderPre = /** @type {HTMLElement[]} */ (
          Array.from(
            listContainer.querySelectorAll('.app-reorderable-list__item')
          )
        ).map((node) => node.dataset.id)
        expect(listOrderPre).toEqual([
          'dc96bf7a-07a0-4f5b-ba6d-c5c4c9d381de',
          '21e58240-5d0a-4e52-8003-3d99f318beb8',
          '80c4cb93-f079-4836-93f9-509e683e5004',
          'ade6652f-b67e-4665-bf07-66f03877b5c6'
        ])
        row3UpButton.click()
        const listOrderPost = /** @type {HTMLElement[]} */ (
          Array.from(
            listContainer.querySelectorAll('.app-reorderable-list__item')
          )
        ).map((node) => node.dataset.id)
        expect(listOrderPost).toEqual([
          'dc96bf7a-07a0-4f5b-ba6d-c5c4c9d381de',
          '80c4cb93-f079-4836-93f9-509e683e5004',
          '21e58240-5d0a-4e52-8003-3d99f318beb8',
          'ade6652f-b67e-4665-bf07-66f03877b5c6'
        ])
      })

      it('should handle down button', () => {
        document.body.innerHTML =
          '<button id="edit-options-button">Re-order</button>' +
          '<button id="add-option-button">Add item</button>' +
          list1HTML
        SetupPreview.ListSortable()
        const reorderButton = /** @type {HTMLElement} */ (
          document.getElementById('edit-options-button')
        )
        reorderButton.click()
        const downButton = /** @type {HTMLElement} */ (
          document.getElementById('first-row-down')
        )
        const listContainer = /** @type {HTMLElement} */ (
          document.getElementById('options-container')
        )
        const listOrderPre = /** @type {HTMLElement[]} */ (
          Array.from(
            listContainer.querySelectorAll('.app-reorderable-list__item')
          )
        ).map((node) => node.dataset.id)
        expect(listOrderPre).toEqual([
          'dc96bf7a-07a0-4f5b-ba6d-c5c4c9d381de',
          '21e58240-5d0a-4e52-8003-3d99f318beb8',
          '80c4cb93-f079-4836-93f9-509e683e5004',
          'ade6652f-b67e-4665-bf07-66f03877b5c6'
        ])
        downButton.click()
        const listOrderPost = /** @type {HTMLElement[]} */ (
          Array.from(
            listContainer.querySelectorAll('.app-reorderable-list__item')
          )
        ).map((node) => node.dataset.id)
        expect(listOrderPost).toEqual([
          '21e58240-5d0a-4e52-8003-3d99f318beb8',
          'dc96bf7a-07a0-4f5b-ba6d-c5c4c9d381de',
          '80c4cb93-f079-4836-93f9-509e683e5004',
          'ade6652f-b67e-4665-bf07-66f03877b5c6'
        ])
      })
    })

    it('updateStateInSession should call API to sync state', () => {
      jest
        .spyOn(global, 'fetch')
        // @ts-expect-error - Response type
        .mockImplementation((str) => Promise.resolve(str))
      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        list1HTML
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const preview = new ListSortableQuestion(elements, nunjucksRenderer)
      expect(preview.listElementObjects).toHaveLength(4)
      const listeners = new ListSortableEventListeners(preview, elements, [])
      listeners.setupListeners()

      listeners.updateStateInSession()
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

    it('updateStateInSession should handle successful API call', async () => {
      jest
        .spyOn(global, 'fetch')
        // @ts-expect-error - Response type
        .mockImplementation(() => Promise.resolve({ status: 200 }))

      // eslint-disable-next-line no-global-assign
      window = Object.create(window)
      const url = 'http://localhost:3000/'
      Object.defineProperty(window, 'location', {
        value: {
          href: url
        },
        writable: true // possibility to override
      })

      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        list1HTML
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const preview = new ListSortableQuestion(elements, nunjucksRenderer)
      expect(preview.listElementObjects).toHaveLength(4)
      const listeners = new ListSortableEventListeners(preview, elements, [])
      listeners.setupListeners()

      listeners.updateStateInSession()

      await new Promise((_resolve) => setTimeout(_resolve, 1000))
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

    it('updateStateInSession should handle failed API call with error code being returned', async () => {
      jest
        .spyOn(global, 'fetch')
        // @ts-expect-error - Response type
        .mockImplementation(() => Promise.resolve({ status: 500 }))

      // eslint-disable-next-line no-global-assign
      window = Object.create(window)
      const url = 'http://localhost:3000/'
      Object.defineProperty(window, 'location', {
        value: {
          href: url
        },
        writable: true // possibility to override
      })

      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        list1HTML
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const preview = new ListSortableQuestion(elements, nunjucksRenderer)
      expect(preview.listElementObjects).toHaveLength(4)
      const listeners = new ListSortableEventListeners(preview, elements, [])
      listeners.setupListeners()

      listeners.updateStateInSession()
      await new Promise((_resolve) => setTimeout(_resolve, 1000))
      expect(window.location.href).toBe(
        'http://localhost:3000//editor-v2/error'
      )
    })

    it('updateStateInSession should handle thrown API call error', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockImplementation(() => Promise.reject(new Error('api error')))

      // eslint-disable-next-line no-global-assign
      window = Object.create(window)
      const url = 'http://localhost:3000/'
      Object.defineProperty(window, 'location', {
        value: {
          href: url
        },
        writable: true // possibility to override
      })

      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        list1HTML
      const elements = new ListSortableQuestionElements(NunjucksRenderer)
      const preview = new ListSortableQuestion(elements, nunjucksRenderer)
      expect(preview.listElementObjects).toHaveLength(4)
      const listeners = new ListSortableEventListeners(preview, elements, [])
      listeners.setupListeners()

      listeners.updateStateInSession()
      await new Promise((_resolve) => setTimeout(_resolve, 1000))
      expect(window.location.href).toBe(
        'http://localhost:3000//editor-v2/error'
      )
    })
  })

  describe('ListSortable class', () => {
    it('should resync preview after reorder', () => {
      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        listEmptyHTML
      const preview = /** @type {ListSortableQuestion} */ (
        SetupPreview.ListSortable()
      )
      expect(preview.listElementObjects).toHaveLength(0)
      document.body.innerHTML =
        '<button id="edit-options-button">Done</button>' +
        '<button id="add-option-button">Add item</button>' +
        list1HTML
      const preview2 = /** @type {ListSortableQuestion} */ (
        SetupPreview.ListSortable()
      )
      preview.resyncPreviewAfterReorder()
      expect(preview2.listElementObjects).toHaveLength(4)
    })
  })
})
