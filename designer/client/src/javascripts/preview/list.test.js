import { ListQuestion } from '@defra/forms-model'

import { list1HTML } from '~/src/javascripts/preview/__stubs__/list'
import { questionDetailsStubPanels } from '~/src/javascripts/preview/__stubs__/question.js'
import {
  ListEventListeners,
  ListQuestionDomElements,
  listsElementToMap
} from '~/src/javascripts/preview/list.js'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

class EmptyListQuestionElements extends ListQuestionDomElements {
  get values() {
    // @ts-expect-error - inheritance not working properly in linting
    const baseValues = super.values
    return {
      ...baseValues,
      items: []
    }
  }
}

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
   * @type {HTMLBuilder}
   */
  const htmlBuilder = {
    buildHTML(_questionTemplate, _renderContext) {
      return 'builtHTML'
    }
  }

  /**
   * @type {ListQuestionDomElements}
   */
  let questionElements = new ListQuestionDomElements(htmlBuilder)
  /**
   * @type {EmptyListQuestionElements}
   */
  let emptyQuestionElements
  /**
   * @type {NunjucksRenderer}
   */
  let emptyListRenderer

  beforeEach(() => {
    document.body.innerHTML = questionDetailsStubPanels
    questionElements = new ListQuestionDomElements(htmlBuilder)
    emptyQuestionElements = new EmptyListQuestionElements(htmlBuilder)
    emptyListRenderer = new NunjucksRenderer(emptyQuestionElements)
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
      document.body.innerHTML = list1HTML
      const preview = /** @type {ListSortableQuestion} */ (
        SetupPreview.ListSortable()
      )
      expect(preview.renderInput.fieldset?.legend.text).toBe('Question')
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
      expect(questionElements.getUpdateData(listText)).toBeDefined()
      expect(questionElements.getUpdateData(listText)).not.toBeNull()
      const listItem = questionElements.listElements[2]
      expect(listItem).toBeDefined()
      listItem.dataset.hint = 'hint 1'
      expect(
        ListQuestionDomElements.getListElementValues(listItem).hint
      ).toEqual({
        text: 'hint 1'
      })
      const newElement = document.createElement('li')
      newElement.dataset.text = 'A custom adventure'
      newElement.dataset.val = 'A custom adventure'
      expect(ListQuestionDomElements.getListElementValues(newElement)).toEqual({
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
        const preview = /** @type {ListQuestion} */ (
          SetupPreview.ListSortable()
        )
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
        const preview = /** @type {ListQuestion} */ (
          SetupPreview.ListSortable()
        )
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
    it('should return the correct model', () => {
      const list = new ListQuestion(emptyQuestionElements, emptyListRenderer)
      const expectedModel = {
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
      }
      list.push(list1)
      list.push(list2)
      list.push(list3)
      list.push(list4)
      expect(list.renderInput).toEqual(expectedModel)
      // @ts-expect-error - Mock made available on NunjucksRenderMock
      expect(emptyListRenderer._renderMock).toHaveBeenCalledWith(
        'preview-components/radios.njk',
        expectedModel
      )
    })

    it('should highlight', () => {
      const preview = /** @type {ListSortableQuestion} */ (
        SetupPreview.ListSortable()
      )
      preview.highlight = `${baronListItemId}-hint`
      expect(preview.list[3]).toMatchObject({
        hint: { text: 'Hint text' }
      })
    })

    it('should handle edge cases', () => {
      const preview = /** @type {ListSortableQuestion} */ (
        SetupPreview.ListSortable()
      )
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
 * @import { ListElement, HTMLBuilder, RadioQuestion, ListSortableQuestion } from '@defra/forms-model'
 */
