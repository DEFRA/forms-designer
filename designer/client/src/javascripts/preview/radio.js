import '~/src/views/components/inset.njk'

import {
  EventListeners,
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

export class RadioQuestionElements extends QuestionElements {
  /** @type {HTMLInputElement[]} */
  editLinks
  /** @type {HTMLInputElement[]} */
  listElements
  /** @type { HTMLInputElement | undefined } */
  updateElement
  /** @type {HTMLInputElement} */
  radioText
  /** @type {HTMLInputElement} */
  radioHint
  /** @type {string} */
  afterInputsHTML

  constructor() {
    super()
    const editElements = document.querySelectorAll(
      '#options-container .edit-option-link'
    )
    const radioText = /** @type {HTMLInputElement} */ (
      document.getElementById('radioText')
    )
    const radioHint = /** @type {HTMLInputElement} */ (
      document.getElementById('radioHint')
    )
    const updateElement = /** @type {HTMLInputElement} */ (
      document.getElementById('add-option-form')
    )

    // we could document.createElement update element if need be

    const listElements = document.getElementById('options-container')?.children

    this.editLinks = /** @type {HTMLInputElement[]} */ (
      Array.from(editElements)
    )
    this.listElements = /** @type {HTMLInputElement[]} */ (
      Array.from(listElements ?? [])
    )
    this.radioText = radioText
    this.radioHint = radioHint
    this.updateElement = updateElement
    this.afterInputsHTML = Question._renderHelper('inset.njk', {
      model: {
        text: 'No items added yet.'
      }
    })
  }

  /**
   * @param {HTMLInputElement} el
   * @returns {Element}
   */
  static getParentUpdateElement(el) {
    return /** @type {Element} */ (el.closest('#add-option-form'))
  }

  /**
   * @param {HTMLInputElement} el
   * @returns {{ id?: string }}
   */
  static getUpdateData(el) {
    const updateElement = /** @type {HTMLInputElement} */ (
      RadioQuestionElements.getParentUpdateElement(el)
    )
    return /** @type {ListElement} */ (
      RadioQuestionElements.getListElementValues(updateElement)
    )
  }

  /**
   *
   * @param {HTMLElement} el
   * @returns {ListElement}
   */
  static getListElementValues(el) {
    const hint = el.dataset.hint ? { hint: { text: el.dataset.hint } } : {}
    return /** @type {ListElement} */ ({
      id: el.dataset.id ?? 'new',
      text: el.dataset.text,
      ...hint,
      label: {
        classes: '',
        text: el.dataset.text
      },
      value: el.dataset.val
    })
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
  /** @type {HTMLElement[]} */
  listElements
  /** @type {RadioQuestionElements} */
  _radioElements
  /** @type {Radio} */
  _radioQuestion

  /**
   *
   * @param {Radio} question
   * @param {RadioQuestionElements} radioElements
   * @param {HTMLElement[]} listElements
   */
  constructor(question, radioElements, listElements) {
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

  /**
   * @returns {ListenerRow[]}
   */
  get editPanelListeners() {
    const editPanelListener1 = /** @type {ListenerRow} */ ([
      this._radioElements.radioText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = RadioQuestionElements.getUpdateData(target)
        this._radioQuestion.updateText(id, target.value)
      },
      'input'
    ])
    const editPanelListener2 = /** @type {ListenerRow} */ ([
      this._radioElements.radioText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = RadioQuestionElements.getUpdateData(target)
        this._question.highlight = `${id}-label`
      },
      'focus'
    ])
    const editPanelListener3 = /** @type {ListenerRow} */ ([
      this._radioElements.radioText,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = undefined
      },
      'blur'
    ])
    const editPanelListener4 = /** @type {ListenerRow} */ ([
      this._radioElements.radioHint,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = RadioQuestionElements.getUpdateData(target)
        this._radioQuestion.updateHint(id, target.value)
      },
      'input'
    ])
    const editPanelListener5 = /** @type {ListenerRow} */ ([
      this._radioElements.radioHint,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = RadioQuestionElements.getUpdateData(target)
        this._question.highlight = `${id}-hint`
      },
      'focus'
    ])
    const editPanelListener6 = /** @type {ListenerRow} */ ([
      this._radioElements.radioHint,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = undefined
      },
      'blur'
    ])

    return [
      editPanelListener1,
      editPanelListener2,
      editPanelListener3,
      editPanelListener4,
      editPanelListener5,
      editPanelListener6
    ]
  }

  /**
   * @returns {ListenerRow[]}
   */
  get radioHighlightListeners() {
    return this._radioElements.listElements.flatMap((listElem) => {
      const mouseOverRow = /** @type {ListenerRow} */ ([
        /** @type {HTMLInputElement} */ (listElem),
        /**
         * @param {HTMLInputElement} _target
         * @param {Event} _e
         */
        (_target, _e) => {
          if (!this.editFieldHasFocus()) {
            this._question.highlight = `${listElem.dataset.id}-label`
            if (listElem.dataset.hint?.length) {
              this._question.highlight = `${listElem.dataset.id}-hint`
            }
          }
        },
        'mouseover'
      ])

      const mouseOutRow = /** @type {ListenerRow} */ ([
        /** @type {HTMLInputElement} */ (listElem),
        /**
         * @param {HTMLInputElement} _target
         * @param {Event} _e
         */
        (_target, _e) => {
          if (!this.editFieldHasFocus()) {
            this._question.highlight = undefined
          }
        },
        'mouseout'
      ])

      return [mouseOverRow, mouseOutRow]
    })
  }

  get listeners() {
    const editLinkListeners = /** @type {ListenerRow[]} */ ([])
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
        ]
    )
    */
    const editPanelListeners = this.editPanelListeners
    const highlightListeners = this.radioHighlightListeners

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
export function listItemMapper(listElement) {
  return [listElement.id, listElement]
}

/**
 *
 * @param { ListElement[]| undefined } listElements
 * @returns {Map<string, ListElement>}
 */
export function listsElementToMap(listElements) {
  const entries = listElements ? listElements.map(listItemMapper) : []
  return new Map(entries)
}

export class Radio extends Question {
  _questionTemplate = 'radios.njk'
  /** @type {RadioQuestionElements} */
  _radioElements

  /**
   * @type {Map<string, ListElement>}
   * @private
   * @readonly
   */
  _list

  /**
   * @param {RadioQuestionElements} radioElements
   */
  constructor(radioElements) {
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
    const afterInputs =
      /** @type {{ formGroup?: { afterInputs: { html: string } } }} */ (
        this.list.length
          ? {}
          : {
              formGroup: {
                afterInputs: {
                  html: this._radioElements.afterInputsHTML
                }
              }
            }
      )

    return {
      id: 'radioInput',
      name: 'radioInputField',
      fieldset: this.fieldSet,
      hint: this.hint,
      items: this.list,
      ...afterInputs
    }
  }

  /**
   *
   * @param {ListElement} radioElement
   */
  push(radioElement) {
    this._list.set(radioElement.id, radioElement)
    this.render()
  }

  /**
   * @param {string} key
   */
  delete(key) {
    this._list.delete(key)
    this.render()
  }

  /**
   * @returns {ListItemReadonly[]}
   * @readonly
   */
  get list() {
    const iterator = /** @type {MapIterator<ListElement>} */ (
      this._list.values()
    )
    return Array.from(iterator).map((listItem) => {
      const hintText =
        this._highlight === `${listItem.id}-hint` && !listItem.hint?.text.length
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

  /**
   *
   * @param {string | undefined} id
   * @param {string} text
   */
  updateText(id, text) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.text = text
      this.render()
    }
  }

  /**
   *
   * @param {string | undefined} id
   * @param {string} hint
   */
  updateHint(id, hint) {
    if (!id) {
      return
    }

    const listItem = this._list.get(id)
    if (listItem) {
      listItem.hint = {
        ...listItem.hint,
        text: hint
      }
      this.render()
    }
  }

  /**
   * @param {string | undefined} id
   * @param {string} value
   */
  updateValue(id, value) {
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

    return radioField
  }
}

/**
 * @import {ListenerRow} from '~/src/javascripts/preview/question.js'
 * @import { ListElement, ListItemReadonly } from '@defra/forms-model'
 */
