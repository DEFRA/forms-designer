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

  document.body.innerHTML = questionDetailsStubPanels
  const questionElements = new RadioQuestionElements()

  describe('integration', () => {})

  describe('Radio class', () => {
    describe('addElement', () => {
      it('should add an element', () => {
        const radioClass = new Radio(questionElements)
        radioClass.push(radio1)
        expect(radioClass.list).toEqual([radio1])
      })
      it('should delete an element', () => {
        const radioClass = new Radio(questionElements)
        radioClass.push(radio1)
        expect(radioClass.list).toEqual([radio1])
        radioClass.delete(radio1Id)
        expect(radioClass.list).toEqual([])
      })
    })
  })

  it('should work', () => {
    expect(true).toBe(true)
  })
})
