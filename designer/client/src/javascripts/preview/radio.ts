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
  deleteLinks: Element[]
  editLinks: Element[]

  constructor() {
    super()

    const deleteElements =
      /** @type {HTMLInputElement[]} */ document.querySelectorAll(
        '#options-container .delete-option-link'
      )

    const editElements =
      /** @type {HTMLInputElement[]} */ document.querySelectorAll(
        '#options-container .edit-option-link'
      )

    this.deleteLinks = Array.from(deleteElements)
    this.editLinks = Array.from(editElements)
  }
}

export class RadioEventListeners extends EventListeners {
  deleteLinks: Element[]
  editLinks: Element[]

  constructor(
    question: Question,
    baseElements: QuestionElements,
    deleteLinks: Element[],
    editLinks: Element[]
  ) {
    super(question, baseElements)
    this.deleteLinks = deleteLinks
    this.editLinks = editLinks
  }

  get listeners() {
    const deleteListeners = this.deleteLinks.map(
      (listElem) =>
        [
          listElem,
          (target, e: Event) => {
            e.preventDefault()
            this.removeItem(target)
          },
          'click'
        ] as ListenerRow
    )

    const editListeners = this.editLinks.map(
      (listElem) =>
        [
          listElem,
          (target, e: Event) => {
            // eslint-disable-next-line no-console
            console.log('click edit', target)
            e.preventDefault()
          },
          'click'
        ] as ListenerRow
    )

    return [...deleteListeners, ...editListeners]
  }

  removeItem(target: HTMLElement) {
    const closestElem = target.closest('li')?.parentNode?.closest('li')
    // console.log('remove closest', closestElem)
    if (closestElem) {
      closestElem.remove()
    }
    // TODO - ajax call to update state
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
      radioElements.deleteLinks,
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
