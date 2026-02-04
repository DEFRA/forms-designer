import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

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
   * @param {PaymentFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._paymentAmount = component.options.amount ?? 0
    this._paymentDescription = component.options.description ?? ''
  }

  /**
   * @returns {PaymentSettings}
   */
  get values() {
    return {
      ...super.values,
      paymentAmount: this._paymentAmount,
      paymentDescription: this._paymentDescription
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
   * @param {PaymentElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._paymentAmount = htmlElements.values.paymentAmount
    this._paymentDescription = htmlElements.values.paymentDescription
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

  /**
   * @protected
   * @returns {PaymentModel}
   */
  _renderInput() {
    const amount =
      typeof this._paymentAmount === 'number'
        ? this._paymentAmount.toFixed(2)
        : '0.00'

    return {
      ...super._renderInput(),
      amount,
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
