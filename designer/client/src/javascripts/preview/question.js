import njk from '~/src/javascripts/preview/nunjucks.js'

/**
 * @typedef BaseSettings
 * @property {string} question -
 * @property {string} hintText -
 * @property {boolean} optional -
 * @property {string} shortDesc -
 * @property {ListElement[]} [items] -
 */

export class QuestionElements {
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
   * @returns {BaseSettings}
   * @public
   */
  get values() {
    const hintText = /** @type {string} */ (this.hintText?.value ?? '')
    const optional = this.optional?.checked ?? false
    const question = this.question?.value ?? ''
    const shortDesc = this.shortDesc?.value ?? ''

    return /** @type {BaseSettings} */ ({
      hintText,
      optional,
      question,
      shortDesc
    })
  }

  /**
   * @param {string} value
   */
  setPreviewHTML(value) {
    if (this.preview) {
      this.preview.innerHTML = value
    }
  }
}

/**
 * @typedef {[
 *   HTMLInputElement | null,
 *   (target: HTMLInputElement) => void,
 *   keyof HTMLElementEventMap
 * ]} ListenerRow
 */

export class EventListeners {
  /**
   * @param {Question} question
   * @param {QuestionElements} baseElements
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
          this._question.highlight = undefined
        },
        'blur'
      ])

      return /** @type {ListenerRow[]} */ [focusRow, blurRow]
    })
  }

  /**
   * @protected
   * @returns {ListenerRow[]}
   */
  get listeners() {
    const row1 = /** @type {ListenerRow} */ ([
      this.baseElements.question,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.question = target.value
      },
      'input'
    ])

    const row2 = /** @type {ListenerRow} */ ([
      this.baseElements.hintText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.hintText = target.value
      },
      'input'
    ])

    const row3 = /** @type {ListenerRow} */ ([
      this.baseElements.optional,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.optional = target.checked
      },
      'change'
    ])
    return [row1, row2, row3, ...this.highlightListeners]
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
 * @typedef {{
 *    readonly id: string
 *    readonly value: string
 *    readonly text: string
 *    readonly hint?: DefaultComponent
 * }} ListItem
 */

/**
 * @typedef {{
 *   id: string
 *   name: string
 *   label?: DefaultComponent
 *   hint?: DefaultComponent
 *   fieldset?: FieldSet
 *   items?: ListItem
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

export class Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'textfield.njk'
  /**
   * @type {string|undefined}
   * @protected
   */
  _highlight = undefined

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

    const listeners = new EventListeners(this, htmlElements)
    listeners.setupListeners()

    /**
     * @type {EventListeners}
     * @private
     */
    this._listeners = listeners
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
    return (this._question === '' ? 'Question' : this._question) + optionalText
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
      id: 'inputField',
      name: 'inputField',
      label: this.label,
      hint: this.hint
    }
  }

  _render() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const NJK = /** @type {NJK} */ (njk)
    const render = NJK.render

    const html = render(this._questionTemplate, {
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
   * @type {string | undefined}
   */
  get highlight() {
    return this._highlight
  }

  /**
   * @param {string | undefined} value
   */
  set highlight(value) {
    this._highlight = value
    this.render()
  }

  static setupPreview() {
    new Question(new QuestionElements()).render()
  }
}
