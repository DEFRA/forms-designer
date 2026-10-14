import {
  locationQuestionLeftPanelHTML,
  locationQuestionPreviewHTML
} from '~/src/javascripts/preview/__stubs__/location-question.js'
import {
  LocationQuestionDomElements,
  LocationQuestionEventListeners
} from '~/src/javascripts/preview/location-question-base.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('location-question-base', () => {
  const mockEvent = /** @type {Event} */ ({})

  describe('LocationQuestionDomElements', () => {
    it('should find location-specific elements', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const elements = new LocationQuestionDomElements()

      expect(elements.question).toBeDefined()
      expect(elements.hintText).toBeDefined()
      expect(elements.optional).toBeDefined()
      expect(elements.shortDesc).toBeDefined()
      expect(elements.instructionText).toBeDefined()
      expect(elements.giveInstructions).toBeDefined()
      expect(elements.preview).toBeDefined()
    })

    it('should return values with instruction text when checkbox is checked', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const elements = new LocationQuestionDomElements()
      const giveInstructions = elements.giveInstructions
      const instructionText = elements.instructionText

      if (!giveInstructions || !instructionText) {
        throw new Error('test failed: elements not found')
      }

      giveInstructions.checked = true
      instructionText.value = 'Test instruction'

      const values = elements.values

      expect(values.question).toBe('Which quest would you like to pick?')
      expect(values.hintText).toBe('Choose one adventure that best suits you.')
      expect(values.instructionText).toBe('Test instruction')
    })

    it('should return empty instruction text when checkbox is unchecked', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const elements = new LocationQuestionDomElements()
      const giveInstructions = elements.giveInstructions
      const instructionText = elements.instructionText

      if (!giveInstructions || !instructionText) {
        throw new Error('test failed: elements not found')
      }

      giveInstructions.checked = false
      instructionText.value = 'Test instruction'

      const values = elements.values

      expect(values.instructionText).toBe('')
    })

    it('should handle missing elements gracefully', () => {
      document.body.innerHTML = '<div></div>'

      const elements = new LocationQuestionDomElements()

      expect(elements.instructionText).toBeNull()
      expect(elements.giveInstructions).toBeNull()

      const values = elements.values

      expect(values.instructionText).toBe('')
    })

    it('should handle empty instruction text value', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const elements = new LocationQuestionDomElements()
      const giveInstructions = elements.giveInstructions
      const instructionText = elements.instructionText

      if (!giveInstructions || !instructionText) {
        throw new Error('test failed: elements not found')
      }

      giveInstructions.checked = true
      instructionText.value = ''

      const values = elements.values

      expect(values.instructionText).toBe('')
    })
  })

  describe('LocationQuestionEventListeners', () => {
    it('should create event listeners for instruction text fields', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const mockQuestion = {
        instructionText: 'Initial text',
        highlight: null
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      // @ts-expect-error accessing a protected method to test implementation
      const listeners = eventListeners.listeners

      expect(listeners.length).toBeGreaterThan(0)
      expect(
        listeners.some(
          (listener) =>
            listener[0] === elements.instructionText && listener[2] === 'input'
        )
      ).toBe(true)
      expect(
        listeners.some(
          (listener) =>
            listener[0] === elements.giveInstructions &&
            listener[2] === 'change'
        )
      ).toBe(true)
    })

    it('should update instruction text when textarea input event fires', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const mockQuestion = {
        instructionText: '',
        highlight: null
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      // @ts-expect-error accessing a protected method to test implementation
      const listeners = eventListeners.listeners
      const instructionTextListener = listeners.find(
        (listener) =>
          listener[0] === elements.instructionText && listener[2] === 'input'
      )

      const giveInstructions = elements.giveInstructions
      const instructionText = elements.instructionText

      if (!instructionTextListener || !giveInstructions || !instructionText) {
        throw new Error('test failed: elements or listener not found')
      }

      giveInstructions.checked = true
      instructionText.value = 'New instruction'
      const [, callback] = instructionTextListener
      callback(instructionText, mockEvent)

      expect(mockQuestion.instructionText).toBe('New instruction')
    })

    it('should clear instruction text when checkbox unchecked', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const mockQuestion = {
        instructionText: 'Initial text',
        highlight: null
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      // @ts-expect-error accessing a protected method to test implementation
      const listeners = eventListeners.listeners
      const checkboxListener = listeners.find(
        (listener) =>
          listener[0] === elements.giveInstructions && listener[2] === 'change'
      )

      const giveInstructions = elements.giveInstructions
      const instructionText = elements.instructionText

      if (!checkboxListener || !giveInstructions || !instructionText) {
        throw new Error('test failed: elements or listener not found')
      }

      giveInstructions.checked = false
      instructionText.value = 'Some text'
      const [, callback] = checkboxListener
      callback(giveInstructions, mockEvent)

      expect(mockQuestion.instructionText).toBe('')
    })

    it('should create highlight listeners for instruction text', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const mockQuestion = {
        instructionText: '',
        highlight: null
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      const highlightListeners = eventListeners.highlightListeners

      expect(highlightListeners.length).toBeGreaterThan(0)
      expect(
        highlightListeners.some(
          (listener) =>
            listener[0] === elements.instructionText && listener[2] === 'focus'
        )
      ).toBe(true)
      expect(
        highlightListeners.some(
          (listener) =>
            listener[0] === elements.instructionText && listener[2] === 'blur'
        )
      ).toBe(true)
    })

    it('should set highlight on instruction text focus', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const mockQuestion = {
        instructionText: '',
        highlight: null
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      const highlightListeners = eventListeners.highlightListeners
      const focusListener = highlightListeners.find(
        (listener) =>
          listener[0] === elements.instructionText && listener[2] === 'focus'
      )
      const instructionText = elements.instructionText

      if (!focusListener || !instructionText) {
        throw new Error('test failed: listener or element not found')
      }

      const [, callback] = focusListener
      callback(instructionText, mockEvent)

      expect(mockQuestion.highlight).toBe('instructionText')
    })

    it('should clear highlight on instruction text blur', () => {
      document.body.innerHTML =
        locationQuestionLeftPanelHTML + locationQuestionPreviewHTML

      const mockQuestion = {
        instructionText: '',
        highlight: 'instructionText'
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      const highlightListeners = eventListeners.highlightListeners
      const blurListener = highlightListeners.find(
        (listener) =>
          listener[0] === elements.instructionText && listener[2] === 'blur'
      )
      const instructionText = elements.instructionText

      if (!blurListener || !instructionText) {
        throw new Error('test failed: listener or element not found')
      }

      const [, callback] = blurListener
      callback(instructionText, mockEvent)

      expect(mockQuestion.highlight).toBeNull()
    })

    it('should return base listeners when instructionText element is missing', () => {
      document.body.innerHTML = `
        <textarea id="question">Question</textarea>
        <textarea id="hintText">Hint</textarea>
        <input type="checkbox" id="optional" />
        <textarea id="shortDesc"></textarea>
      `

      const mockQuestion = {
        instructionText: '',
        highlight: null
      }
      const elements = new LocationQuestionDomElements()
      const eventListeners = new LocationQuestionEventListeners(
        mockQuestion,
        elements
      )

      const highlightListeners = eventListeners.highlightListeners

      expect(
        highlightListeners.some(
          (listener) =>
            listener[0] === elements.instructionText && listener[2] === 'focus'
        )
      ).toBe(false)
    })
  })
})
