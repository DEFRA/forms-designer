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

      const pagePreviewElements = new SummaryPagePreviewDomElements()
      expect(pagePreviewElements.declarationText).toBe('')
      expect(pagePreviewElements.declaration).toBe(false)
    })

    it('should instantiate given elements true but empty text', () => {
      document.body.innerHTML =
        summaryPageHTML(true) + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements()
      expect(pagePreviewElements.declaration).toBe(true)
      expect(pagePreviewElements.declarationText).toBe('')
    })

    it('should instantiate given elements true but with text', () => {
      document.body.innerHTML =
        summaryPageHTML(true, 'Declaration text') + questionDetailsPreviewHTML

      const pagePreviewElements = new SummaryPagePreviewDomElements()
      expect(pagePreviewElements.declaration).toBe(true)
      expect(pagePreviewElements.declarationText).toBe('Declaration text')
    })

    it('should give default values if HTML is missing', () => {
      document.body.innerHTML = '<div></div>'
      const pagePreviewElements = new SummaryPagePreviewDomElements()
      expect(pagePreviewElements.declarationText).toBe('')
      expect(pagePreviewElements.declaration).toBe(false)
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
      pagePreviewElements = new SummaryPagePreviewDomElements()
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
        !pagePreviewElements.needDeclarationYes
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
  })
})
