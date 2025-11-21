import { ComponentType } from '@defra/forms-model'

import {
  panelHTML,
  shortDescInputHTML
} from '~/src/javascripts/error-preview/__stubs__/error-preview'
import {
  ErrorPreview,
  ErrorPreviewDomElements,
  ErrorPreviewEventListeners
} from '~/src/javascripts/error-preview/error-preview'
import { fieldMappings } from '~/src/javascripts/error-preview/field-mappings'
import { setupFileTypeListeners } from '~/src/javascripts/error-preview/file-upload/file-type-handler'
import { setupFileUploadValidation } from '~/src/javascripts/error-preview/file-upload/validations'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')
jest.mock('~/src/javascripts/error-preview/file-upload/file-type-handler')
jest.mock('~/src/javascripts/error-preview/file-upload/validations')

describe('error-preview', () => {
  describe('ErrorPreviewDomElements', () => {
    it('should instanciate with no advanced fields', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)
      expect(res).toBeDefined()
      expect(res.advancedFields).toBeDefined()
      expect(res.advancedFields).toEqual([])
      expect(res.shortDesc).toBeDefined()
      expect(res.shortDescTargets).toBeDefined()
    })

    it('should instanciate with some advanced fields', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      expect(res.advancedFields).toBeDefined()
      expect(res.advancedFields).toHaveLength(2)
      expect(res.shortDesc).toBeDefined()
      expect(res.shortDescTargets).toBeDefined()
    })

    it('should add and remove highlights', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const elemsToHighlight = /** @type {HTMLElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      res.addHighlights(elemsToHighlight)
      expect(elemsToHighlight[0].classList).toContain('highlight')
      expect(elemsToHighlight[elemsToHighlight.length - 1].classList).toContain(
        'highlight'
      )
      res.removeHighlights(elemsToHighlight)
      expect(elemsToHighlight[0].classList).not.toContain('highlight')
      expect(
        elemsToHighlight[elemsToHighlight.length - 1].classList
      ).not.toContain('highlight')
    })

    it('should updateText if source has a non-empty text value', () => {
      // Create custom HTML without template functions
      document.body.innerHTML = `
        <input id="shortDescription" />
        <span class="error-preview-shortDescription"></span>
      `
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const targets = /** @type {HTMLInputElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      const sourceElem = document.createElement('input')
      sourceElem.value = 'sourcetext'
      res.updateText(sourceElem, targets, '[placeholder]')
      // Text should remain as provided (no auto-capitalization)
      expect(targets[0].textContent).toBe('sourcetext')
      expect(targets[targets.length - 1].textContent).toBe('sourcetext')
    })

    it('should updateText with placeholder if source has an empty text value', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const targets = /** @type {HTMLInputElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      const sourceElem = document.createElement('input')
      sourceElem.value = ''
      res.updateText(sourceElem, targets, '[placeholder]')
      expect(targets[0].textContent).toBe('[placeholder]')
      expect(targets[targets.length - 1].textContent).toBe('[placeholder]')
    })

    it('should not update elements with data-fixed="true"', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      // Create a fixed element (like location field base error)
      const fixedElem = document.createElement('span')
      fixedElem.classList.add('error-preview-shortDescription')
      fixedElem.dataset.fixed = 'true'
      fixedElem.textContent = 'easting and northing'

      // Create a normal element
      const normalElem = document.createElement('span')
      normalElem.classList.add('error-preview-shortDescription')
      normalElem.textContent = '[Short description]'

      const sourceElem = document.createElement('input')
      sourceElem.value = 'my custom text'

      res.updateText(sourceElem, [fixedElem, normalElem], '[placeholder]')

      // Fixed element should not change
      expect(fixedElem.textContent).toBe('easting and northing')
      // Normal element should update (no auto-capitalization)
      expect(normalElem.textContent).toBe('my custom text')
    })

    it('should apply lowerFirst template function', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      const elemWithFunc = document.createElement('input')
      elemWithFunc.dataset.templatefunc = 'lowerFirst'

      const elemWithoutFunc = document.createElement('input')

      const result1 = res.applyTemplateFunction(elemWithFunc, 'TestValue')
      expect(result1).toBe('testValue')

      const result2 = res.applyTemplateFunction(elemWithFunc, '[TestValue]')
      expect(result2).toBe('[testValue]')

      const result3 = res.applyTemplateFunction(elemWithoutFunc, 'TestValue')
      expect(result3).toBe('TestValue')
    })

    it('should handle lowerFirstEnhanced correctly', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      expect(res.lowerFirstEnhanced('TestValue')).toBe('testValue')

      expect(res.lowerFirstEnhanced('[TestValue]')).toBe('[testValue]')

      expect(res.lowerFirstEnhanced('T')).toBe('t')

      expect(res.lowerFirstEnhanced('[')).toBe('[')

      // Should preserve "OS" as it's an acronym
      expect(res.lowerFirstEnhanced('OS grid reference')).toBe(
        'OS grid reference'
      )

      // Should handle lowercase "os grid reference" and capitalize "OS"
      expect(res.lowerFirstEnhanced('os grid reference')).toBe(
        'OS grid reference'
      )

      // Should preserve "National Grid" with capital N
      expect(res.lowerFirstEnhanced('National Grid reference')).toBe(
        'National Grid reference'
      )

      // Should handle lowercase "national grid reference" and capitalize "National Grid"
      expect(res.lowerFirstEnhanced('national grid reference')).toBe(
        'National Grid reference'
      )
    })

    it('should apply capitalise template function', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      const elemWithFunc = document.createElement('input')
      elemWithFunc.dataset.templatefunc = 'capitalise'

      const elemWithoutFunc = document.createElement('input')

      const result1 = res.applyTemplateFunction(elemWithFunc, 'testValue')
      expect(result1).toBe('Testvalue')

      const result2 = res.applyTemplateFunction(elemWithFunc, 'TEST VALUE')
      expect(result2).toBe('Test value')

      const result3 = res.applyTemplateFunction(elemWithFunc, 'enter age')
      expect(result3).toBe('Enter age')

      const result4 = res.applyTemplateFunction(elemWithoutFunc, 'TestValue')
      expect(result4).toBe('TestValue')
    })

    it('should not auto-capitalise shortDescription elements without explicit template function', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      const shortDescElem = document.createElement('span')
      shortDescElem.classList.add('error-preview-shortDescription')

      const regularElem = document.createElement('span')

      const sourceElem = document.createElement('input')
      sourceElem.value = 'enter age'

      res.updateText(
        sourceElem,
        [/** @type {HTMLInputElement} */ (shortDescElem)],
        '[placeholder]'
      )
      res.updateText(
        sourceElem,
        [/** @type {HTMLInputElement} */ (regularElem)],
        '[placeholder]'
      )

      // Both should remain lowercase (no auto-capitalization)
      expect(shortDescElem.textContent).toBe('enter age')

      expect(regularElem.textContent).toBe('enter age')
    })

    it('should not override template function with default capitalize behavior', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      const elemWithBoth = document.createElement('span')
      elemWithBoth.classList.add('error-preview-shortDescription')
      elemWithBoth.dataset.templatefunc = 'lowerFirst'

      const sourceElem = document.createElement('input')
      sourceElem.value = 'Enter Age'

      res.updateText(
        sourceElem,
        [/** @type {HTMLInputElement} */ (elemWithBoth)],
        '[placeholder]'
      )

      expect(elemWithBoth.textContent).toBe('enter Age')
    })

    it('should not auto-capitalize placeholder text for shortDescription elements', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      const shortDescElem = document.createElement('span')
      shortDescElem.classList.add('error-preview-shortDescription')

      const sourceElem = document.createElement('input')
      sourceElem.value = ''

      res.updateText(
        sourceElem,
        [/** @type {HTMLInputElement} */ (shortDescElem)],
        'default placeholder'
      )

      // Placeholder should remain lowercase (no auto-capitalization)
      expect(shortDescElem.textContent).toBe('default placeholder')
    })

    it('should handle unknown template functions', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const res = new ErrorPreviewDomElements(undefined)

      const elemWithUnknownFunc = document.createElement('input')
      elemWithUnknownFunc.dataset.templatefunc = 'unknownFunction'

      const result = res.applyTemplateFunction(elemWithUnknownFunc, 'TestValue')

      expect(result).toBe('TestValue')
    })
  })

  describe('ErrorPreviewEventListeners', () => {
    it('should add event listener to element', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )
      const mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({
          _updateTextFieldErrorMessages: jest.fn()
        })
      )
      const listeners = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )

      const mockElement = document.createElement('input')
      const addEventListenerSpy = jest.spyOn(mockElement, 'addEventListener')
      const mockCallback = jest.fn()

      // @ts-expect-error - accessing protected method for testing
      listeners.inputEventListener(mockElement, mockCallback, 'input')

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'input',
        expect.any(Function)
      )
    })

    it('should determine correct display value for error messages', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )
      const mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({
          _updateTextFieldErrorMessages: jest.fn()
        })
      )
      const listeners = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )

      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(true, false, false, true, false)
      ).toBe('')
      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(false, true, false, false, true)
      ).toBe('')
      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(false, false, true, true, true)
      ).toBe('')
      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(true, false, false, false, false)
      ).toBe('none')
      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(false, true, false, false, false)
      ).toBe('none')
      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(false, false, true, true, false)
      ).toBe('none')
      expect(
        // @ts-expect-error - accessing protected method for testing
        listeners._getMessageDisplayValue(false, false, true, false, true)
      ).toBe('none')
    })

    it('should have expected listeners', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )
      const mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({
          _updateTextFieldErrorMessages: jest.fn()
        })
      )
      const listeners = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )

      // @ts-expect-error - accessing protected property for testing
      const listenersList = listeners.listeners

      // Confirm we have listeners for both advanced fields and shortDesc
      expect(listenersList.length).toBeGreaterThan(0)

      // @ts-expect-error - accessing protected property for testing
      const highlightListeners = listeners.highlightListeners
      expect(highlightListeners.length).toBeGreaterThan(0)
    })

    it('should handle input event callbacks correctly', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )
      const mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({
          _updateTextFieldErrorMessages: jest.fn()
        })
      )
      const listeners = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )
      const mockElement = document.createElement('input')
      const mockCallback = jest.fn()

      let eventHandler
      // Cast the mock function to match addEventListener's expected signature
      mockElement.addEventListener = /** @type {any} */ (
        jest.fn((type, handler) => {
          eventHandler = handler
        })
      )

      // @ts-expect-error - accessing protected method for testing
      listeners.inputEventListener(mockElement, mockCallback, 'input')

      const mockEvent = { target: mockElement }
      // @ts-expect-error - eventHandler is definitely set by our mock implementation!
      eventHandler(mockEvent)

      expect(mockCallback).toHaveBeenCalled()
    })

    it('should call highlight functions when adding event listeners', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )

      const addSpy = jest.spyOn(baseElements, 'addHighlights')
      const removeSpy = jest.spyOn(baseElements, 'removeHighlights')

      const mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({ _updateTextFieldErrorMessages: jest.fn() })
      )
      const listeners = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )

      // @ts-expect-error - accessing protected property for testing
      const highlightListeners = listeners.highlightListeners

      const shortDescFocusCallback = highlightListeners[0][1]
      shortDescFocusCallback(
        document.createElement('input'),
        new Event('focus')
      )

      const shortDescBlurCallback = highlightListeners[1][1]
      shortDescBlurCallback(document.createElement('input'), new Event('blur'))

      expect(addSpy).toHaveBeenCalled()
      expect(removeSpy).toHaveBeenCalled()
    })

    it('should always return [short description] placeholder for all component types', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(undefined)
      const mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({ _updateTextFieldErrorMessages: jest.fn() })
      )

      // Test EastingNorthingField
      const eastingListener = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        ComponentType.EastingNorthingField
      )
      // @ts-expect-error - accessing protected method for testing
      expect(eastingListener._getDefaultPlaceholder()).toBe(
        '[short description]'
      )

      // Test LatLongField
      const latLongListener = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        ComponentType.LatLongField
      )
      // @ts-expect-error - accessing protected method for testing
      expect(latLongListener._getDefaultPlaceholder()).toBe(
        '[short description]'
      )

      // Test OsGridRefField
      const osGridListener = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        ComponentType.OsGridRefField
      )
      // @ts-expect-error - accessing protected method for testing
      expect(osGridListener._getDefaultPlaceholder()).toBe(
        '[short description]'
      )

      // Test NationalGridFieldNumberField
      const nationalGridListener = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        ComponentType.NationalGridFieldNumberField
      )
      // @ts-expect-error - accessing protected method for testing
      expect(nationalGridListener._getDefaultPlaceholder()).toBe(
        '[short description]'
      )

      // Test other component types
      const textFieldListener = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        ComponentType.TextField
      )
      // @ts-expect-error - accessing protected method for testing
      expect(textFieldListener._getDefaultPlaceholder()).toBe(
        '[short description]'
      )

      // Test undefined component type
      const undefinedListener = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )
      // @ts-expect-error - accessing protected method for testing
      expect(undefinedListener._getDefaultPlaceholder()).toBe(
        '[short description]'
      )
    })
  })

  describe('ErrorPreviewEventListeners complex functions', () => {
    let baseElements
    /** @type {ErrorPreviewEventListeners} */
    let listeners
    let mockErrorPreview

    beforeEach(() => {
      // Simplified beforeEach, specific HTML will be set in tests
      baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )
      mockErrorPreview = /** @type {ErrorPreview} */ (
        /** @type {unknown} */ ({ _updateTextFieldErrorMessages: jest.fn() })
      )
      listeners = new ErrorPreviewEventListeners(
        mockErrorPreview,
        baseElements,
        undefined
      )
    })

    it('should update min/max placeholders', () => {
      document.body.innerHTML =
        shortDescInputHTML + // Assuming this provides a basic structure
        panelHTML +
        '<input id="minLength" />' +
        '<input id="maxLength" />' +
        '<span class="error-preview-min"></span>' +
        '<span class="error-preview-max"></span>'
      const minInput = /** @type {HTMLInputElement | null} */ (
        document.getElementById('minLength')
      )
      const maxInput = /** @type {HTMLInputElement | null} */ (
        document.getElementById('maxLength')
      )
      if (minInput) minInput.value = '5'
      if (maxInput) maxInput.value = '10'

      // @ts-expect-error - accessing protected method for testing
      const result = listeners._updateMinMaxPlaceholders()

      expect(result.minValue).toBe('5')
      expect(result.maxValue).toBe('10')

      const minSpans = document.querySelectorAll('.error-preview-min')
      const maxSpans = document.querySelectorAll('.error-preview-max')

      minSpans.forEach((span) => {
        expect(span.textContent).toBe('5')
      })

      maxSpans.forEach((span) => {
        expect(span.textContent).toBe('10')
      })
    })

    it('should update combined error messages when last node is text', () => {
      document.body.innerHTML = `
        <div class="govuk-error-message">
          Original prefix <span class="error-preview-shortDescription">Field</span> must be between X and Y characters
        </div>
      `
      const errorMsg = document.querySelector('.govuk-error-message')

      // @ts-expect-error - accessing protected method for testing
      listeners._updateCombinedErrorMessages('5', '10')

      expect(errorMsg?.textContent).toContain(
        ' must be between 5 and 10 characters'
      )
      expect(errorMsg?.textContent).not.toContain('between X and Y characters')
    })

    it('should update combined error messages targeting remainingHTML when shortDescNode exists but last node is not text', () => {
      document.body.innerHTML =
        '<div class="govuk-error-message">Prefix text <span class="error-preview-shortDescription">My Field</span> must be between X and Y characters <span>old suffix</span></div>'
      const errorMsg = document.querySelector('.govuk-error-message')

      // @ts-expect-error - accessing protected method for testing
      listeners._updateCombinedErrorMessages('7', '12')

      expect(errorMsg?.innerHTML).toBe(
        'Prefix text <span class="error-preview-shortDescription">My Field</span> must be between 7 and 12 characters'
      )
      expect(errorMsg?.innerHTML).not.toContain('<span>old suffix</span>')
      expect(errorMsg?.innerHTML).not.toContain('between X and Y characters')
    })

    it('should append to combined error messages when shortDescNode does not exist and last node is not text', () => {
      document.body.innerHTML =
        '<div class="govuk-error-message">Message will be between X and Y characters and has <b>other elements</b></div>'
      const errorMsg = document.querySelector('.govuk-error-message')

      // @ts-expect-error - accessing protected method for testing
      listeners._updateCombinedErrorMessages('3', '8')

      expect(errorMsg?.innerHTML).toContain(
        'Message will be between X and Y characters and has <b>other elements</b>'
      )
      expect(errorMsg?.innerHTML).toContain(
        'must be between 3 and 8 characters'
      )
      expect(errorMsg?.innerHTML).toContain(
        '<b>other elements</b> must be between 3 and 8 characters'
      )
    })

    it('should update error visibility based on field values', () => {
      document.body.innerHTML = '<div class="govuk-error-message">Error</div>'
      const errorMsgs = document.querySelectorAll('.govuk-error-message')
      Array.from(errorMsgs).forEach((msg) => {
        Object.defineProperty(msg, 'style', {
          value: {
            display: ''
          },
          writable: true
        })
      })

      jest
        .spyOn(/** @type {any} */ (listeners), '_getMessageDisplayValue')
        .mockReturnValue('none')

      // @ts-expect-error - accessing protected method for testing
      listeners._updateErrorVisibilityForTextFields('5', '10')

      // @ts-expect-error - accessing private method for testing
      expect(listeners._getMessageDisplayValue).toHaveBeenCalled()
    })

    it('should update text field error messages', () => {
      document.body.innerHTML = `
        <input id="minLength" />
        <input id="maxLength" />
        <div class="govuk-error-message"></div>
      `
      jest
        .spyOn(/** @type {any} */ (listeners), '_updateMinMaxPlaceholders')
        .mockReturnValue({
          minValue: '5',
          maxValue: '10'
        })
      jest
        .spyOn(/** @type {any} */ (listeners), '_updateCombinedErrorMessages')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(() => {})
      jest
        .spyOn(
          /** @type {any} */ (listeners),
          '_updateErrorVisibilityForTextFields'
        )
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(() => {})

      // @ts-expect-error - accessing protected method for testing
      listeners._updateTextFieldErrorMessages()

      // @ts-expect-error - accessing private method for testing
      expect(listeners._updateMinMaxPlaceholders).toHaveBeenCalled()
      // @ts-expect-error - accessing private method for testing
      expect(listeners._updateCombinedErrorMessages).toHaveBeenCalledWith(
        '5',
        '10'
      )
      expect(
        // @ts-expect-error - accessing private method for testing
        listeners._updateErrorVisibilityForTextFields
      ).toHaveBeenCalledWith('5', '10')
    })
  })

  describe('ErrorPreview', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should create an instance with event listeners', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const baseElements = new ErrorPreviewDomElements(
        fieldMappings[ComponentType.TextField]
      )

      const errorPreview = new ErrorPreview(baseElements, undefined)

      expect(errorPreview).toBeDefined()
      // @ts-expect-error - accessing protected property for testing
      expect(errorPreview._htmlElements).toBe(baseElements)
      // @ts-expect-error - accessing protected property for testing
      expect(errorPreview._listeners).toBeDefined()
    })

    it('should set up preview for a component type', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML

      const errorPreview = ErrorPreview.setupPreview(ComponentType.TextField)

      expect(errorPreview).toBeDefined()
      // @ts-expect-error - accessing protected property for testing
      expect(errorPreview._htmlElements).toBeDefined()
    })

    it('should set up file upload preview for file upload component', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML

      ErrorPreview.setupPreview(ComponentType.FileUploadField)

      expect(setupFileTypeListeners).toHaveBeenCalled()
    })

    it('should set up file upload validation', () => {
      document.body.innerHTML = shortDescInputHTML + panelHTML

      ErrorPreview.setupFileUploadValidation()

      expect(setupFileUploadValidation).toHaveBeenCalled()
    })
  })
})
