import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

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
export class UkAddressDomElements extends QuestionDomElements {
  constructor() {
    super()
    const usePostcodeLookupEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('usePostcodeLookup')
    )

    /**
     * @type {HTMLInputElement|null}
     */
    this.usePostcodeLookup = usePostcodeLookupEl
  }

  /**
   * @protected
   * @returns {BaseSettings}
   */
  constructValues() {
    const baseValues = super.constructValues()

    return {
      ...baseValues,
      usePostcodeLookup: this.usePostcodeLookup?.checked ?? false
    }
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
export class UkAddressEventListeners extends EventListeners {
  /**
   * @param {UkAddressQuestion} question
   * @param {UkAddressDomElements} baseElements
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

    const usePostcodeLookupCheckbox = /** @type {ListenerRow} */ ([
      this.baseElements.usePostcodeLookup,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._question.usePostcodeLookup = target.checked
      },
      'change'
    ])

    return [...listeners, usePostcodeLookupCheckbox]
  }
}

/**
 * @import { ListenerRow, ListElement, BaseSettings, QuestionElements, UkAddressQuestion } from '@defra/forms-model'
 */
