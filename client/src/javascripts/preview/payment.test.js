import { ComponentType, PaymentQuestion } from '@defra/forms-model'

import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import { PaymentDomElements } from '~/src/javascripts/preview/payment.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('payment', () => {
  describe('PaymentDomElements', () => {
    const paymentHTML = `
      <div class="govuk-form-group">
        <label class="govuk-label govuk-label--m" for="paymentAmount">
          Amount
        </label>
        <input class="govuk-input" id="paymentAmount" name="paymentAmount" type="text" value="150.50">
      </div>
      <div class="govuk-form-group">
        <label class="govuk-label govuk-label--m" for="paymentDescription">
          Description
        </label>
        <input class="govuk-input" id="paymentDescription" name="paymentDescription" type="text" value="Application fee">
      </div>
    `

    it('should find elements', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const res = new PaymentDomElements()
      expect(res).toBeDefined()
      expect(res.paymentAmountEl).toBeDefined()
      expect(res.paymentDescriptionEl).toBeDefined()
    })

    it('should find paymentAmount element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const res = new PaymentDomElements()
      expect(res.paymentAmountEl).toBeDefined()
      expect(res.paymentAmountEl?.id).toBe('paymentAmount')
      expect(res.paymentAmountEl?.value).toBe('150.50')
    })

    it('should find paymentDescription element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const res = new PaymentDomElements()
      expect(res.paymentDescriptionEl).toBeDefined()
      expect(res.paymentDescriptionEl?.id).toBe('paymentDescription')
      expect(res.paymentDescriptionEl?.value).toBe('Application fee')
    })

    it('should handle missing payment elements', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new PaymentDomElements()
      expect(res.paymentAmountEl).toBeNull()
      expect(res.paymentDescriptionEl).toBeNull()
    })

    it('should construct values with payment fields', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const res = new PaymentDomElements()
      const values = res.values
      expect(values.paymentAmount).toBe(150.5)
      expect(values.paymentDescription).toBe('Application fee')
    })

    it('should handle invalid paymentAmount', () => {
      const invalidAmountHTML = `
        <input class="govuk-input" id="paymentAmount" name="paymentAmount" type="text" value="invalid">
        <input class="govuk-input" id="paymentDescription" name="paymentDescription" type="text" value="Test">
      `
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        invalidAmountHTML
      const res = new PaymentDomElements()
      expect(res.values.paymentAmount).toBe(0)
    })

    it('should handle empty paymentDescription', () => {
      const emptyDescHTML = `
        <input class="govuk-input" id="paymentAmount" name="paymentAmount" type="text" value="100">
        <input class="govuk-input" id="paymentDescription" name="paymentDescription" type="text" value="">
      `
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        emptyDescHTML
      const res = new PaymentDomElements()
      expect(res.values.paymentDescription).toBe('')
    })
  })

  describe('PaymentEventListeners', () => {
    const paymentHTML = `
      <input class="govuk-input" id="paymentAmount" name="paymentAmount" type="text" value="100">
      <input class="govuk-input" id="paymentDescription" name="paymentDescription" type="text" value="Initial description">
    `

    it('should update question paymentAmount on input event', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const question = /** @type {PaymentQuestion} */ (
        SetupPreview(ComponentType.PaymentField)
      )
      const paymentAmountEl = /** @type {HTMLInputElement | null} */ (
        document.getElementById('paymentAmount')
      )

      expect(question.paymentAmount).toBe(100)

      if (paymentAmountEl) {
        paymentAmountEl.value = '250'
        const event = new InputEvent('input', { bubbles: true })
        paymentAmountEl.dispatchEvent(event)
      }

      expect(question.paymentAmount).toBe(250)
    })

    it('should update question paymentDescription on input event', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const question = /** @type {PaymentQuestion} */ (
        SetupPreview(ComponentType.PaymentField)
      )
      const paymentDescriptionEl = /** @type {HTMLInputElement | null} */ (
        document.getElementById('paymentDescription')
      )

      expect(question.paymentDescription).toBe('Initial description')

      if (paymentDescriptionEl) {
        paymentDescriptionEl.value = 'Updated description'
        const event = new InputEvent('input', { bubbles: true })
        paymentDescriptionEl.dispatchEvent(event)
      }

      expect(question.paymentDescription).toBe('Updated description')
    })

    it('should handle invalid paymentAmount input', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const question = /** @type {PaymentQuestion} */ (
        SetupPreview(ComponentType.PaymentField)
      )
      const paymentAmountEl = /** @type {HTMLInputElement | null} */ (
        document.getElementById('paymentAmount')
      )

      if (paymentAmountEl) {
        paymentAmountEl.value = 'not-a-number'
        const event = new InputEvent('input', { bubbles: true })
        paymentAmountEl.dispatchEvent(event)
      }

      expect(question.paymentAmount).toBe(0)
    })
  })

  describe('PaymentField', () => {
    const paymentHTML = `
      <input class="govuk-input" id="paymentAmount" name="paymentAmount" type="text" value="300">
      <input class="govuk-input" id="paymentDescription" name="paymentDescription" type="text" value="Licence fee">
    `

    it('should create class', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const res = /** @type {PaymentQuestion} */ (
        SetupPreview(ComponentType.PaymentField)
      )
      expect(res).toBeInstanceOf(PaymentQuestion)
      expect(res.paymentAmount).toBe(300)
      expect(res.paymentDescription).toBe('Licence fee')
    })

    it('should have correct initial values', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML + paymentHTML
      const res = /** @type {PaymentQuestion} */ (
        SetupPreview(ComponentType.PaymentField)
      )
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.paymentAmount).toBe(300)
      expect(res.paymentDescription).toBe('Licence fee')
    })
  })
})
