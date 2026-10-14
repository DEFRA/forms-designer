import { ComponentType, DeclarationQuestion } from '@defra/forms-model'

import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question.js'
import { DeclarationDomElements } from '~/src/javascripts/preview/declaration.js'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('declaration', () => {
  describe('DeclarationDomElements', () => {
    const declarationHTML = `
      <div class="govuk-form-group">
        <label class="govuk-label govuk-label--m" for="declarationText">
          Declaration text
        </label>
        <div id="declarationText-hint" class="govuk-hint">
          Use a declaration if you need users to declare or agree to something before they submit the form
        </div>
        <textarea class="govuk-textarea" id="declarationText" name="declarationText" rows="3" aria-describedby="declarationText-hint">I agree to the terms and conditions</textarea>
      </div>
    `

    it('should find elements', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const res = new DeclarationDomElements()
      expect(res).toBeDefined()
      expect(res.question).toBeDefined()
      expect(res.hintText).toBeDefined()
      expect(res.optional).toBeDefined()
      expect(res.shortDesc).toBeDefined()
      expect(res.preview).toBeDefined()
      expect(res.declarationText).toBeDefined()
    })

    it('should find declarationText element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const res = new DeclarationDomElements()
      expect(res.declarationText).toBeDefined()
      expect(res.declarationText?.id).toBe('declarationText')
      expect(res.declarationText?.value).toBe(
        'I agree to the terms and conditions'
      )
    })

    it('should handle missing declarationText element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new DeclarationDomElements()
      expect(res.declarationText).toBeNull()
    })

    it('should construct values with declarationText', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const res = new DeclarationDomElements()
      const values = res.values
      expect(values).toBeDefined()
      expect(values.declarationText).toBe('I agree to the terms and conditions')
      expect(values.question).toBe('Which quest would you like to pick?')
      expect(values.hintText).toBe('Choose one adventure that best suits you.')
    })

    it('should construct values with empty declarationText', () => {
      const emptyDeclarationHTML = `
        <textarea class="govuk-textarea" id="declarationText" name="declarationText" rows="3"></textarea>
      `
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        emptyDeclarationHTML
      const res = new DeclarationDomElements()
      const values = res.values
      expect(values.declarationText).toBe('')
    })

    it('should construct values with null declarationText element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
      const res = new DeclarationDomElements()
      const values = res.values
      expect(values.declarationText).toBe('')
    })

    it('should inherit base values from QuestionDomElements', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const res = new DeclarationDomElements()
      const values = res.values
      expect(values).toHaveProperty('question')
      expect(values).toHaveProperty('hintText')
      expect(values).toHaveProperty('optional')
      expect(values).toHaveProperty('shortDesc')
      expect(values).toHaveProperty('userClasses')
      expect(values).toHaveProperty('items')
      expect(values).toHaveProperty('largeTitle')
      expect(values).toHaveProperty('content')
      expect(values).toHaveProperty('declarationText')
    })
  })

  describe('DeclarationEventListeners', () => {
    const declarationHTML = `
      <textarea class="govuk-textarea" id="declarationText" name="declarationText" rows="3">Initial declaration</textarea>
    `

    it('should update question declarationText on input event', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const question = /** @type {DeclarationQuestion} */ (
        SetupPreview(ComponentType.DeclarationField)
      )
      const declarationTextEl = /** @type {HTMLTextAreaElement | null} */ (
        document.getElementById('declarationText')
      )

      expect(question.declarationText).toBe('Initial declaration')

      // Simulate input event
      if (declarationTextEl) {
        declarationTextEl.value = 'Updated declaration text'
        const event = new InputEvent('input', { bubbles: true })
        declarationTextEl.dispatchEvent(event)
      }

      expect(question.declarationText).toBe('Updated declaration text')
    })

    it('should set highlight on focus', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const question = /** @type {DeclarationQuestion} */ (
        SetupPreview(ComponentType.DeclarationField)
      )
      const declarationTextEl = /** @type {HTMLTextAreaElement | null} */ (
        document.getElementById('declarationText')
      )

      expect(question.highlight).toBeNull()

      // Simulate focus event
      if (declarationTextEl) {
        const event = new FocusEvent('focus', { bubbles: true })
        declarationTextEl.dispatchEvent(event)
      }

      expect(question.highlight).toBe('declarationText')
    })

    it('should clear highlight on blur', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const question = /** @type {DeclarationQuestion} */ (
        SetupPreview(ComponentType.DeclarationField)
      )
      const declarationTextEl = /** @type {HTMLTextAreaElement | null} */ (
        document.getElementById('declarationText')
      )

      // Set highlight first
      question.highlight = 'declarationText'
      expect(question.highlight).toBe('declarationText')

      // Simulate blur event
      if (declarationTextEl) {
        const event = new FocusEvent('blur', { bubbles: true })
        declarationTextEl.dispatchEvent(event)
      }

      expect(question.highlight).toBeNull()
    })
  })

  describe('DeclarationField', () => {
    const declarationHTML = `
      <textarea class="govuk-textarea" id="declarationText" name="declarationText" rows="3">I agree to the terms</textarea>
    `

    it('should create class', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const res = /** @type {DeclarationQuestion} */ (
        SetupPreview(ComponentType.DeclarationField)
      )
      expect(res).toBeInstanceOf(DeclarationQuestion)
      expect(res).toBeDefined()
      expect(res.declarationText).toBe('I agree to the terms')
    })

    it('should have correct initial values', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        declarationHTML
      const res = /** @type {DeclarationQuestion} */ (
        SetupPreview(ComponentType.DeclarationField)
      )
      expect(res.question).toBe('Which quest would you like to pick?')
      expect(res.hintText).toBe('Choose one adventure that best suits you.')
      expect(res.optional).toBeFalsy()
      expect(res.highlight).toBeNull()
      expect(res.declarationText).toBe('I agree to the terms')
    })

    it('should handle empty declaration text', () => {
      const emptyDeclarationHTML = `
        <textarea class="govuk-textarea" id="declarationText" name="declarationText" rows="3"></textarea>
      `
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        emptyDeclarationHTML
      const res = /** @type {DeclarationQuestion} */ (
        SetupPreview(ComponentType.DeclarationField)
      )
      expect(res.declarationText).toBe('')
    })
  })
})
