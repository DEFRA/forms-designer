import { questionDetailsStubPanels } from '~/src/javascripts/preview/__stubs__/question.js'
import {
  Radio,
  RadioQuestionElements
} from '~/src/javascripts/preview/radio.js'
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

  /**
   * @type {RadioQuestionElements}
   */
  let questionElements
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
    })
  })

  describe('RadioEventListeners', () => {
    it('test', () => {
      expect(true).toBeTruthy()
    })
  })

  describe('Radio class', () => {
    describe('addElement', () => {
      it('should add an element', () => {
        const radio = new Radio(emptyQuestionElements)
        radio.push(structuredClone(radio1))
        expect(radio.list).toEqual([radio1])
      })

      it('should delete an element', () => {
        const radio = new Radio(emptyQuestionElements)
        radio.push(structuredClone(radio1))
        expect(radio.list).toEqual([radio1])
        radio.delete(radio1Id)
        expect(radio.list).toEqual([])
      })

      it('should edit list text', () => {
        const radio = new Radio(emptyQuestionElements)
        radio.push(structuredClone(radio2))
        radio.updateText(radio2Id, 'Rescuing the princess 👸')
        expect(radio.list).toEqual([
          {
            ...radio2,
            text: 'Rescuing the princess 👸',
            label: { ...radio2.label, text: 'Rescuing the princess 👸' }
          }
        ])
      })

      it('should edit list value', () => {
        const radio = new Radio(emptyQuestionElements)
        radio.push(structuredClone(radio2))
        radio.updateValue(radio2Id, 'princess-rescuing')
        expect(radio.list).toEqual([{ ...radio2, value: 'princess-rescuing' }])
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
    })
  })

  it('should work', () => {
    expect(true).toBe(true)
  })
})

/**
 * @import { ListElement } from '~/src/javascripts/preview/radio.js'
 * @import { QuestionBaseModel } from '~/src/javascripts/preview/question.js'
 */
