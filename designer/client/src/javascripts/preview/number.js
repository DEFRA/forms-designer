import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * @class NumberDomElements
 * @classdesc
 * This class is responsible for interaction with the Document Object Model
 * and provides an interface for external interactions.  QuestionDomElements
 * gives external access to the dom elements, QuestionElements is a reduced
 * interface for use with the Question class which hides the DOM and just
 * returns the values
 * @implements {NumberDomElements}
 */
export class NumberDomElements extends QuestionDomElements {
  constructor() {
    super()
    const prefixEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('prefix')
    )
    const suffixEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('suffix')
    )

    /**
     * @type {HTMLInputElement|null}
     */
    this.prefix = prefixEl

    /**
     * @type {HTMLInputElement|null}
     */
    this.suffix = suffixEl
  }

  /**
   * @protected
   * @returns {NumberSettings}
   */
  constructValues() {
    const baseValues = super.constructValues()

    return {
      ...baseValues,
      prefix: this.prefix?.value ?? '',
      suffix: this.suffix?.value ?? ''
    }
  }

  /**
   * @returns {NumberSettings}
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
export class NumberEventListeners extends EventListeners {
  /**
   * @param {NumberOnlyQuestion} question
   * @param {NumberDomElements} baseElements
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

    const prefixListener = /** @type {ListenerRow} */ ([
      this.baseElements.prefix,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.prefix = target.value
      },
      'input'
    ])

    const suffixListener = /** @type {ListenerRow} */ ([
      this.baseElements.suffix,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.suffix = target.value
      },
      'input'
    ])

    return [...listeners, prefixListener, suffixListener]
  }
}

/**
 * @import { ListenerRow, NumberOnlyQuestion, NumberSettings } from '@defra/forms-model'
 */
