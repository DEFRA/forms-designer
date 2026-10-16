import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * @class DeclarationDomElements
 * @classdesc
 * This class is responsible for interaction with the Document Object Model
 * and provides an interface for external interactions.  QuestionDomElements
 * gives external access to the dom elements, QuestionElements is a reduced
 * interface for use with the Question class which hides the DOM and just
 * returns the values
 * @implements {QuestionElements}
 */
export class DeclarationDomElements extends QuestionDomElements {
  constructor() {
    super()
    const declarationTextEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('declarationText')
    )

    /**
     * @type {HTMLInputElement|null}
     */
    this.declarationText = declarationTextEl
  }

  /**
   * @protected
   * @returns {DeclarationSettings}
   */
  constructValues() {
    const baseValues = super.constructValues()

    return {
      ...baseValues,
      declarationText: this.declarationText?.value ?? ''
    }
  }

  /**
   * @returns {DeclarationSettings}
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
export class DeclarationEventListeners extends EventListeners {
  /**
   * @param {DeclarationQuestion} question
   * @param {DeclarationDomElements} baseElements
   */
  constructor(question, baseElements) {
    super(question, baseElements)
    this._question = question
    this.baseElements = baseElements
  }

  /**
   * @returns {ListenerRow[]}
   * @protected
   */
  _getListeners() {
    const listeners = super._getListeners()

    const declarationTextListener = /** @type {ListenerRow} */ ([
      this.baseElements.declarationText,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.declarationText = target.value
      },
      'input'
    ])

    return [...listeners, declarationTextListener]
  }

  /**
   * @returns {ListenerRow[]}
   */
  get highlightListeners() {
    const element = /** @type {HTMLInputElement | null} */ (
      this.baseElements.declarationText
    )
    const highlight = /** @type {string} */ ('declarationText')

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
    return [...super._getHighlightListeners(), focusRow, blurRow]
  }
}

/**
 * @import { ListenerRow, DeclarationSettings, QuestionElements, DeclarationQuestion } from '@defra/forms-model'
 */
