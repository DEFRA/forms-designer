import { type ListItem } from '@defra/forms-model'

import {
  EventListeners,
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export interface ListElement extends ListItem {
  readonly id: string
  text: string
  value: string
}

export interface RadioElementReadOnly extends ListItem {
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
  updateElement: HTMLInputElement | undefined
  radioText: HTMLInputElement
  radioHint: HTMLInputElement

  constructor() {
    super()
    const editElements =
      /** @type {HTMLInputElement[]} */ document.querySelectorAll(
        '#options-container .edit-option-link'
      )
    const radioText = /** @type {HTMLInputElement} */ document.getElementById(
      'radioText'
    ) as HTMLInputElement
    const radioHint = /** @type {HTMLInputElement} */ document.getElementById(
      'radioHint'
    ) as HTMLInputElement
    const updateElement =
      /** @type {HTMLInputElement|undefined} */ document.getElementById(
        'add-option-form'
      ) as HTMLInputElement

    // we could document.createElement update element if need be

    const listElements = document.getElementById('options-container')?.children

    this.editLinks = Array.from(editElements)
    this.listElements = Array.from(listElements ?? [])
    this.radioText = radioText
    this.radioHint = radioHint
    this.updateElement = updateElement
  }

  static getParentUpdateElement(el: HTMLInputElement) {
    return el.closest('#add-option-form')
  }

  static getUpdateData(el: HTMLInputElement) {
    const updateElement = RadioQuestionElements.getParentUpdateElement(el)
    if (updateElement) {
      return RadioQuestionElements.getListElementValues(updateElement)
    }
    return undefined
  }

  static getListElementValues(el: Element) {
    return {
      id: el.getAttribute('data-id'),
      text: el.getAttribute('data-text'),
      value: el.getAttribute('data-val')
    } as ListElement
  }

  get values() {
    const baseValues = super.values

    return {
      ...baseValues,
      items: this.listElements.map(RadioQuestionElements.getListElementValues)
    }
  }
}

export class RadioEventListeners extends EventListeners {
  listElements: Element[]
  _radioElements: RadioQuestionElements
  _radioQuestion: Radio

  constructor(
    question: Radio,
    radioElements: RadioQuestionElements,
    listElements: Element[]
  ) {
    super(question, radioElements)
    this.listElements = listElements
    this._radioElements = radioElements
    this._radioQuestion = question
  }

  get listeners() {
    const radioListeners = this.listElements.map(
      (listElem) =>
        [
          listElem,
          (target, _e) => {
            // eslint-disable-next-line no-console
            console.log('click', target)
            // e.preventDefault()
          },
          'click'
        ] as ListenerRow
    )
    // TODO: highlight listener - highlight radio label
    // TODO: highlight listener - highlight radio hint
    const editListeners = [
      [
        this._radioElements.radioText,
        (target) => {
          console.log('~~~~~~ Chris Debug ~~~~~~ radioText', 'Target', target)
          console.log(
            '~~~~~~ Chris Debug ~~~~~~ radioText',
            'Target.value',
            target.value
          )
          const { id } = RadioQuestionElements.getUpdateData(target)
          console.log('~~~~~~ Chris Debug ~~~~~~ RadioText', 'id', id)
          this._radioQuestion.updateText(id, target.value)
        },
        'input'
      ],
      [
        this._radioElements.radioHint,
        (target) => {
          console.log('~~~~~~ Chris Debug ~~~~~~ radioHint', 'Target', target)
          console.log(
            '~~~~~~ Chris Debug ~~~~~~ radioHint',
            'Target.value',
            target.value
          )
          const { id } = RadioQuestionElements.getUpdateData(target)
          console.log('~~~~~~ Chris Debug ~~~~~~ radioHint', 'Id', id)
          this._radioQuestion.updateHint(id, target.value)
        },
        'input'
      ]
    ]

    return radioListeners.concat(editListeners)
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
    console.log('~~~~~~ Chris Debug ~~~~~~ ', 'Id', id)
    const listItem = this._list.get(id)
    console.log('~~~~~~ Chris Debug ~~~~~~ updateText', listItem)
    if (listItem) {
      listItem.text = text
      console.log('~~~~~~ Chris Debug ~~~~~~ updateText', 'This', this)
      this.render()
    }
  }

  updateHint(id: string, text: string) {
    const listItem = this._list.get(id)
    console.log('~~~~~~ Chris Debug ~~~~~~ updateHint', listItem)
    if (listItem) {
      listItem.hint = {
        ...listItem.hint,
        text
      }
      console.log('~~~~~~ Chris Debug ~~~~~~ updateHint', 'This', this)
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
