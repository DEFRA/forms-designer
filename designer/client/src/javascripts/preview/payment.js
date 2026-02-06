import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * Payment field DOM elements handler
 * @implements {PaymentElements}
 */
export class PaymentDomElements extends QuestionDomElements {
  /**
   * @type {HTMLInputElement | null}
   * @private
   */
  _paymentAmountEl

  /**
   * @type {HTMLInputElement | null}
   * @private
   */
  _paymentDescriptionEl

  /**
   * @type {number}
   * @protected
   */
  _paymentAmount = 0

  /**
   * @type {string}
   * @protected
   */
  _paymentDescription = ''

  constructor() {
    super()
    this._paymentAmountEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('paymentAmount')
    )
    this._paymentDescriptionEl = /** @type {HTMLInputElement | null} */ (
      document.getElementById('paymentDescription')
    )

    if (this._paymentAmountEl) {
      const amount = parseFloat(this._paymentAmountEl.value)
      this._paymentAmount = isNaN(amount) ? 0 : amount
    }

    if (this._paymentDescriptionEl) {
      this._paymentDescription = this._paymentDescriptionEl.value || ''
    }
  }

  get values() {
    return {
      ...this.constructValues(),
      paymentAmount: this._paymentAmount,
      paymentDescription: this._paymentDescription
    }
  }

  /**
   * @returns {HTMLInputElement | null}
   */
  get paymentAmountEl() {
    return this._paymentAmountEl
  }

  /**
   * @returns {HTMLInputElement | null}
   */
  get paymentDescriptionEl() {
    return this._paymentDescriptionEl
  }
}

/**
 * Payment field event listeners
 */
export class PaymentEventListeners extends EventListeners {
  /**
   * @param {PaymentQuestion} question
   * @param {PaymentDomElements} elements
   */
  constructor(question, elements) {
    super(question, elements)
    /**
     * @type {PaymentQuestion}
     * @private
     */
    this._paymentQuestion = question
    /**
     * @type {PaymentDomElements}
     * @private
     */
    this._paymentElements = elements
  }

  /**
   * @protected
   * @returns {ListenerRow[]}
   */
  get listeners() {
    /** @type {ListenerRow[]} */
    const paymentListeners = [
      [
        this._paymentElements.paymentAmountEl,
        /**
         * @param {HTMLInputElement | HTMLTextAreaElement} target
         * @param {Event} _e
         */
        (target, _e) => {
          const amount = parseFloat(
            /** @type {HTMLInputElement} */ (target).value
          )
          this._paymentQuestion.paymentAmount = isNaN(amount) ? 0 : amount
        },
        'input'
      ],
      [
        this._paymentElements.paymentDescriptionEl,
        /**
         * @param {HTMLInputElement | HTMLTextAreaElement} target
         * @param {Event} _e
         */
        (target, _e) => {
          this._paymentQuestion.paymentDescription =
            /** @type {HTMLInputElement} */ (target).value
        },
        'input'
      ]
    ]

    return [...this._getListeners(), ...paymentListeners]
  }
}

/**
 * @import { PaymentElements, PaymentQuestion, ListenerRow } from '@defra/forms-model'
 */
