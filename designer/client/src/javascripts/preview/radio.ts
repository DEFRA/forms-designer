import { type ListItem } from '@defra/forms-model'

import {
  EventListeners,
  Question,
  QuestionElements,
  type ListenerRow
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
  editLinks: HTMLInputElement[]
  listElements: HTMLElement[]
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

  static getListElementValues(el: HTMLElement) {
    const hint = el.dataset.hint ? { hint: { text: el.dataset.hint } } : {}
    return {
      id: el.dataset.id ?? 'new',
      text: el.dataset.text,
      ...hint,
      label: {
        classes: '',
        text: el.dataset.text
      },
      value: el.dataset.val
    } as ListElement
  }

  get values() {
    const baseValues = super.values

    return {
      ...baseValues,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      items: this.listElements.map(RadioQuestionElements.getListElementValues)
    }
  }
}

export class RadioEventListeners extends EventListeners {
  listElements: HTMLElement[]
  _radioElements: RadioQuestionElements
  _radioQuestion: Radio

  constructor(
    question: Radio,
    radioElements: RadioQuestionElements,
    listElements: HTMLElement[]
  ) {
    super(question, radioElements)
    this.listElements = listElements
    this._radioElements = radioElements
    this._radioQuestion = question
  }

  get listeners() {
    const editLinkListeners: ListenerRow[] = []
    /* TODO - implement edit link listeners
    this.listElements.map(
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
    */
    // TODO: highlight listener - highlight radio label
    // TODO: highlight listener - highlight radio hint
    const editPanelListeners = [
      [
        this._radioElements.radioText,
        (target) => {
          const { id } = RadioQuestionElements.getUpdateData(target)
          this._radioQuestion.updateText(id, target.value)
        },
        'input'
      ] as ListenerRow,
      [
        this._radioElements.radioHint,
        (target) => {
          const { id } = RadioQuestionElements.getUpdateData(target)
          this._radioQuestion.updateHint(id, target.value)
        },
        'input'
      ] as ListenerRow
    ]

    const highlightListeners = this._radioElements.listElements.flatMap(
      (listElem) => [
        [
          listElem,
          (_target, _e) => {
            // console.log('highlight', target)

            this._question.highlight = `${listElem.dataset.id}-label`
          },
          'mouseover'
        ] as ListenerRow,
        [
          listElem,
          (_target, _e) => {
            // console.log('highlight', target)

            this._question.highlight = undefined
          },
          'mouseout'
        ] as ListenerRow
      ]
    )

    // console.log('highlightListeners', highlightListeners)
    return editLinkListeners
      .concat(editPanelListeners)
      .concat(highlightListeners)
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
    const listeners = new RadioEventListeners(this, radioElements, [])
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
    return Array.from(iterator).map((listItem) => {
      const hintText =
        this._highlight === `${listItem.id}-hint` &&
        !listItem.hint?.text?.length
          ? 'Hint text'
          : listItem.hint?.text

      const hint = hintText
        ? {
            hint: {
              text: hintText,
              classes: this.getHighlight(`${listItem.id}-hint`)
            }
          }
        : {}

      return {
        ...listItem,
        ...hint,
        label: {
          text: listItem.text,
          classes: this.getHighlight(listItem.id + '-label')
        }
      }
    })
  }

  updateText(id: string, text: string) {
    const listItem = this._list.get(id)
    if (listItem) {
      listItem.text = text
      this.render()
    }
  }

  updateHint(id: string, text: string) {
    const listItem = this._list.get(id)
    if (listItem) {
      listItem.hint = {
        ...listItem.hint,
        text
      }
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
