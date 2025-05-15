import { NJK } from '~/src/javascripts/preview/nunjucks.js'
import '~/src/views/preview-components/inset.njk'

/**
 * @implements {QuestionRenderer}
 */
export class NunjucksRenderer {
  /**
   * @type {QuestionElements}
   * @private
   */
  _questionElements

  /**
   * @param {QuestionElements} questionElements
   */
  constructor(questionElements) {
    this._questionElements = questionElements
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   * @private
   */
  _render(questionTemplate, questionBaseModel) {
    /**
     * @type {RenderContext}
     */
    const renderContext = { model: questionBaseModel }
    const html = NunjucksRenderer.buildHTML(questionTemplate, renderContext)
    this._questionElements.setPreviewHTML(html)
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   */
  render(questionTemplate, questionBaseModel) {
    this._render(questionTemplate, questionBaseModel)
  }

  /**
   * @param {string} questionTemplate
   * @param {RenderContext} renderContext
   * @returns {string}
   */
  static buildHTML(questionTemplate, renderContext) {
    return NJK.render(questionTemplate, renderContext)
  }
}

/**
 * @import { QuestionRenderer, QuestionElements, QuestionBaseModel, RenderContext } from '@defra/forms-model'
 */
