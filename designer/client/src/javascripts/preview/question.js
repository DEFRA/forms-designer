import { DomElements } from '~/src/javascripts/preview/dom-elements.js'

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
export class QuestionDomElements extends DomElements {
  constructor() {
    super()
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
    const userClassesEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('classes')
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
     * @type {HTMLInputElement|null}
     */
    this.userClasses = userClassesEl
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
    const userClasses = this.userClasses?.value ?? ''

    return /** @type {BaseSettings} */ ({
      hintText,
      optional,
      question,
      shortDesc,
      userClasses,
      items: [],
      largeTitle: true,
      content: ''
    })
  }

  /**
   * @returns {BaseSettings}
   * @public
   */
  get values() {
    return this.constructValues()
  }
}

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
   * @returns {ListenerRow[]}
   * @protected
   */
  get highlightListeners() {
    return this._getHighlightListeners()
  }

  /**
   * @returns {ListenerRow[]}
   * @protected
   */
  _getHighlightListeners() {
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

    const userClasses = /** @type {ListenerRow} */ ([
      this.baseElements.userClasses,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.userClasses = target.value
      },
      'input'
    ])

    return [
      questionText,
      hintText,
      optionalCheckbox,
      userClasses,
      ...this.highlightListeners,
      ...this._customListeners
    ]
  }

  /**
   * @returns {ListenerRow[]}
   * @protected
   */
  get _customListeners() {
    return []
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
 * @import { ListenerRow, ListElement, ListItemReadonly, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer, Question } from '@defra/forms-model'
 */
