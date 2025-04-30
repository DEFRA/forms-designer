import {
  EventListeners,
  Question,
  QuestionElements,
  type ListenerRow
} from '~/src/javascripts/preview/question.js'

export interface RadioElement {
  id: string
  text: string
  value: string
}

export class RadioQuestionElements extends QuestionElements {
  editLinks: Element[]

  constructor() {
    super()
    const editElements =
      /** @type {HTMLInputElement[]} */ document.querySelectorAll(
        '#options-container .edit-option-link'
      )

    this.editLinks = Array.from(editElements)
  }
}

export class RadioEventListeners extends EventListeners {
  listElements: Element[]

  constructor(
    question: Question,
    baseElements: QuestionElements,
    listElements: Element[]
  ) {
    super(question, baseElements)
    this.listElements = listElements
  }

  get listeners() {
    const radioListeners = this.listElements.map(
      (listElem) =>
        [
          listElem,
          (target, e) => {
            // eslint-disable-next-line no-console
            console.log('click', target)
            e.preventDefault()
          },
          'click'
        ] as ListenerRow
    )

    return radioListeners
  }
}

// push
// deleting
// updating index
//

export class Radio extends Question {
  _questionTemplate = 'radios.njk'

  private readonly _list = new Map<string, RadioElement>([])

  /**
   * @param {QuestionElements} htmlElements
   */
  constructor(radioElements) {
    super(radioElements)
    const listeners = new RadioEventListeners(
      this,
      radioElements,
      radioElements.editLinks
    )
    listeners.setupListeners()

    /**
     * @type {EventListeners}
     * @private
     */
    this._listeners = listeners
  }

  get renderInput() {
    return {
      id: 'radioInput',
      name: 'radioInputField',
      fieldset: this.fieldSet,
      hint: this.hint
    }
  }

  push(radioElement: RadioElement) {
    this._list.set(radioElement.id, radioElement)
  }

  delete(key: string) {
    this._list.delete(key)
  }

  get list(): RadioElement[] {
    const iterator: MapIterator<RadioElement> = this._list.values()
    return Array.from(iterator)
  }

  static setupPreview() {
    const elements = new RadioQuestionElements()
    const radioField = new Radio(elements)
    radioField.render()
  }
}
