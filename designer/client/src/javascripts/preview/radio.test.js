import { questionDetailsStubPanels } from '~/src/javascripts/preview/__stubs__/question.js'
import {
  Radio,
  RadioEventListeners,
  RadioQuestionElements,
  listsElementToMap
} from '~/src/javascripts/preview/radio.js'
import { setupPreview } from '~/src/javascripts/preview.js'
class EmptyRadioQuestionElements extends RadioQuestionElements {
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
jest.mock('~/src/views/components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/components/ukaddressfield.njk', () => '')

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

describe('radio', () => {
  const radio1Id = '414d82a3-4cab-416a-bd54-6b86fbd51120'
  const radio1 = /** @type {ListElement} */ ({
    id: radio1Id,
    text: 'Treasure Hunting',
    value: 'Treasure Hunting',
    label: {
      classes: '',
      text: 'Treasure Hunting'
    }
  })
  const radio2Id = '801385a4-81e6-4171-96c3-6c6727d97f22'
  const radio2 = /** @type {ListElement} */ ({
    id: radio2Id,
    text: 'Rescuing the princess',
    value: 'Rescuing the princess',
    label: {
      classes: '',
      text: 'Rescuing the princess'
    }
  })
  const radio3Id = 'e6e3f621-b875-4ca3-a054-cca9149149dd'
  const radio3 = /** @type {ListElement} */ ({
    id: radio3Id,
    text: 'Saving a city',
    value: 'Saving a city',
    label: {
      classes: '',
      text: 'Saving a city'
    }
  })
  const radio4Id = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'
  const radio4 = {
    id: radio4Id,
    text: 'Defeating the baron',
    value: 'Defeating the baron',
    label: {
      classes: '',
      text: 'Defeating the baron'
    }
  }
  const baronListItemId = 'd71b3909-582f-4e90-b6f5-490b89a6eb8f'

  /**
   * @type {RadioQuestionElements}
   */
  let questionElements = new RadioQuestionElements()
  /**
   * @type {EmptyRadioQuestionElements}
   */
  let emptyQuestionElements

  beforeEach(() => {
    document.body.innerHTML = questionDetailsStubPanels
    questionElements = new RadioQuestionElements()
    emptyQuestionElements = new EmptyRadioQuestionElements()
  })

  const expectedList = [
    {
      id: radio1Id,
      text: 'Treasure Hunting',
      value: 'Treasure Hunting',
      label: {
        classes: '',
        text: 'Treasure Hunting'
      }
    },
    {
      id: radio2Id,
      text: 'Rescuing the princess',
      value: 'Rescuing the princess',
      label: {
        classes: '',
        text: 'Rescuing the princess'
      }
    },
    {
      id: radio3Id,
      text: 'Saving a city',
      value: 'Saving a city',
      label: {
        classes: '',
        text: 'Saving a city'
      }
    },
    {
      id: radio4Id,
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
      const preview = /** @type {Radio} */ (setupPreview('radiosfield'))
      expect(preview.renderInput.fieldset.legend.text).toBe('Question')
    })
    it('test', () => {
      expect(true).toBe(true)
    })
  })

  describe('RadioQuestionElements', () => {
    it('should get all correct defaults', () => {
      expect(questionElements.values).toEqual({
        question: 'Which quest would you like to pick?',
        hintText: 'Choose one adventure that best suits you.',
        optional: false,
        shortDesc: 'your quest',
        items: expectedList
      })
      const radioText = /** @type {HTMLInputElement} */ (
        document.getElementById('radioText')
      )
      expect(RadioQuestionElements.getUpdateData(radioText)).toBeDefined()
      expect(RadioQuestionElements.getUpdateData(radioText)).not.toBeNull()
      const listItem = questionElements.listElements[2]
      expect(listItem).toBeDefined()
      listItem.dataset.hint = 'hint 1'
      expect(RadioQuestionElements.getListElementValues(listItem).hint).toEqual(
        {
          text: 'hint 1'
        }
      )
      const newElement = document.createElement('li')
      newElement.dataset.text = 'A custom adventure'
      newElement.dataset.val = 'A custom adventure'
      expect(RadioQuestionElements.getListElementValues(newElement)).toEqual({
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

  describe('RadioEventListeners', () => {
    const mockEvent = /** @type {Event} */ ({})
    describe('editPanelListeners', () => {
      it('should update the Radio class when listeners are called', () => {
        const preview = /** @type {Radio} */ (Radio.setupPreview())
        const radioEventListeners = new RadioEventListeners(
          preview,
          questionElements,
          questionElements.listElements
        )
        expect(radioEventListeners.editFieldHasFocus()).toBe(false)
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
        ] = radioEventListeners.editPanelListeners
        const radioTextTarget = questionElements.radioText
        radioTextTarget.value = 'Extreme Treasure Hunting'
        const [, textInputListenerElement] = textInputListener
        const [, radioTextHighlightHandler] = textFocusListener
        const [, radioTextBlurHandler] = textBlurListener
        const [, radioHintInputHandler] = hintInputListener
        const [, radioHintHighlightHandler] = hintFocusListener
        const [, radioHintBlurHandler] = hintBlurListener

        textInputListenerElement(radioTextTarget, mockEvent)
        radioTextHighlightHandler(radioTextTarget, mockEvent)
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
        radioTextBlurHandler(radioTextTarget, mockEvent)
        const radioHint = questionElements.radioHint
        radioHint.value = 'Looking for gold'
        radioHintInputHandler(radioHint, mockEvent)
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
        radioHintHighlightHandler(radioHint, mockEvent)
        radioHintBlurHandler(radioHint, mockEvent)
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

    describe('radioHighlightListeners', () => {
      it('should update the Radio class when listeners are called', () => {
        const preview = /** @type {Radio} */ (Radio.setupPreview())
        const radioEventListeners = new RadioEventListeners(
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
          radioEventListeners.radioHighlightListeners
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

  describe('Radio class', () => {
    it('should update', () => {
      const preview = Radio.setupPreview()
      expect(preview.afterInput).toEqual({})
    })

    it('should delete an element', () => {
      const radio = new Radio(emptyQuestionElements)
      radio.push(structuredClone(radio1))
      expect(radio.list).toEqual([radio1])
      radio.delete(radio1Id)
      expect(radio.list).toEqual([])
      expect(radio.afterInput.afterInputs?.html).toContain('No items added yet')
    })

    it('should edit list text', () => {
      const expectedList = [
        {
          ...radio2,
          text: 'Rescuing the princess 👸',
          label: { ...radio2.label, text: 'Rescuing the princess 👸' }
        }
      ]
      const radio = new Radio(emptyQuestionElements)
      radio.push(structuredClone(radio2))
      radio.updateText(radio2Id, 'Rescuing the princess 👸')
      expect(radio.list).toEqual(expectedList)
    })

    it('should add an element', () => {
      const radio = new Radio(emptyQuestionElements)
      radio.push(structuredClone(radio1))
      expect(radio.list).toEqual([radio1])
    })

    it('should edit list value', () => {
      const radio = new Radio(emptyQuestionElements)
      radio.push(structuredClone(radio2))
      radio.updateValue(radio2Id, 'princess-rescuing')
      expect(radio.list).toEqual([{ ...radio2, value: 'princess-rescuing' }])
    })

    it('should edit hint', () => {
      const expectedHint = 'When you want to rescue a princess'
      const radio = new Radio(emptyQuestionElements)
      radio.push(structuredClone(radio2))
      radio.updateHint(radio2Id, expectedHint)
      expect(radio.list).toEqual([
        {
          ...radio2,
          hint: {
            classes: '',
            text: 'When you want to rescue a princess'
          }
        }
      ])
    })

    it('should return the correct model', () => {
      const radio = new Radio(emptyQuestionElements)
      radio.push(radio1)
      radio.push(radio2)
      radio.push(radio3)
      radio.push(radio4)
      expect(radio.renderInput).toEqual({
        id: 'radioInput',
        name: 'radioInputField',
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
      const preview = Radio.setupPreview()
      preview.highlight = `${baronListItemId}-hint`
      expect(preview.list[3]).toMatchObject({
        hint: { text: 'Hint text' }
      })
    })

    it('should handle edge cases', () => {
      const preview = /** @type {Radio} */ (Radio.setupPreview())
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
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
