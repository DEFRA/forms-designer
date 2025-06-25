import {
  NunjucksPageRenderer,
  NunjucksRenderer
} from '~/src/javascripts/preview/nunjucks-renderer.js'
import { NJK } from '~/src/javascripts/preview/nunjucks.js'

jest.mock('~/src/views/preview-components/inset.njk', () => '')

jest.mock('~/src/javascripts/preview/nunjucks.js', () => ({
  NJK: {
    render: jest.fn().mockReturnValue('*** rendered ***')
  }
}))
describe('nunjucks-renderer', () => {
  const model = /** @type {QuestionBaseModel} */ ({
    id: 'f17b7481-60d8-4538-b54a-d3c9f84c986f',
    name: 'AbbcE',
    text: 'Question'
  })
  const params = /** @type {PagePreviewPanelMacro} */ ({
    guidance: { classes: '', text: '' },
    pageTitle: { classes: '', text: '' },
    components: []
  })

  const mockSetPreviewHTML = jest.fn()
  const mockSetPreviewDOM = jest.fn()
  /**
   * @implements {QuestionElements}
   */
  class QuestionElementMock {
    /** @type {BaseSettings} */
    get values() {
      return /** @type {BaseSettings} */ ({
        question: 'Question',
        hintText: '',
        optional: false,
        shortDesc: '',
        items: [],
        largeTitle: true,
        content: ''
      })
    }

    /**
     * @param {string} value
     */
    setPreviewHTML(value) {
      mockSetPreviewHTML(value)
    }

    /**
     * @param {HTMLElement} element
     */
    setPreviewDOM(element) {
      mockSetPreviewDOM(element)
    }
  }

  /**
   * @implements {DomElementsBase}
   */
  class PagePreviewMock {
    guidance = 'guidance text'
    heading = 'heading'

    /**
     * @param {string} value
     */
    setPreviewHTML(value) {
      mockSetPreviewHTML(value)
    }

    /**
     * @param {HTMLElement} element
     */
    setPreviewDOM(element) {
      mockSetPreviewDOM(element)
    }
  }
  /**
   * @type {QuestionElements}
   */
  const questionElementMock = new QuestionElementMock()
  describe('NunjucksRenderer', () => {
    it('should render the element', () => {
      const template = 'example.njk'
      const renderer = new NunjucksRenderer(questionElementMock)
      renderer.render(template, model)
      expect(NJK.render).toHaveBeenCalledWith(template, { model })
      expect(mockSetPreviewHTML).toHaveBeenCalledWith('*** rendered ***')
    })

    it('should build the html', () => {
      const renderedHTML = NunjucksRenderer.buildHTML('example.njk', { model })
      expect(renderedHTML).toBe('*** rendered ***')
    })
  })

  describe('NunjucksPageRenderer', () => {
    it('should render', () => {
      const pagePreviewStub = new PagePreviewMock()
      const template = 'example.njk'
      const renderer = new NunjucksPageRenderer(pagePreviewStub)
      renderer.render(template, params)
      expect(NJK.render).toHaveBeenCalledWith(template, { params })
      expect(mockSetPreviewHTML).toHaveBeenCalledWith('*** rendered ***')
    })
  })
})

/**
 * @import { QuestionBaseModel, BaseSettings, QuestionElements, PageRenderContext, PagePreviewPanelMacro } from '@defra/forms-model'
 */
