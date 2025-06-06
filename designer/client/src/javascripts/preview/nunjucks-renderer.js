import { TextField } from '@defra/forms-engine-plugin/engine/components/TextField.js'
import { QuestionRenderer } from '@defra/forms-model'

import { NJK } from '~/src/javascripts/preview/nunjucks.js'

import '~/src/views/preview-components/inset.njk'

export class NunjucksRenderer extends QuestionRenderer {
  /**
   * @type {QuestionElements}
   * @protected
   */
  _questionElements

  /**
   * @param {QuestionElements} questionElements
   */
  constructor(questionElements) {
    super()
    this._questionElements = questionElements
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   * @protected
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
   * @param {Question} question
   */
  render(question) {
    this._render(question.questionTemplate, question.renderInput)
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
