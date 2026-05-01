import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * Formats a currency amount with thousand separators and two decimal places
 * @param {number} value
 * @param {'en-GB'} [locale] - locale for formatting
 * @param {'GBP'} [currency] - currency code
 * @returns {string} Formatted amount (e.g., "£1,234.56")
 */
function formatCurrency(value, locale = 'en-GB', currency = 'GBP') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })

  return formatter.format(value)
}

/**
 * @implements {PaymentElements}
 */
export class PaymentComponentPreviewElements extends QuestionComponentElements {
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

  /**
   * @type {Array<{ amount: number, condition: string }>}
   * @protected
   */
  _paymentConditionalAmounts = []

  /**
   * @param {PaymentFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._paymentAmount = component.options.amount
    this._paymentDescription = component.options.description
    this._paymentConditionalAmounts = component.options.conditionalAmounts ?? []
  }

  /**
   * @returns {PaymentSettings}
   */
  get values() {
    return {
      ...super.values,
      paymentAmount: this._paymentAmount,
      paymentDescription: this._paymentDescription,
      paymentConditionalAmounts: this._paymentConditionalAmounts
    }
  }
}

export class PaymentQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.PaymentField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'paymentfield.njk'
  _fieldName = 'PaymentField'

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

  /**
   * @type {Array<{ amount: number, condition: string }>}
   * @protected
   */
  _paymentConditionalAmounts = []

  /**
   * @param {PaymentElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._paymentAmount = htmlElements.values.paymentAmount
    this._paymentDescription = htmlElements.values.paymentDescription
    this._paymentConditionalAmounts =
      htmlElements.values.paymentConditionalAmounts
  }

  get paymentAmount() {
    return this._paymentAmount
  }

  /**
   * @param {number} val
   */
  set paymentAmount(val) {
    this._paymentAmount = val
    this.render()
  }

  get paymentDescription() {
    return this._paymentDescription
  }

  /**
   * @param {string} val
   */
  set paymentDescription(val) {
    this._paymentDescription = val
    this.render()
  }

  get paymentConditionalAmounts() {
    return this._paymentConditionalAmounts
  }

  /**
   * @param {Array<{ amount: number, condition: string }>} val
   */
  set paymentConditionalAmounts(val) {
    this._paymentConditionalAmounts = val
    this.render()
  }

  /**
   * Returns the amount the preview should display: the default amount when it
   * is non-zero, otherwise the first conditional amount, otherwise zero.
   * @protected
   * @returns {number}
   */
  _displayAmount() {
    if (typeof this._paymentAmount === 'number' && this._paymentAmount > 0) {
      return this._paymentAmount
    }
    return this._paymentConditionalAmounts[0]?.amount ?? 0
  }

  /**
   * @protected
   * @returns {PaymentModel}
   */
  _renderInput() {
    return {
      ...super._renderInput(),
      amount: formatCurrency(this._displayAmount()),
      description: this._paymentDescription || 'Payment description',
      headingClasses: 'govuk-heading-m'
    }
  }
}

/**
 * @import { PaymentSettings, PaymentElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { PaymentModel } from '~/src/form/form-editor/macros/types.js'
 * @import { PaymentFieldComponent } from '~/src/components/types.js'
 */
