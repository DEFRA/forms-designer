import { MULTILINE_TEXT_QUESTION_DEFAULT_ROWS } from '@defra/forms-model'

import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * @class MultilineTextFieldDomElements
 * @classdesc
 * This class is responsible for interaction with the Document Object Model
 * and provides an interface for external interactions for multiline text fields.
 * @implements {MultilineTextFieldDomElements}
 */
export class MultilineTextFieldDomElements extends QuestionDomElements {
  constructor() {
    super()
    const maxLengthEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('maxLength')
    )
    const rowsEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('rows')
    )

    /**
     * @type {HTMLInputElement|null}
     */
    this.maxLength = maxLengthEl

    /**
     * @type {HTMLInputElement|null}
     */
    this.rows = rowsEl
  }

  /**
   * @protected
   * @returns {MultilineTextFieldSettings}
   */
  constructValues() {
    const baseValues = super.constructValues()

    return {
      ...baseValues,
      maxLength: this.maxLength?.value
        ? Number.parseInt(this.maxLength.value, 10)
        : 0,
      rows: this.rows?.value
        ? Number.parseInt(this.rows.value, 10)
        : MULTILINE_TEXT_QUESTION_DEFAULT_ROWS
    }
  }

  /**
   * @returns {MultilineTextFieldSettings}
   * @public
   */
  get values() {
    return this.constructValues()
  }
}

/**
 * @class MultilineTextFieldEventListeners
 * @classdesc
 * This class is responsible for setting up the event listeners on the DOM for
 * multiline text fields and orchestrating the resulting actions.
 */
export class MultilineTextFieldEventListeners extends EventListeners {
  /**
   * @param {LongAnswerQuestion} question
   * @param {MultilineTextFieldDomElements} baseElements
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

    const maxLengthListener = /** @type {ListenerRow} */ ([
      this.baseElements.maxLength,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const value = Number.parseInt(target.value, 10)
        this._question.maxLength = Number.isNaN(value) ? 0 : value
      },
      'input'
    ])

    const rowsListener = /** @type {ListenerRow} */ ([
      this.baseElements.rows,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        const value = Number.parseInt(target.value, 10)
        this._question.rows = Number.isNaN(value)
          ? MULTILINE_TEXT_QUESTION_DEFAULT_ROWS
          : value
      },
      'input'
    ])

    return [...listeners, maxLengthListener, rowsListener]
  }
}

/**
 * @import { ListenerRow, LongAnswerQuestion, MultilineTextFieldSettings } from '@defra/forms-model'
 */
