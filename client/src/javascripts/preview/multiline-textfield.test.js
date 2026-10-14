import { LongAnswerQuestion } from '@defra/forms-model'

import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question'
import {
  MultilineTextFieldDomElements,
  MultilineTextFieldEventListeners
} from '~/src/javascripts/preview/multiline-textfield.js'
import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('MultilineTextField', () => {
  describe('MultilineTextFieldDomElements', () => {
    const multilineTextFieldHTML = `
      <input class="govuk-input" id="maxLength" name="maxLength" type="number" value="200">
      <input class="govuk-input" id="rows" name="rows" type="number" value="8">
    `

    beforeEach(() => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        multilineTextFieldHTML
    })

    it('should find maxLength and rows elements', () => {
      const res = new MultilineTextFieldDomElements()
      expect(res).toBeDefined()
      expect(res.maxLength).toBeDefined()
      expect(res.rows).toBeDefined()
      expect(res.question).toBeDefined()
      expect(res.hintText).toBeDefined()
      expect(res.optional).toBeDefined()
      expect(res.shortDesc).toBeDefined()
      expect(res.preview).toBeDefined()
    })

    it('should parse maxLength and rows values correctly', () => {
      const res = new MultilineTextFieldDomElements()
      expect(res.values.maxLength).toBe(200)
      expect(res.values.rows).toBe(8)
    })

    it('should handle missing maxLength element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        '<input class="govuk-input" id="rows" name="rows" type="number" value="5">'
      const res = new MultilineTextFieldDomElements()
      expect(res.maxLength).toBeNull()
      expect(res.values.maxLength).toBe(0)
    })

    it('should handle missing rows element', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        '<input class="govuk-input" id="maxLength" name="maxLength" type="number" value="100">'
      const res = new MultilineTextFieldDomElements()
      expect(res.rows).toBeNull()
      expect(res.values.rows).toBe(5)
    })

    it('should handle empty maxLength value', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        '<input class="govuk-input" id="maxLength" name="maxLength" type="number" value="">' +
        '<input class="govuk-input" id="rows" name="rows" type="number" value="5">'
      const res = new MultilineTextFieldDomElements()
      expect(res.values.maxLength).toBe(0)
    })

    it('should handle empty rows value', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        '<input class="govuk-input" id="maxLength" name="maxLength" type="number" value="100">' +
        '<input class="govuk-input" id="rows" name="rows" type="number" value="">'
      const res = new MultilineTextFieldDomElements()
      expect(res.values.rows).toBe(5)
    })

    it('should handle zero maxLength', () => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        '<input class="govuk-input" id="maxLength" name="maxLength" type="number" value="0">' +
        '<input class="govuk-input" id="rows" name="rows" type="number" value="5">'
      const res = new MultilineTextFieldDomElements()
      expect(res.values.maxLength).toBe(0)
    })
  })

  describe('MultilineTextFieldEventListeners', () => {
    const multilineTextFieldHTML = `
      <input class="govuk-input" id="maxLength" name="maxLength" type="number" value="200">
      <input class="govuk-input" id="rows" name="rows" type="number" value="8">
    `

    beforeEach(() => {
      document.body.innerHTML =
        questionDetailsLeftPanelHTML +
        questionDetailsPreviewHTML +
        multilineTextFieldHTML
    })

    it('should create event listeners', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      expect(listeners).toBeDefined()
      expect(listeners._question).toBe(question)
      expect(listeners.baseElements).toBe(elements)
    })

    it('should update question maxLength on input change', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const maxLengthInput = /** @type {HTMLInputElement} */ (
        document.getElementById('maxLength')
      )
      expect(maxLengthInput).toBeDefined()

      // Simulate input change
      maxLengthInput.value = '300'
      const event = new InputEvent('input', { bubbles: true })
      maxLengthInput.dispatchEvent(event)

      expect(question.maxLength).toBe(300)
    })

    it('should update question rows on input change', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const rowsInput = /** @type {HTMLInputElement} */ (
        document.getElementById('rows')
      )
      expect(rowsInput).toBeDefined()

      // Simulate input change
      rowsInput.value = '12'
      const event = new InputEvent('input', { bubbles: true })
      rowsInput.dispatchEvent(event)

      expect(question.rows).toBe(12)
    })

    it('should handle NaN maxLength values by setting to 0', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const maxLengthInput = /** @type {HTMLInputElement} */ (
        document.getElementById('maxLength')
      )
      maxLengthInput.value = 'invalid'
      const event = new InputEvent('input', { bubbles: true })
      maxLengthInput.dispatchEvent(event)

      expect(question.maxLength).toBe(0)
    })

    it('should handle NaN rows values by setting to 5', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const rowsInput = /** @type {HTMLInputElement} */ (
        document.getElementById('rows')
      )
      rowsInput.value = 'invalid'
      const event = new InputEvent('input', { bubbles: true })
      rowsInput.dispatchEvent(event)

      expect(question.rows).toBe(5)
    })

    it('should include parent class listeners', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      // @ts-expect-error testing protected method
      const allListeners = listeners._getListeners()

      // Should have parent listeners plus maxLength and rows listeners
      expect(allListeners.length).toBeGreaterThan(2)
    })

    it('should handle multiple input changes', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const maxLengthInput = /** @type {HTMLInputElement} */ (
        document.getElementById('maxLength')
      )
      const rowsInput = /** @type {HTMLInputElement} */ (
        document.getElementById('rows')
      )

      // First change
      maxLengthInput.value = '100'
      maxLengthInput.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(question.maxLength).toBe(100)

      // Second change
      rowsInput.value = '6'
      rowsInput.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(question.rows).toBe(6)

      // Third change
      maxLengthInput.value = '500'
      maxLengthInput.dispatchEvent(new InputEvent('input', { bubbles: true }))
      expect(question.maxLength).toBe(500)
    })

    it('should handle zero values', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const maxLengthInput = /** @type {HTMLInputElement} */ (
        document.getElementById('maxLength')
      )
      maxLengthInput.value = '0'
      maxLengthInput.dispatchEvent(new InputEvent('input', { bubbles: true }))

      expect(question.maxLength).toBe(0)
    })

    it('should handle negative values', () => {
      const elements = new MultilineTextFieldDomElements()
      const renderer = new NunjucksRenderer(elements)
      const question = new LongAnswerQuestion(elements, renderer)
      const listeners = new MultilineTextFieldEventListeners(question, elements)

      listeners.setupListeners()

      const rowsInput = /** @type {HTMLInputElement} */ (
        document.getElementById('rows')
      )
      rowsInput.value = '-5'
      rowsInput.dispatchEvent(new InputEvent('input', { bubbles: true }))

      // Negative values are parsed but should be handled by validation elsewhere
      expect(question.rows).toBe(-5)
    })
  })
})
