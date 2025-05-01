import {
  EventListeners,
  Question,
  QuestionElements,
  type ListItem,
  type ListenerRow
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
  deleteLinks: Element[]
  editLinks: Element[]
  listElements: Element[]

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

    const listElements = document.getElementById('options-container')?.children

    this.deleteLinks = Array.from(deleteElements)
    this.editLinks = Array.from(editElements)
    this.listElements = Array.from(listElements ?? [])
  }

  get values() {
    // @ts-expect-error - inheritance not detected properly, as 'values' is protected so should be fine
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
    // console.log('elements', this.listElements)
    const radioListeners = this.listElements.map((listElem) =>
      this.mapElementListener(listElem)
    )

    return radioListeners
  }

  mapElementListener(elem: Element) {
    return [
      elem,
      (target, e) => {
        // eslint-disable-next-line no-console
        console.log('click', target)
        e.preventDefault()
      },
      'click'
    ] as ListenerRow
  }

  removeItem(target: HTMLElement) {
    const closestParent = target.closest('li')
    const closestElem = (
      closestParent?.parentNode as HTMLElement | null
    )?.closest('li')
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
    const listeners = new RadioEventListeners(this, radioElements, [
      ...radioElements.deleteLinks,
      ...radioElements.editLinks
    ])
    listeners.setupListeners()

    /**
     * @type {EventListeners}
     * @private
     */
    this._listeners = listeners
    this._list = listsElementToMap(radioElements.values.items)
  }

  /**
   * @type {QuestionBaseModel}
   */
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
