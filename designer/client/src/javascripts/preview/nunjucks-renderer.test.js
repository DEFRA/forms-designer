import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'
import { NJK } from '~/src/javascripts/preview/nunjucks.js'

jest.mock('~/src/views/components/inset.njk', () => '')

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

  const mockSetPreviewHTML = jest.fn()
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
        items: []
      })
    }

    /**
     * @param {string} value
     */
    setPreviewHTML(value) {
      mockSetPreviewHTML(value)
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
  })
})

/**
 * @import { QuestionBaseModel, BaseSettings, QuestionElements } from '@defra/forms-model'
 */
