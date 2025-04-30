import {
  EventListeners,
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

interface RadioElement {
  id: string
  text: string
  value: string
}

export class RadioQuestionElements extends QuestionElements {}

export class RadioEventListeners extends EventListeners {}

// push
// deleting
// updating index
//

export class Radio extends Question {
  private readonly _list = new Map<string, RadioElement>([])

  push(radioElement: RadioElement) {
    this._list.set(radioElement.id, radioElement)
  }

  [(['c73a2bfa-e4e5-4087-82b5-5cf46ad1997f', radio1],
  ['fac0dce2-ed95-41af-afde-2ed7d0d6e4ad', radio2],
  ['45d67f82-9e77-49c0-a6f5-cdd32ef7b4a0', radio3])]

  delete(key: string) {
    this._list.delete(key)
  }

  get list(): RadioElement[] {
    const iterator: MapIterator<RadioElement> = this._list.values()
    return Array.from(iterator)
  }
}
