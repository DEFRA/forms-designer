import {
  EventListeners,
  Question,
  QuestionElements
} from '~/src/javascripts/preview/question.js'

const DefaultListConst = {
  TextElementId: 'radioText',
  HintElementId: 'radioHint',
  Template: 'radios.njk',
  Input: 'radioInput',
  RenderName: 'radioInputField'
}

export class ListQuestionElements extends QuestionElements {
  /** @type {HTMLInputElement[]} */
  editLinks
  /** @type {HTMLElement[]} */
  listElements
  /** @type { HTMLInputElement | undefined } */
  updateElement
  /** @type {HTMLInputElement} */
  listText
  /** @type {HTMLInputElement} */
  listHint
  /** @type {string} */
  afterInputsHTML
  listTextElementId = DefaultListConst.TextElementId
  listHintElementId = DefaultListConst.HintElementId

  constructor() {
    super()
    const editElements = document.querySelectorAll(
      '#options-container .edit-option-link'
    )
    const listText = /** @type {HTMLInputElement} */ (
      document.getElementById(this.listTextElementId)
    )
    const listHint = /** @type {HTMLInputElement} */ (
      document.getElementById(this.listHintElementId)
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
    this.listText = listText
    this.listHint = listHint
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
      ListQuestionElements.getParentUpdateElement(el)
    )
    return /** @type {ListElement} */ (
      ListQuestionElements.getListElementValues(updateElement)
    )
  }

  /**
   *
   * @param {HTMLElement} el
   * @returns {ListElement}
   */
  static getListElementValues(el) {
    const hint = el.dataset.hint ? { hint: { text: el.dataset.hint } } : {}
    let id = 'new'

    if (el.dataset.id) {
      id = el.dataset.id
    }

    return /** @type {ListElement} */ ({
      id,
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
      items: this.listElements.map(ListQuestionElements.getListElementValues)
    }
  }
}

export class ListEventListeners extends EventListeners {
  /** @type {HTMLElement[]} */
  listElements
  /** @type {ListQuestionElements} */
  _listElements
  /** @type {List} */
  _listQuestion
  listTextElementId = DefaultListConst.TextElementId
  listHintElementId = DefaultListConst.HintElementId

  /**
   *
   * @param {List} question
   * @param {ListQuestionElements} listQuestionElements
   * @param {HTMLElement[]} listElements
   */
  constructor(question, listQuestionElements, listElements) {
    super(question, listQuestionElements)
    this.listElements = listElements
    this._listElements = listQuestionElements
    this._listQuestion = question
  }

  editFieldHasFocus() {
    if (!document.hasFocus()) {
      return false
    }

    const activeElementId = document.activeElement?.id
    if (!activeElementId) {
      return false
    }

    return [this.listTextElementId, this.listHintElementId].includes(
      activeElementId
    )
  }

  /**
   * @returns {ListenerRow[]}
   */
  get editPanelListeners() {
    const editPanelListener1 = /** @type {ListenerRow} */ ([
      this._listElements.listText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = ListQuestionElements.getUpdateData(target)
        this._listQuestion.updateText(id, target.value)
      },
      'input'
    ])
    const editPanelListener2 = /** @type {ListenerRow} */ ([
      this._listElements.listText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = ListQuestionElements.getUpdateData(target)
        this._question.highlight = `${id}-label`
      },
      'focus'
    ])
    const editPanelListener3 = /** @type {ListenerRow} */ ([
      this._listElements.listText,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = null
      },
      'blur'
    ])
    const editPanelListener4 = /** @type {ListenerRow} */ ([
      this._listElements.listHint,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = ListQuestionElements.getUpdateData(target)
        this._listQuestion.updateHint(id, target.value)
      },
      'input'
    ])
    const editPanelListener5 = /** @type {ListenerRow} */ ([
      this._listElements.listHint,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = ListQuestionElements.getUpdateData(target)
        this._question.highlight = `${id}-hint`
      },
      'focus'
    ])
    const editPanelListener6 = /** @type {ListenerRow} */ ([
      this._listElements.listHint,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = null
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
  get listHighlightListeners() {
    return this._listElements.listElements.flatMap((listElem) => {
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
            this._question.highlight = null
          }
        },
        'mouseout'
      ])

      return [mouseOverRow, mouseOutRow]
    })
  }

  /**
   * @returns {ListenerRow[]}
   */
  get customListeners() {
    return []
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
    const highlightListeners = this.listHighlightListeners
    const customListeners = this.customListeners

    return editPanelListeners
      .concat(highlightListeners)
      .concat(editLinkListeners)
      .concat(customListeners)
  }
}

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

export class List extends Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = DefaultListConst.Template
  /** @type {ListQuestionElements} */
  _listElements
  listRenderId = DefaultListConst.Input
  listRenderName = DefaultListConst.RenderName

  /**
   * @type {Map<string, ListElement>}
   * @protected
   */
  _list

  /**
   * @param {ListQuestionElements} listQuestionElements
   */
  constructor(listQuestionElements) {
    super(listQuestionElements)
    const listeners = new ListEventListeners(this, listQuestionElements, [])
    listeners.setupListeners()
    const items = /** @type {ListElement[]} */ (
      listQuestionElements.values.items
    )
    this._list = this.createListFromElements(items)
    this._listElements = listQuestionElements
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
                  html: this._listElements.afterInputsHTML
                }
              }
            }
      )

    return {
      id: this.listRenderId,
      name: this.listRenderName,
      fieldset: this.fieldSet,
      hint: this.hint,
      items: this.list,
      ...afterInputs
    }
  }

  /**
   *
   * @param {ListElement} listElement
   */
  push(listElement) {
    this._list.set(listElement.id, listElement)
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
   * @param {ListElement[]} listElements
   * @returns {Map<string, ListElement>}
   */
  createListFromElements(listElements) {
    this._list = listsElementToMap(listElements)
    return this._list
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
              text: hintText,
              classes: this.getHighlight(listItem.id + '-hint')
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
    const elements = new ListQuestionElements()
    const list = new List(elements)
    list.render()

    return list
  }
}

/**
 * @import {ListenerRow} from '~/src/javascripts/preview/question.js'
 * @import { ListElement, ListItemReadonly } from '@defra/forms-model'
 */
