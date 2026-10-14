import { addPathToEditorBaseUrl } from '@defra/forms-designer/client/src/javascripts/preview/helper.js'
import {
  EventListeners,
  QuestionDomElements
} from '@defra/forms-designer/client/src/javascripts/preview/question.js'
import { Question } from '@defra/forms-model'

const DefaultListConst = {
  TextElementId: 'radioText',
  HintElementId: 'radioHint',
  ValueElementId: 'radioValue',
  Template: Question.PATH + 'radios.njk',
  Input: 'listInput',
  RenderName: 'listInputField'
}

/**
 * @implements {ListElements}
 */
export class ListQuestionDomElements extends QuestionDomElements {
  /** @type {HTMLInputElement[]} */
  editLinks
  /** @type { HTMLInputElement | undefined } */
  updateElement
  /** @type {HTMLInputElement} */
  listText
  /** @type {HTMLInputElement} */
  listHint
  /** @type {HTMLInputElement} */
  listValue
  /** @type {string} */
  afterInputsHTML
  listTextElementId = DefaultListConst.TextElementId
  listHintElementId = DefaultListConst.HintElementId
  listValueElementId = DefaultListConst.ValueElementId
  /**
   * @type {string}
   * @protected
   */
  _updateElement = '#add-option-form'
  /**
   * @type {HTMLCollection}
   */
  listElementCollection

  /**
   * @param {HTMLBuilder} htmlBuilder
   */
  constructor(htmlBuilder) {
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
    const listValue = /** @type {HTMLInputElement} */ (
      document.getElementById(this.listValueElementId)
    )
    const updateElement = /** @type {HTMLInputElement} */ (
      document.getElementById('add-option-form')
    )

    // we could document.createElement update element if need be

    const optionsContainer =
      /** @type {HTMLInputElement} */
      (
        document.getElementById('options-container') ??
          document.createElement('div')
      )
    /**
     * @type {HTMLCollection}
     */
    this.listElementCollection = optionsContainer.children
    this.editLinks = /** @type {HTMLInputElement[]} */ (
      Array.from(editElements)
    )

    this.listText = listText
    this.listHint = listHint
    this.listValue = listValue
    this.updateElement = updateElement
    const path = Question.PATH + 'inset.njk'
    this.afterInputsHTML = htmlBuilder.buildHTML(path, {
      model: {
        text: 'No items added yet.'
      }
    })
  }

  /**
   * @returns {HTMLInputElement[]}
   */
  get listElements() {
    return /** @type {HTMLInputElement[]} */ (
      Array.from(this.listElementCollection)
    )
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
   * @returns {Element}
   */
  getParentUpdateElement(el) {
    return /** @type {Element} */ (el.closest(this._updateElement))
  }

  /**
   * @param {HTMLInputElement} el
   * @returns {{ id?: string }}
   */
  static getUpdateData(el) {
    const updateElement = /** @type {HTMLInputElement} */ (
      ListQuestionDomElements.getParentUpdateElement(el)
    )
    return /** @type {ListElement} */ (
      ListQuestionDomElements.getListElementValues(updateElement)
    )
  }

  /**
   * @param {HTMLInputElement} el
   * @returns {{ id?: string }}
   */
  getUpdateData(el) {
    const updateElement = /** @type {HTMLInputElement} */ (
      this.getParentUpdateElement(el)
    )
    return /** @type {ListElement} */ (
      ListQuestionDomElements.getListElementValues(updateElement)
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
      items: this.listElements.map(ListQuestionDomElements.getListElementValues)
    }
  }

  redirectToErrorPage() {
    const errorUrl = addPathToEditorBaseUrl(window.location.href, '/error')
    window.location.href = errorUrl
  }
}

export class ListEventListeners extends EventListeners {
  /** @type {HTMLElement[]} */
  listElements
  /** @type {ListQuestionDomElements} */
  _listElements
  /** @type {ListQuestion} */
  _listQuestion
  listTextElementId = DefaultListConst.TextElementId
  listHintElementId = DefaultListConst.HintElementId
  listValueElementId = DefaultListConst.ValueElementId

  /**
   *
   * @param {ListQuestion} question
   * @param {ListQuestionDomElements} listQuestionElements
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

    return [
      this.listTextElementId,
      this.listHintElementId,
      this.listValueElementId
    ].includes(activeElementId)
  }

  /**
   * @returns {ListenerRow[]}
   */
  get editPanelListeners() {
    const listTextInputListener = /** @type {ListenerRow} */ ([
      this._listElements.listText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = this._listElements.getUpdateData(target)
        this._listQuestion.updateText(id, target.value)
      },
      'input'
    ])
    const listTextFocusListener = /** @type {ListenerRow} */ ([
      this._listElements.listText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = this._listElements.getUpdateData(target)
        this._question.highlight = `${id}-label`
      },
      'focus'
    ])
    const listTextBlurListener = /** @type {ListenerRow} */ ([
      this._listElements.listText,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = null
      },
      'blur'
    ])
    const listHintInputListener = /** @type {ListenerRow} */ ([
      this._listElements.listHint,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = this._listElements.getUpdateData(target)
        this._listQuestion.updateHint(id, target.value)
      },
      'input'
    ])
    const listHintFocusListener = /** @type {ListenerRow} */ ([
      this._listElements.listHint,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = this._listElements.getUpdateData(target)
        this._question.highlight = `${id}-hint`
      },
      'focus'
    ])
    const listHintBlurListener = /** @type {ListenerRow} */ ([
      this._listElements.listHint,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = null
      },
      'blur'
    ])
    const listValueFocusListener = /** @type {ListenerRow} */ ([
      this._listElements.listValue,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const { id } = this._listElements.getUpdateData(target)
        this._question.highlight = `${id}-label`
      },
      'focus'
    ])
    const listValueBlurListener = /** @type {ListenerRow} */ ([
      this._listElements.listValue,
      /**
       * @param {HTMLInputElement} _target
       */
      (_target) => {
        this._question.highlight = null
      },
      'blur'
    ])

    return [
      listTextInputListener,
      listTextFocusListener,
      listTextBlurListener,
      listHintInputListener,
      listHintFocusListener,
      listHintBlurListener,
      listValueFocusListener,
      listValueBlurListener
    ]
  }

  /**
   * @returns {ListenerRow[]}
   */
  get customListeners() {
    return []
  }

  /**
   * @returns {ListenerRow[]}
   * @protected
   */
  _getListeners() {
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
    const customListeners = this.customListeners

    return editPanelListeners
      .concat(super._getListeners())
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

/**
 * @import { ListenerRow, ListQuestion, ListElement, ListItemReadonly, ListElements, QuestionRenderer, HTMLBuilder } from '@defra/forms-model'
 */
