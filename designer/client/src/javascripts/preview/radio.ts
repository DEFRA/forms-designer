import {
  EventListeners,
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export interface ListElement {
  readonly id: string
  text: string
  value: string
}

export interface RadioElementReadOnly {
  readonly id: string
  readonly value: string
  readonly text: string
  readonly hint?: {
    text: string
    id?: string
    classes?: string
  }
}

export class RadioQuestionElements extends QuestionElements {
  editLinks: Element[]
  listElements: Element[]

  constructor() {
    super()
    const editElements =
      /** @type {HTMLInputElement[]} */ document.querySelectorAll(
        '#options-container .edit-option-link'
      )

    const listElements = document.getElementById('options-container')?.children

    this.editLinks = Array.from(editElements)
    this.listElements = Array.from(listElements ?? [])
  }

  get values() {
    const baseValues = super.values

    return {
      ...baseValues,
      items: this.listElements.map((element) => {
        return {
          id: element.getAttribute('data-id'),
          text: element.getAttribute('data-text'),
          value: element.getAttribute('data-val')
        } as ListElement
      })
    }
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

/**
 * @param {ListElement} listElement
 * @returns {[string, ListElement]}
 */
export function listItemMapper(
  listElement: ListElement
): [string, ListElement] {
  return [listElement.id, listElement]
}

/**
 *
 * @param {ListElement[]} listElements
 * @returns {Map<string, ListElement>}
 */
export function listsElementToMap(listElements: ListElement[]) {
  const entries = listElements.map(listItemMapper)
  return new Map<string, ListElement>(entries)
}

export class Radio extends Question {
  _questionTemplate = 'radios.njk'

  /**
   * @type {Map<string, ListElement>}
   * @private
   */
  private readonly _list: Map<string, ListElement>

  /**
   * @param {RadioQuestionElements} radioElements
   */
  constructor(radioElements: RadioQuestionElements) {
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
    this._list = listsElementToMap(radioElements.values.items)
  }

  get renderInput() {
    return {
      id: 'radioInput',
      name: 'radioInputField',
      fieldset: this.fieldSet,
      hint: this.hint,
      items: this.list
    }
  }

  push(radioElement: ListElement) {
    this._list.set(radioElement.id, radioElement)
    this.render()
  }

  delete(key: string) {
    this._list.delete(key)
    this.render()
  }

  get list(): readonly ListItem[] {
    const iterator: MapIterator<ListElement> = this._list.values()
    return Array.from(iterator)
  }

  updateText(id: string, text: string) {
    const listItem = this._list.get(id)
    if (listItem) {
      listItem.text = text
      this.render()
    }
  }

  updateValue(id: string, value: string) {
    const listItem = this._list.get(id)
    if (listItem) {
      listItem.value = value
      this.render()
    }
  }

  static setupPreview() {
    const elements = new RadioQuestionElements()
    const radioField = new Radio(elements)
    radioField.render()
  }
}
