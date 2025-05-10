import { addPathToEditorBaseUrl } from '~/src/javascripts/preview/helper'
import njk from '~/src/javascripts/preview/nunjucks.js'

/**
 * @class QuestionDomElements
 * @classdesc
 * This class is responsible for interaction with the Document Object Model
 * and provides an interface for external interactions.  QuestionDomElements
 * gives external access to the dom elements, QuestionElements is a reduced
 * interface for use with the Question class which hides the DOM and just
 * returns the values
 * @implements {QuestionElements}
 */
export class QuestionDomElements {
  constructor() {
    const questionEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('question')
    )
    const hintTextEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('hintText')
    )
    const optionalEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('questionOptional')
    )
    const shortDescEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('shortDescription')
    )
    const previewEl = /** @type {HTMLElement | null} */ (
      document.getElementById('question-preview-content')
    )

    /**
     * @type {HTMLInputElement|null}
     */
    this.question = questionEl
    /**
     * @type {HTMLInputElement|null}
     */
    this.hintText = hintTextEl
    /**
     * @type {HTMLInputElement|null}
     */
    this.optional = optionalEl
    /**
     * @type {HTMLInputElement|null}
     */
    this.shortDesc = shortDescEl
    /**
     * @type {HTMLElement|null}
     */
    this.preview = previewEl
  }

  /**
   * @protected
   * @returns {BaseSettings}
   */
  constructValues() {
    const hintText = /** @type {string} */ (this.hintText?.value ?? '')
    const optional = this.optional?.checked ?? false
    const question = this.question?.value ?? ''
    const shortDesc = this.shortDesc?.value ?? ''

    return /** @type {BaseSettings} */ ({
      hintText,
      optional,
      question,
      shortDesc,
      items: []
    })
  }

  /**
   * @returns {BaseSettings}
   * @public
   */
  get values() {
    return this.constructValues()
  }

  /**
   * @param {string} value
   */
  setPreviewHTML(value) {
    if (this.preview) {
      this.preview.innerHTML = value
    }
  }

  redirectToErrorPage() {
    const errorUrl = addPathToEditorBaseUrl(window.location.href, '/error')
    window.location.href = errorUrl
  }
}

/**
 * @typedef {[
 *   HTMLInputElement | null,
 *   (target: HTMLInputElement, e: Event) => void,
 *   keyof HTMLElementEventMap
 * ]} ListenerRow
 */

/**
 * @class EventListeners
 * @classdesc
 * This class is responsible for setting up the event listeners on the DOM and for
 * orchestrating the resulting actions.  It has direct access to the DOM elements through
 * the QuestionDomElements class and to the model renderer Question class.  It is not
 * responsible for the rendering.
 */
export class EventListeners {
  /**
   * @param {Question} question
   * @param {QuestionDomElements} baseElements
   */
  constructor(question, baseElements) {
    /**
     * @property {Question} _question -
     * @protected
     */
    this._question = question
    this.baseElements = baseElements
  }

  /**
   * @param {HTMLElement | null} element
   * @param {(inputElement: HTMLInputElement, event: Event) => void} cb
   * @param {keyof HTMLElementEventMap} type
   * @protected
   */
  inputEventListener(element, cb, type) {
    if (element) {
      element.addEventListener(type, (e) => {
        const target = /** @type {HTMLInputElement} */ (e.target)
        cb(target, e)
      })
    }
  }

  /**
   * @private
   * @returns {ListenerRow[]}
   */
  get highlightListeners() {
    const allItems = /** @type {[HTMLInputElement | null, string][]} */ [
      [this.baseElements.question, 'question'],
      [this.baseElements.hintText, 'hintText']
    ]

    return allItems.flatMap((item) => {
      const element = /** @type {HTMLInputElement | null} */ (item[0])
      const highlight = /** @type {string} */ (item[1])

      const focusRow = /** @type {ListenerRow} */ ([
        element,
        (_target) => {
          this._question.highlight = highlight
        },
        'focus'
      ])
      const blurRow = /** @type {ListenerRow} */ ([
        element,
        (_target) => {
          this._question.highlight = null
        },
        'blur'
      ])

      return /** @type {ListenerRow[]} */ [focusRow, blurRow]
    })
  }

  /**
   * @returns {ListenerRow[]}
   * @protected
   */
  _getListeners() {
    const questionText = /** @type {ListenerRow} */ ([
      this.baseElements.question,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.question = target.value
      },
      'input'
    ])

    const hintText = /** @type {ListenerRow} */ ([
      this.baseElements.hintText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.hintText = target.value
      },
      'input'
    ])

    const optionalCheckbox = /** @type {ListenerRow} */ ([
      this.baseElements.optional,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.optional = target.checked
      },
      'change'
    ])
    return [
      questionText,
      hintText,
      optionalCheckbox,
      ...this.highlightListeners
    ]
  }

  /**
   * @protected
   * @returns {ListenerRow[]}
   */
  get listeners() {
    return this._getListeners()
  }

  setupListeners() {
    for (const [el, cb, type] of this.listeners) {
      this.inputEventListener(el, cb, type)
    }
  }
}

/**
 * @typedef {{
 *   id?: string
 *   text: string
 *   classes: string
 * }} DefaultComponent
 */

/**
 * @typedef {{
 *   legend: DefaultComponent
 * }} FieldSet
 */

/**
 * @readonly
 * @typedef {string} readonlyString
 */

/**
 * @readonly
 * @typedef {DefaultComponent} readonlyDefaultComponent
 */

/**
 * @typedef {{
 *   id?: string
 *   name?: string
 *   label?: DefaultComponent
 *   hint?: DefaultComponent
 *   fieldset?: FieldSet
 *   items?: ReadonlyArray<ListItemReadonly>
 *   text?: string
 *   formGroup?: { afterInputs: { html: string }}
 * }} QuestionBaseModel
 */

/**
 * @typedef {(
 *    name: string,
 *    ctx: {
 *      model: QuestionBaseModel
 *    }
 * ) => string} NJKRender
 */

/**
 * @typedef {{
 *   render: NJKRender
 * }} NJK
 */

/**
 * @class Question
 * @classdesc
 * A data object that has access to the underlying data via the QuestionElements object interface
 * and the templating mechanism to render the HTML for the data.
 *
 * It does not have access to the DOM, but has access to QuestionElements.setPreviewHTML to update
 * the HTML.  Question classes should only be responsible data and rendering as are reused in the
 * server side.
 */
export class Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'textfield.njk'
  /**
   * @type { string|null }
   * @protected
   */
  _highlight = null
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'inputField'

  /**
   * @param {QuestionElements} htmlElements
   */
  constructor(htmlElements) {
    const { question, hintText, optional } = htmlElements.values

    /**
     * @type {QuestionElements}
     * @private
     */
    this._htmlElements = htmlElements
    /**
     * @type {string}
     * @private
     */
    this._question = question
    /**
     * @type {string}
     * @private
     */
    this._hintText = hintText
    /**
     * @type {boolean}
     * @private
     */
    this._optional = optional
  }

  /**
   * @param {string} element
   * @returns {string}
   * @protected
   */
  getHighlight(element) {
    return this._highlight === element ? ' highlight' : ''
  }

  get titleText() {
    const optionalText = this._optional ? ' (optional)' : ''
    return (!this._question ? 'Question' : this._question) + optionalText
  }

  /**
   * @protected
   * @type {DefaultComponent}
   */
  get label() {
    return {
      text: this.titleText,
      classes: 'govuk-label--l' + this.getHighlight('question')
    }
  }

  /**
   * @protected
   * @type {FieldSet}
   */
  get fieldSet() {
    return {
      legend: {
        text: this.titleText,
        classes: 'govuk-fieldset__legend--l' + this.getHighlight('question')
      }
    }
  }

  /**
   * @type {DefaultComponent}
   * @protected
   */
  get hint() {
    const text =
      this._highlight === 'hintText' && !this._hintText.length
        ? 'Hint text'
        : this._hintText

    return {
      text,
      classes: this.getHighlight('hintText')
    }
  }

  /**
   * @type {QuestionBaseModel}
   */
  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      label: this.label,
      hint: this.hint
    }
  }

  /**
   * @returns {NJKRender}
   */
  static get _renderHelper() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const NJK = /** @type {NJK} */ (njk)
    return NJK.render
  }

  _render() {
    const html = Question._renderHelper(this._questionTemplate, {
      model: this.renderInput
    })

    this._htmlElements.setPreviewHTML(html)
  }

  render() {
    // debounce?
    this._render()
  }

  /**
   * @type {string}
   */
  get question() {
    return this._question
  }

  /**
   * @param {string} value
   */
  set question(value) {
    this._question = value
    this.render()
  }

  /**
   * @type {string}
   */
  get hintText() {
    return this._hintText
  }

  /**
   * @param {string} value
   */
  set hintText(value) {
    this._hintText = value
    this.render()
  }

  get optional() {
    return this._optional
  }

  /**
   * @param {boolean} value
   */
  set optional(value) {
    this._optional = value
    this.render()
  }

  /**
   * @type {string | null}
   */
  get highlight() {
    return this._highlight
  }

  /**
   * @param {string | null} value
   */
  set highlight(value) {
    this._highlight = value
    this.render()
  }

  /**
   * @param {QuestionDomElements} questionElements
   * @protected
   */
  init(questionElements) {
    this._listeners = new EventListeners(this, questionElements)
    this._listeners.setupListeners()
    this.render()
  }

  /**
   * @returns {Question}
   */
  static setupPreview() {
    const questionElements = new QuestionDomElements()
    const question = new Question(questionElements)

    question.init(questionElements)

    return question
  }
}

/**
 * @import { ListElement, ListItemReadonly, BaseSettings, QuestionElements } from '@defra/forms-model'
 */
