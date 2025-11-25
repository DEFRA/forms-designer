import { SummaryPageController } from '@defra/forms-model'
import {
  PageRendererStub,
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { summaryPageHTML } from '~/src/javascripts/preview/__stubs__/page.js'
import { questionDetailsPreviewHTML } from '~/src/javascripts/preview/__stubs__/question.js'
import { PageListenerBase } from '~/src/javascripts/preview/page-controller/page-listener.js'
import {
  SummaryPagePreviewDomElements,
  SummaryPagePreviewListeners
} from '~/src/javascripts/preview/page-controller/summary-page-controller.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('summary page controller', () => {
  describe('SummaryPagePreviewDomElements', () => {
    it('should instantiate given no elements', () => {
      document.body.innerHTML = summaryPageHTML() + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.declarationText).toBe('')
      expect(pagePreviewElements.declaration).toBe(false)
    })

    it('should instantiate given elements true but empty text', () => {
      document.body.innerHTML =
        summaryPageHTML(true) + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.declaration).toBe(true)
      expect(pagePreviewElements.declarationText).toBe('')
    })

    it('should instantiate given elements true but with text', () => {
      document.body.innerHTML =
        summaryPageHTML(true, 'Declaration text') + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.declaration).toBe(true)
      expect(pagePreviewElements.declarationText).toBe('Declaration text')
    })

    it('should give default values if HTML is missing', () => {
      document.body.innerHTML = '<div></div>'
      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.declarationText).toBe('')
      expect(pagePreviewElements.declaration).toBe(false)
    })

    it('should return showConfirmationEmail as true when disableConfirmationEmail checkbox is unchecked', () => {
      document.body.innerHTML =
        summaryPageHTML(false, '', false) + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(true)
    })

    it('should return showConfirmationEmail as false when disableConfirmationEmail checkbox is checked', () => {
      document.body.innerHTML =
        summaryPageHTML(false, '', true) + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(false)
    })

    it('should return showConfirmationEmail as true when fallback value is "true"', () => {
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input type="hidden" id="showConfirmationEmailFallback" value="true">
        </form>
        ${questionDetailsPreviewHTML}
      `

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: true,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(true)
    })

    it('should return showConfirmationEmail as false when fallback value is "false"', () => {
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input type="hidden" id="showConfirmationEmailFallback" value="false">
        </form>
        ${questionDetailsPreviewHTML}
      `

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(false)
    })

    it('should prefer radio button value over fallback when both exist', () => {
      document.body.innerHTML =
        summaryPageHTML(false, '', false, 'false') + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      // Radio "No" is checked (showConfirmationEmail should be true)
      expect(pagePreviewElements.showConfirmationEmail).toBe(true)
    })

    it('should default to false when no radio buttons or fallback are present', () => {
      document.body.innerHTML = `
        <form id="checkAnswersForm">
        </form>
        ${questionDetailsPreviewHTML}
      `

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(false)
    })

    it('should return guidance text from declaration text', () => {
      document.body.innerHTML =
        summaryPageHTML(true, 'My declaration text') +
        questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.guidance).toBe('My declaration text')
    })

    it('should return showConfirmationEmail when checkbox is unchecked', () => {
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input class="govuk-checkboxes__input" id="disableConfirmationEmail" name="disableConfirmationEmail" type="checkbox" value="true">
        </form>
        ${questionDetailsPreviewHTML}
      `

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(true)
    })

    it('should return false when checkbox is checked', () => {
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input class="govuk-checkboxes__input" id="disableConfirmationEmail" name="disableConfirmationEmail" type="checkbox" value="true" checked>
        </form>
        ${questionDetailsPreviewHTML}
      `

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: true,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      // Checkbox is checked, so showConfirmationEmail should be false
      expect(pagePreviewElements.showConfirmationEmail).toBe(false)
    })

    it('should return true when checkbox exists but is not checked', () => {
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input class="govuk-checkboxes__input" id="disableConfirmationEmail" name="disableConfirmationEmail" type="checkbox" value="true">
        </form>
        ${questionDetailsPreviewHTML}
      `

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      // Checkbox exists but is not checked, so showConfirmationEmail should be true
      expect(pagePreviewElements.showConfirmationEmail).toBe(true)
    })

    it('should handle fallback value with various string representations', () => {
      // Test with string "true"
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input type="hidden" id="showConfirmationEmailFallback" value="true">
        </form>
        ${questionDetailsPreviewHTML}
      `
      let pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: true,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(true)

      // Test with empty string
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input type="hidden" id="showConfirmationEmailFallback" value="">
        </form>
        ${questionDetailsPreviewHTML}
      `
      pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(false)

      // Test with arbitrary string
      document.body.innerHTML = `
        <form id="checkAnswersForm">
          <input type="hidden" id="showConfirmationEmailFallback" value="yes">
        </form>
        ${questionDetailsPreviewHTML}
      `
      pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.showConfirmationEmail).toBe(false)
    })

    it('should store and return isConfirmationEmailSettingsPanel as false', () => {
      document.body.innerHTML = summaryPageHTML() + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      expect(pagePreviewElements.isConfirmationEmailSettingsPanel).toBe(false)
    })

    it('should store and return isConfirmationEmailSettingsPanel as true', () => {
      document.body.innerHTML = summaryPageHTML() + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: false,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: true
      })
      expect(pagePreviewElements.isConfirmationEmailSettingsPanel).toBe(true)
    })
  })
  describe('SummaryPreviewListeners', () => {
    const components = [
      buildTextFieldComponent(),
      buildTextFieldComponent({
        id: '756286fc-ee67-470c-b62c-d4638eb8df35',
        name: 'abcadf',
        title: 'question 2'
      }),
      buildMarkdownComponent()
    ]
    const page = buildQuestionPage({
      title: 'Page title',
      components
    })
    const definition = buildDefinition({
      pages: [page]
    })

    /**
     * @type {SummaryPagePreviewDomElements}
     */
    let pagePreviewElements

    /**
     * @type {SummaryPageController}
     */
    let pageController
    /**
     * @type {SummaryPagePreviewListeners}
     */
    let pageListeners

    const pageRendererCb = jest.fn()
    const renderer = new PageRendererStub(pageRendererCb)
    const inputEvent = new InputEvent('input', { bubbles: true })
    const changeEvent = new InputEvent('change', { bubbles: true })

    beforeEach(() => {
      jest.clearAllMocks()
      document.body.innerHTML = summaryPageHTML() + questionDetailsPreviewHTML
      pagePreviewElements = new SummaryPagePreviewDomElements({
        showConfirmationEmail: true,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: false
      })
      pageController = new SummaryPageController(
        pagePreviewElements,
        definition,
        renderer
      )
      pageListeners = new SummaryPagePreviewListeners(
        pageController,
        pagePreviewElements
      )
      pageListeners.initListeners()
    })

    afterEach(() => {
      pageListeners.clearListeners()
    })

    it('should instantiate', () => {
      expect(pageListeners).toBeInstanceOf(PageListenerBase)
    })

    it('should highlight declaration', () => {
      if (
        !pagePreviewElements.declarationTextElement ||
        !pagePreviewElements.needDeclarationYes ||
        !pagePreviewElements.needDeclarationNo
      ) {
        throw new Error('not found')
      }
      pagePreviewElements.needDeclarationYes.checked = true
      pagePreviewElements.needDeclarationYes.dispatchEvent(changeEvent)

      pagePreviewElements.declarationTextElement.focus()
      expect(pageController.guidance.classes).toBe('highlight')
      pagePreviewElements.declarationTextElement.value = 'Declaration text'
      pagePreviewElements.declarationTextElement.dispatchEvent(inputEvent)
      expect(pageController.guidanceText).toBe('Declaration text')
      pagePreviewElements.declarationTextElement.blur()
      expect(pageController.guidance.classes).toBe('')
      pagePreviewElements.needDeclarationYes.checked = false
      pagePreviewElements.needDeclarationYes.dispatchEvent(changeEvent)
      pagePreviewElements.needDeclarationNo.checked = true
      pagePreviewElements.needDeclarationNo.dispatchEvent(changeEvent)
      expect(pageRendererCb).toHaveBeenCalledTimes(6)
    })

    it('should toggle showConfirmationEmail when checkbox is changed', () => {
      if (!pagePreviewElements.disableConfirmationEmail) {
        throw new Error('confirmation email checkbox not found')
      }

      // Initially checkbox is unchecked (showConfirmationEmail is true)
      expect(pageController.showConfirmationEmail).toBe(true)
      jest.clearAllMocks()

      // Check the checkbox (disable confirmation email)
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageController.showConfirmationEmail).toBe(false)
      expect(pageRendererCb).toHaveBeenCalledTimes(1)

      // Uncheck the checkbox (enable confirmation email)
      pagePreviewElements.disableConfirmationEmail.checked = false
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)

      expect(pageController.showConfirmationEmail).toBe(true)
      expect(pageRendererCb).toHaveBeenCalledTimes(2)
    })

    it('should unset showConfirmationEmail when checkbox is checked', () => {
      if (!pagePreviewElements.disableConfirmationEmail) {
        throw new Error('confirmation email checkbox not found')
      }

      // Initially checkbox is unchecked (showConfirmationEmail is true)
      expect(pageController.showConfirmationEmail).toBe(true)
      jest.clearAllMocks()

      // Check the checkbox to disable confirmation email
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)

      expect(pageController.showConfirmationEmail).toBe(false)
      expect(pageRendererCb).toHaveBeenCalledTimes(1)
    })

    it('should toggle showConfirmationEmail multiple times via checkbox', () => {
      if (!pagePreviewElements.disableConfirmationEmail) {
        throw new Error('confirmation email checkbox not found')
      }

      // Initially checkbox is unchecked (showConfirmationEmail is true)
      expect(pageController.showConfirmationEmail).toBe(true)
      jest.clearAllMocks()

      // Check to disable confirmation email
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageController.showConfirmationEmail).toBe(false)
      expect(pageRendererCb).toHaveBeenCalledTimes(1)

      // Uncheck to enable again
      pagePreviewElements.disableConfirmationEmail.checked = false
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageController.showConfirmationEmail).toBe(true)
      expect(pageRendererCb).toHaveBeenCalledTimes(2)

      // Check to disable again
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageController.showConfirmationEmail).toBe(false)
      expect(pageRendererCb).toHaveBeenCalledTimes(3)
    })

    it('should call setShowConfirmationEmail when checkbox is unchecked', () => {
      if (!pagePreviewElements.disableConfirmationEmail) {
        throw new Error('confirmation email checkbox not found')
      }

      // First check it
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      jest.clearAllMocks()

      // Now uncheck it - should trigger setShowConfirmationEmail
      pagePreviewElements.disableConfirmationEmail.checked = false
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageController.showConfirmationEmail).toBe(true)
      expect(pageRendererCb).toHaveBeenCalledTimes(1)
    })

    it('should call unsetShowConfirmationEmail when checkbox is checked', () => {
      if (!pagePreviewElements.disableConfirmationEmail) {
        throw new Error('confirmation email checkbox not found')
      }

      jest.clearAllMocks()

      // Check the checkbox - should trigger unsetShowConfirmationEmail
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageController.showConfirmationEmail).toBe(false)
      expect(pageRendererCb).toHaveBeenCalledTimes(1)
    })

    it('should return correct listeners array including confirmation email listener', () => {
      const listeners = pageListeners.getListeners()

      // Verify we have listener for confirmation email checkbox
      const disableConfirmationEmailListener = listeners.find(
        (listener) =>
          listener[0] === pagePreviewElements.disableConfirmationEmail
      )

      expect(disableConfirmationEmailListener).toBeDefined()
      expect(disableConfirmationEmailListener?.[2]).toBe('change')
    })

    it('should handle mixed declaration and confirmation email interactions', () => {
      if (
        !pagePreviewElements.declarationTextElement ||
        !pagePreviewElements.needDeclarationYes ||
        !pagePreviewElements.needDeclarationNo ||
        !pagePreviewElements.disableConfirmationEmail
      ) {
        throw new Error('elements not found')
      }

      jest.clearAllMocks()

      // Enable declaration
      pagePreviewElements.needDeclarationYes.checked = true
      pagePreviewElements.needDeclarationYes.dispatchEvent(changeEvent)
      expect(pageRendererCb).toHaveBeenCalledTimes(1)

      // Check checkbox to disable confirmation email
      pagePreviewElements.disableConfirmationEmail.checked = true
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageRendererCb).toHaveBeenCalledTimes(2)

      // Update declaration text
      pagePreviewElements.declarationTextElement.value = 'I agree'
      pagePreviewElements.declarationTextElement.dispatchEvent(inputEvent)
      expect(pageController.guidanceText).toBe('I agree')
      expect(pageRendererCb).toHaveBeenCalledTimes(3)

      // Uncheck checkbox to re-enable confirmation email
      pagePreviewElements.disableConfirmationEmail.checked = false
      pagePreviewElements.disableConfirmationEmail.dispatchEvent(changeEvent)
      expect(pageRendererCb).toHaveBeenCalledTimes(4)

      // Disable declaration
      pagePreviewElements.needDeclarationNo.checked = true
      pagePreviewElements.needDeclarationNo.dispatchEvent(changeEvent)
      expect(pageRendererCb).toHaveBeenCalledTimes(5)
    })

    it('should expose isConfirmationEmailSettingsPanel from elements as false', () => {
      expect(pageController.isConfirmationEmailSettingsPanel).toBe(false)
    })

    it('should expose isConfirmationEmailSettingsPanel from elements as true', () => {
      const pagePreviewElementsWithPanel = new SummaryPagePreviewDomElements({
        showConfirmationEmail: true,
        declarationText: '',
        needDeclaration: false,
        isConfirmationEmailSettingsPanel: true
      })
      const pageControllerWithPanel = new SummaryPageController(
        pagePreviewElementsWithPanel,
        definition,
        renderer
      )
      expect(pageControllerWithPanel.isConfirmationEmailSettingsPanel).toBe(
        true
      )
    })
  })
})
