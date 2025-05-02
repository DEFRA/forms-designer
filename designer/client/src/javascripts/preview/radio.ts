import { type ListElement, type ListItemReadonly } from '@defra/forms-model'
import '~/src/views/components/inset.njk'

import {
  EventListeners,
  Question,
  QuestionElements,
  type ListenerRow
} from '~/src/javascripts/preview/question.js'

export class RadioQuestionElements extends QuestionElements {
  editLinks: HTMLInputElement[]
  listElements: HTMLElement[]
  updateElement: HTMLInputElement | undefined
  radioText: HTMLInputElement
  radioHint: HTMLInputElement
  afterInputsHTML: string

  constructor() {
    super()
    const editElements = document.querySelectorAll(
      '#options-container .edit-option-link'
    )
    const radioText = document.getElementById('radioText') as HTMLInputElement
    const radioHint = document.getElementById('radioHint') as HTMLInputElement
    const updateElement = document.getElementById(
      'add-option-form'
    ) as HTMLInputElement

    // we could document.createElement update element if need be

    const listElements = document.getElementById('options-container')?.children

    this.editLinks = Array.from(editElements) as HTMLInputElement[]
    this.listElements = Array.from(listElements ?? []) as HTMLElement[]
    this.radioText = radioText
    this.radioHint = radioHint
    this.updateElement = updateElement
    this.afterInputsHTML = Question._renderHelper('inset.njk', {
      model: {
        text: 'No items added yet.'
      }
    })
  }

  static getParentUpdateElement(el: HTMLInputElement) {
    return el.closest('#add-option-form')
  }

  static getUpdateData(el: HTMLInputElement): { id?: string } {
    const updateElement = RadioQuestionElements.getParentUpdateElement(el)
    if (updateElement) {
      return RadioQuestionElements.getListElementValues(
        updateElement as HTMLElement
      )
    }
    return {}
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

  constructValues() {
    const baseValues = super.constructValues()

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

  editFieldHasFocus() {
    if (!document.hasFocus()) {
      return false
    }

    const activeElementId = document.activeElement?.id
    if (!activeElementId) {
      return false
    }

    return ['radioText', 'radioHint'].includes(activeElementId)
  }

  get listeners() {
    const editLinkListeners: ListenerRow[] = []
    /* TODO - implement edit link and delete link listeners
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
        this._radioElements.radioText,
        (target) => {
          const { id } = RadioQuestionElements.getUpdateData(target)
          this._question.highlight = `${id}-label`
        },
        'focus'
      ] as ListenerRow,
      [
        this._radioElements.radioText,
        (_target) => {
          this._question.highlight = undefined
        },
        'blur'
      ] as ListenerRow,
      [
        this._radioElements.radioHint,
        (target) => {
          const { id } = RadioQuestionElements.getUpdateData(target)
          this._radioQuestion.updateHint(id, target.value)
        },
        'input'
      ] as ListenerRow,
      [
        this._radioElements.radioHint,
        (target) => {
          const { id } = RadioQuestionElements.getUpdateData(target)
          this._question.highlight = `${id}-hint`
        },
        'focus'
      ] as ListenerRow,
      [
        this._radioElements.radioHint,
        (_target) => {
          this._question.highlight = undefined
        },
        'blur'
      ] as ListenerRow
    ]

    const highlightListeners = this._radioElements.listElements.flatMap(
      (listElem) => [
        [
          listElem,
          (_target, _e) => {
            if (!this.editFieldHasFocus()) {
              this._question.highlight = `${listElem.dataset.id}-label`
              if (listElem.dataset.hint?.length) {
                this._question.highlight = `${listElem.dataset.id}-hint`
              }
            }
          },
          'mouseover'
        ] as ListenerRow,
        [
          listElem,
          (_target, _e) => {
            if (!this.editFieldHasFocus()) {
              this._question.highlight = undefined
            }
          },
          'mouseout'
        ] as ListenerRow
      ]
    )

    return editPanelListeners
      .concat(highlightListeners)
      .concat(editLinkListeners)
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
 * @param { ListElement[]| undefined } listElements
 * @returns {Map<string, ListElement>}
 */
export function listsElementToMap(listElements: ListElement[] | undefined) {
  const entries = listElements ? listElements.map(listItemMapper) : []
  return new Map<string, ListElement>(entries)
}

export class Radio extends Question {
  _questionTemplate = 'radios.njk'
  _radioElements: RadioQuestionElements

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
    this._radioElements = radioElements
  }

  get afterInput() {
    if (!this.list.length) {
      return {
        afterInputs: {
          html:
            '<div class="govuk-inset-text"><p class="govuk-body">No items added yet.</p><div class="govuk-inset-text">' +
            '<p class="govuk-body">No items added yet.</p>' +
            '</div></div>'
        }
      }
    }
    return {}
  }

  get renderInput() {
    const afterInputs: { formGroup?: { afterInputs: { html: string } } } = this
      .list.length
      ? {}
      : {
          formGroup: {
            afterInputs: {
              html: this._radioElements.afterInputsHTML
            }
          }
        }

    return {
      id: 'radioInput',
      name: 'radioInputField',
      fieldset: this.fieldSet,
      hint: this.hint,
      items: this.list,
      ...afterInputs
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

  get list(): readonly ListItemReadonly[] {
    const iterator: MapIterator<ListElement> = this._list.values()
    return Array.from(iterator).map((listItem) => {
      const hintText =
        this._highlight === `${listItem.id}-hint` &&
        !listItem.hint?.text?.length
          ? 'Hint text'
          : (listItem.hint?.text ?? '')

      const hint = {
        hint: hintText
          ? {
              text: hintText
            }
          : undefined
      }

      const text = listItem.text.length ? listItem.text : 'Item text'

      return {
        ...listItem,
        text,
        ...hint,
        label: {
          text: listItem.text,
          classes: this.getHighlight(listItem.id + '-label')
        }
      }
    })
  }

  updateText(id: string | undefined, text: string) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.text = text
      this.render()
    }
  }

  updateHint(id: string | undefined, text: string) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.hint = {
        ...listItem.hint,
        text
      }
      this.render()
    }
  }

  updateValue(id: string | undefined, value: string) {
    if (!id) {
      return
    }

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
