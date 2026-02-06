import { buildPaymentComponent } from '~/src/__stubs__/components.js'
import { ComponentType } from '~/src/components/enums.js'
import {
  PaymentPreviewElements,
  QuestionRendererStub,
  baseElements
} from '~/src/form/form-editor/__stubs__/preview.js'
import {
  PaymentComponentPreviewElements,
  PaymentQuestion
} from '~/src/form/form-editor/preview/payment.js'

describe('payment', () => {
  const renderer = new QuestionRendererStub(jest.fn())

  describe('PaymentComponentPreviewElements', () => {
    it('should create class with payment amount and description', () => {
      const component = buildPaymentComponent({
        options: { amount: 150, description: 'Test payment' }
      })
      const elements = new PaymentComponentPreviewElements(component)

      expect(elements.values.paymentAmount).toBe(150)
      expect(elements.values.paymentDescription).toBe('Test payment')
    })

    it('should handle zero amount', () => {
      const component = buildPaymentComponent({
        options: { amount: 0, description: '' }
      })
      const elements = new PaymentComponentPreviewElements(component)

      expect(elements.values.paymentAmount).toBe(0)
      expect(elements.values.paymentDescription).toBe('')
    })

    it('should include base values from parent class', () => {
      const component = buildPaymentComponent({
        title: 'Payment title',
        hint: 'Payment hint',
        options: {
          amount: 300,
          description: 'Application fee'
        }
      })
      const elements = new PaymentComponentPreviewElements(component)

      expect(elements.values.question).toBe('Payment title')
      expect(elements.values.hintText).toBe('Payment hint')
      expect(elements.values.paymentAmount).toBe(300)
      expect(elements.values.paymentDescription).toBe('Application fee')
    })
  })

  describe('PaymentQuestion', () => {
    it('should create class with correct component type', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 100,
        paymentDescription: 'Test'
      })
      const question = new PaymentQuestion(elements, renderer)

      expect(question.componentType).toBe(ComponentType.PaymentField)
    })

    it('should have correct template path', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 100,
        paymentDescription: 'Test'
      })
      const question = new PaymentQuestion(elements, renderer)

      // @ts-expect-error - accessing protected property for testing
      expect(question._questionTemplate).toContain('paymentfield.njk')
    })

    it('should initialize with payment values from elements', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 250.5,
        paymentDescription: 'Licence fee'
      })
      const question = new PaymentQuestion(elements, renderer)

      expect(question.paymentAmount).toBe(250.5)
      expect(question.paymentDescription).toBe('Licence fee')
    })

    it('should update payment amount via setter', () => {
      const mockRender = jest.fn()
      const testRenderer = new QuestionRendererStub(mockRender)
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 100,
        paymentDescription: 'Test'
      })
      const question = new PaymentQuestion(elements, testRenderer)

      question.paymentAmount = 200

      expect(question.paymentAmount).toBe(200)
      expect(mockRender).toHaveBeenCalled()
    })

    it('should update payment description via setter', () => {
      const mockRender = jest.fn()
      const testRenderer = new QuestionRendererStub(mockRender)
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 100,
        paymentDescription: 'Original'
      })
      const question = new PaymentQuestion(elements, testRenderer)

      question.paymentDescription = 'Updated description'

      expect(question.paymentDescription).toBe('Updated description')
      expect(mockRender).toHaveBeenCalled()
    })

    it('should format amount in renderInput', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 150.5,
        paymentDescription: 'Test payment'
      })
      const question = new PaymentQuestion(elements, renderer)

      // @ts-expect-error - amount exists on PaymentModel
      expect(question.renderInput.amount).toBe('150.50')
      // @ts-expect-error - description exists on PaymentModel
      expect(question.renderInput.description).toBe('Test payment')
    })

    it('should use default description when empty', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 100,
        paymentDescription: ''
      })
      const question = new PaymentQuestion(elements, renderer)

      // @ts-expect-error - description exists on PaymentModel
      expect(question.renderInput.description).toBe('Payment description')
    })

    it('should format zero amount correctly', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        paymentAmount: 0,
        paymentDescription: 'Free'
      })
      const question = new PaymentQuestion(elements, renderer)

      // @ts-expect-error - amount exists on PaymentModel
      expect(question.renderInput.amount).toBe('0.00')
    })

    it('should handle non-number amount', () => {
      const elements = new PaymentPreviewElements({
        ...baseElements,
        // @ts-expect-error - testing invalid type
        paymentAmount: 'invalid',
        paymentDescription: 'Test'
      })
      const question = new PaymentQuestion(elements, renderer)

      // @ts-expect-error - amount exists on PaymentModel
      expect(question.renderInput.amount).toBe('0.00')
    })
  })
})
