import { ReorderQuestionsPageController } from '@defra/forms-model'
import {
  PageRendererStub,
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { pageHeadingAndGuidanceHTML } from '~/src/javascripts/preview/__stubs__/page.js'
import {
  listItemOrderHTML,
  questionDetailsPreviewHTML,
  upDownReorderButtonsHTML
} from '~/src/javascripts/preview/__stubs__/question'
import {
  ReorderQuestionsPagePreviewDomElements,
  ReorderQuestionsPagePreviewListeners
} from '~/src/javascripts/preview/page-controller/reorder-questions-page-controller'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('reorder-questions-page-controller', () => {
  describe('ReorderQuestionsPagePreviewDomElements', () => {
    it('should instantiate', () => {
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML

      const pagePreviewElements = new ReorderQuestionsPagePreviewDomElements()
      expect(pagePreviewElements.heading).toBe('Where do you live?')
      expect(pagePreviewElements.guidance).toBe('Guidance text')
    })
  })

  describe('ReorderQuestionsPagePreviewListeners', () => {
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
     * @type {ReorderQuestionsPagePreviewDomElements}
     */
    let pagePreviewElements

    /**
     * @type {ReorderQuestionsPageController}
     */
    let pageController
    /**
     * @type {ReorderQuestionsPagePreviewListeners}
     */
    let pageListeners

    const pageRendererCb = jest.fn()
    const renderer = new PageRendererStub(pageRendererCb)
    const changeEvent = new InputEvent('change', { bubbles: true })
    const focusEvent = new InputEvent('focus', { bubbles: true })
    const blurEvent = new InputEvent('blur', { bubbles: true })

    beforeEach(() => {
      jest.clearAllMocks()
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML +
        questionDetailsPreviewHTML +
        upDownReorderButtonsHTML +
        listItemOrderHTML
      pagePreviewElements = new ReorderQuestionsPagePreviewDomElements()
      pageController = new ReorderQuestionsPageController(
        components,
        pagePreviewElements,
        definition,
        renderer
      )
      pageController.highlightQuestion = jest.fn()
      pageListeners = new ReorderQuestionsPagePreviewListeners(
        pageController,
        pagePreviewElements
      )
      pageListeners.initListeners()
    })

    afterEach(() => {
      pageListeners.clearListeners()
    })

    it('should instantiate', () => {
      expect(pageListeners).toBeInstanceOf(ReorderQuestionsPagePreviewListeners)
    })

    it('should highlight a question', () => {
      if (pagePreviewElements.questionUpDownButtonElements.length === 0) {
        throw new Error('Failed')
      }
      pagePreviewElements.questionUpDownButtonElements[0].dispatchEvent(
        focusEvent
      )
      expect(pageController.highlightQuestion).toHaveBeenCalled()
    })

    it('should remove highlight from a question', () => {
      pageController.clearHighlight = jest.fn()
      if (pagePreviewElements.questionUpDownButtonElements.length === 0) {
        throw new Error('Failed')
      }
      pagePreviewElements.questionUpDownButtonElements[0].dispatchEvent(
        blurEvent
      )
      expect(pageController.clearHighlight).toHaveBeenCalled()
    })

    it('should rerender after question reordering', () => {
      if (pagePreviewElements.questionUpDownButtonElements.length === 0) {
        throw new Error('Failed')
      }
      if (!pagePreviewElements.listItemOrderElement) {
        throw new Error('Failed')
      }
      pageController.reorderComponents = jest.fn()
      pagePreviewElements.listItemOrderElement.dispatchEvent(changeEvent)
      expect(pageController.reorderComponents).toHaveBeenCalled()
    })
  })
})
