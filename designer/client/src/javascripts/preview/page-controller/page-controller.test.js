import { PreviewPageController } from '@defra/forms-model'
import {
  PageRendererStub,
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  pageHeadingAndGuidanceHTML,
  repeaterPageHTML
} from '~/src/javascripts/preview/__stubs__/page.js'
import {
  listItemOrderHTML,
  questionDetailsPreviewHTML,
  upDownReorderButtonsHTML
} from '~/src/javascripts/preview/__stubs__/question'
import {
  PagePreviewDomElements,
  PagePreviewListeners
} from '~/src/javascripts/preview/page-controller/page-controller.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('page-controller', () => {
  describe('PagePreviewDomElements', () => {
    it('should instantiate', () => {
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML

      const pagePreviewElements = new PagePreviewDomElements()
      expect(pagePreviewElements.heading).toBe('Where do you live?')
      expect(pagePreviewElements.guidance).toBe('Guidance text')
    })

    it('should handle missing details', () => {
      document.body.innerHTML = '<p>missing form</p>'
      const pagePreviewElements = new PagePreviewDomElements()
      expect(pagePreviewElements.guidance).toBe('')
      expect(pagePreviewElements.heading).toBe('')
      expect(pagePreviewElements.addHeading).toBe(false)
      expect(pagePreviewElements.hasRepeater).toBe(false)
      expect(pagePreviewElements.repeatQuestion).toBeUndefined()
    })

    it('should handle repeater pages', () => {
      document.body.innerHTML = repeaterPageHTML + questionDetailsPreviewHTML
      const pagePreviewElements = new PagePreviewDomElements()
      expect(pagePreviewElements.repeatQuestion).toBe(
        'Simple question responses'
      )
      expect(pagePreviewElements.hasRepeater).toBe(true)
    })
  })
  describe('PagePreviewListeners', () => {
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
     * @type {PagePreviewDomElements}
     */
    let pagePreviewElements

    /**
     * @type {PreviewPageController}
     */
    let pageController
    /**
     * @type {PagePreviewListeners}
     */
    let pageListeners

    const pageRendererCb = jest.fn()
    const renderer = new PageRendererStub(pageRendererCb)
    const inputEvent = new InputEvent('input', { bubbles: true })
    const changeEvent = new InputEvent('change', { bubbles: true })
    const previewBtn = `<a href="http://localhost" role="button" id="preview-page" class="govuk-button  govuk-button--inverse" data-module="govuk-button" data-govuk-button-init="">Preview page</a>`
    beforeEach(() => {
      jest.clearAllMocks()
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML +
        questionDetailsPreviewHTML +
        previewBtn +
        upDownReorderButtonsHTML +
        listItemOrderHTML
      pagePreviewElements = new PagePreviewDomElements()
      pageController = new PreviewPageController(
        components,
        pagePreviewElements,
        definition,
        renderer
      )
      pageController.highlightQuestion = jest.fn()
      pageListeners = new PagePreviewListeners(
        pageController,
        pagePreviewElements
      )
      pageListeners.initListeners()
    })

    afterEach(() => {
      pageListeners.clearListeners()
    })

    it('should instantiate', () => {
      if (!pagePreviewElements.previewPageButton) {
        throw new Error('Failed')
      }
      expect(pageListeners).toBeInstanceOf(PagePreviewListeners)
      expect(pagePreviewElements.previewPageButton.style.display).toBe('none')
    })

    it('should highlight guidance', () => {
      if (!pagePreviewElements.guidanceElement) {
        throw new Error('Failed')
      }
      pagePreviewElements.guidanceElement.focus()
      expect(pageController.guidance.classes).toBe('highlight')
      pagePreviewElements.guidanceElement.blur()
      expect(pageController.guidance.classes).toBe('')
      expect(pageRendererCb).toHaveBeenCalledTimes(3)
    })

    it('should highlight title', () => {
      if (!pagePreviewElements.headingElement) {
        throw new Error('Failed')
      }
      pagePreviewElements.headingElement.focus()
      expect(pageController.pageTitle.classes).toBe('highlight')
      pagePreviewElements.headingElement.blur()
      expect(pageController.pageTitle.classes).toBe('')
      expect(pageRendererCb).toHaveBeenCalledTimes(3)
    })

    it('should change the title', () => {
      if (!pagePreviewElements.headingElement) {
        throw new Error('Failed')
      }
      pagePreviewElements.headingElement.value = 'New title'
      pagePreviewElements.headingElement.dispatchEvent(inputEvent)
      expect(pageController.pageTitle.text).toBe('New title')
      expect(pageRendererCb).toHaveBeenCalledTimes(2)
    })

    it('should change showTitle', () => {
      if (!pagePreviewElements.addPageHeadingElement) {
        throw new Error('Failed')
      }
      pagePreviewElements.addPageHeadingElement.checked = true
      pagePreviewElements.addPageHeadingElement.dispatchEvent(changeEvent)
      expect(pageController.showTitle).toBe(true)
      pagePreviewElements.addPageHeadingElement.checked = false
      pagePreviewElements.addPageHeadingElement.dispatchEvent(changeEvent)
      expect(pageController.showTitle).toBe(false)
      expect(pageRendererCb).toHaveBeenCalledTimes(3)
    })

    it('should change the guidance', () => {
      if (!pagePreviewElements.guidanceElement) {
        throw new Error('Failed')
      }
      pagePreviewElements.guidanceElement.value = 'New guidance'
      pagePreviewElements.guidanceElement.dispatchEvent(inputEvent)
      expect(pageController.guidance.text).toBe('New guidance')
      expect(pageRendererCb).toHaveBeenCalledTimes(2)
    })

    it('should handle missing details', () => {
      document.body.innerHTML = '<p>missing form</p>'
      pagePreviewElements = new PagePreviewDomElements()
      const pageController2 = new PreviewPageController(
        components,
        pagePreviewElements,
        definition,
        renderer
      )
      const listener = new PagePreviewListeners(
        pageController2,
        pagePreviewElements
      )
      listener.initListeners()
      listener.clearListeners()
      expect(pagePreviewElements.guidance).toBe('')
      expect(pagePreviewElements.heading).toBe('')
    })

    it('should turn toggle multiple responses', () => {
      if (pagePreviewElements.repeaterElement === null) {
        throw new Error('Failed')
      }
      pagePreviewElements.repeaterElement.checked = true
      pagePreviewElements.repeaterElement.dispatchEvent(changeEvent)
      expect(pageController.repeaterButton?.text).toBe('[question set name]')
      expect(pageController.sectionTitle?.text).toBe('Question set name')
      expect(pageRendererCb).toHaveBeenCalledTimes(2)
    })

    it('should highlight section title & btn on section repeater title', () => {
      if (
        pagePreviewElements.repeaterElement === null ||
        pagePreviewElements.questionSetNameElement === null
      ) {
        throw new Error('Failed')
      }
      pagePreviewElements.repeaterElement.checked = true
      pagePreviewElements.repeaterElement.dispatchEvent(changeEvent)
      pagePreviewElements.questionSetNameElement.focus()
      expect(pageController.sectionTitle?.classes).toBe('highlight')
      expect(pageController.repeaterButton?.classes).toBe('highlight')
      pagePreviewElements.questionSetNameElement.blur()
      expect(pageController.sectionTitle?.classes).toBe('')
      expect(pageRendererCb).toHaveBeenCalledTimes(4)
      pagePreviewElements.questionSetNameElement.value = 'Repeater questions'
      pagePreviewElements.questionSetNameElement.dispatchEvent(inputEvent)
      expect(pageController.sectionTitle?.text).toBe('Repeater questions 1')
      pagePreviewElements.repeaterElement.checked = false
      pagePreviewElements.repeaterElement.dispatchEvent(changeEvent)
      expect(pageController.sectionTitle).toBeUndefined()
      expect(pageController.repeaterButton).toBeUndefined()
      expect(pageController.repeaterText).toBeUndefined()
      expect(pageRendererCb).toHaveBeenCalledTimes(6)
    })
  })
})
