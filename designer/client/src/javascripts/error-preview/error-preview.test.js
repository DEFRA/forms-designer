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
      document.body.innerHTML = shortDescInputHTML + panelHTML
      const advancedFields = fieldMappings[ComponentType.TextField]
      const res = new ErrorPreviewDomElements(advancedFields)
      expect(res).toBeDefined()
      const targets = /** @type {HTMLInputElement[]} */ (
        Array.from(document.querySelectorAll('.error-preview-shortDescription'))
      )
      const sourceElem = document.createElement('input')
      sourceElem.value = 'sourcetext'
      res.updateText(sourceElem, targets, '[placeholder]')
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
        baseElements
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
        baseElements
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
        baseElements
      )

      // @ts-expect-error - accessing protected property for testing
      const listenersList = listeners.listeners

      // Confirm we have listeners for both advanced fields and shortDesc
      expect(listenersList.length).toBeGreaterThan(0)

      // @ts-expect-error - accessing protected property for testing
      const highlightListeners = listeners.highlightListeners
      expect(highlightListeners.length).toBeGreaterThan(0)
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

      const errorPreview = new ErrorPreview(baseElements)

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
