/**
 * @typedef {{
 *  id: string;
 *  text: string;
 *  value: string;
 * }} Radio
 */

import {
  questionDetailsLeftPanelHTML,
  questionDetailsStubPanels
} from '~/src/javascripts/preview/__stubs__/question.js'
import { QuestionElements } from '~/src/javascripts/preview/question.js'
import {
  Radio,
  RadioQuestionElements
} from '~/src/javascripts/preview/radio.js'

describe('radio', () => {
  const radio1Id = 'c73a2bfa-e4e5-4087-82b5-5cf46ad1997f'
  const radio1 = /** @type {Radio} */ ({
    id: radio1Id,
    text: 'List Item 1',
    value: 'list-item-1'
  })
  const radio2Id = 'fac0dce2-ed95-41af-afde-2ed7d0d6e4ad'
  const radio2 = /** @type {Radio} */ ({
    id: radio2Id,
    text: 'List Item 2',
    value: 'list-item-2'
  })
  const radio3Id = '45d67f82-9e77-49c0-a6f5-cdd32ef7b4a0'
  const radio3 = /** @type {Radio} */ ({
    id: radio3Id,
    text: 'List Item 3',
    value: 'list-item-'
  })
  const list = [radio1, radio2, radio3]
  const exampleMap = new Map([
    ['c73a2bfa-e4e5-4087-82b5-5cf46ad1997f', radio1],
    ['fac0dce2-ed95-41af-afde-2ed7d0d6e4ad', radio2],
    ['45d67f82-9e77-49c0-a6f5-cdd32ef7b4a0', radio3]
  ])

  beforeEach(() => {
    document.body.innerHTML = questionDetailsStubPanels
  })

  const questionElements = new RadioQuestionElements()

  describe('integration', () => {})

  describe('RadioQuestionElements', () => {
    it('should get all correct defaults', () => {
      const radioQuestionElements = new RadioQuestionElements()
      expect(radioQuestionElements.values).toEqual({
        question: 'Which quest would you like to pick?',
        hintText: 'Choose one adventure that best suits you.',
        optional: false,
        shortDesc: 'your quest',
        items: [
          {
            id: '414d82a3-4cab-416a-bd54-6b86fbd51120',
            text: 'Treasure Hunting',
            value: 'Treasure Hunting'
          },
          {
            id: 'e3c7dc34-a401-40e2-8836-8ec43bdee88a',
            text: 'Rescuing the princess',
            value: 'Rescuing the princess'
          },
          {
            id: '6550cf75-2523-45c3-b119-8ca7bc27a159',
            text: 'Saving a city',
            value: 'Saving a city'
          },
          {
            id: '6edb06e0-0d2d-4879-bac1-b58e70b8c067',
            text: 'Defeating the baron',
            value: 'Defeating the baron'
          }
        ]
      })
    })
  })

  describe('RadioEventListeners', () => {})

  describe('Radio class', () => {
    describe('addElement', () => {
      it('should add an element', () => {
        const radioClass = new Radio(questionElements)
        radioClass.push(structuredClone(radio1))
        expect(radioClass.list).toEqual([radio1])
      })

      it('should delete an element', () => {
        const radioClass = new Radio(questionElements)
        radioClass.push(structuredClone(radio1))
        expect(radioClass.list).toEqual([radio1])
        radioClass.delete(radio1Id)
        expect(radioClass.list).toEqual([])
      })

      it('should edit an element', () => {
        const radioClass = new Radio(questionElements)
        radioClass.push(structuredClone(radio1))
        radioClass.update(radio1Id)
      })
    })
  })

  it('should work', () => {
    expect(true).toBe(true)
  })
})
