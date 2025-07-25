import { NJK } from '~/src/javascripts/preview/nunjucks.js'
import '~/src/views/preview-components/inset.njk'

/**
 * @implements {RenderBase}
 */
export class NunjucksRendererBase {
  /**
   * @type {DomElementsBase}
   * @protected
   */
  _questionElements

  /**
   * @param {DomElementsBase} questionElements
   */
  constructor(questionElements) {
    this._questionElements = questionElements
  }

  /**
   * @param {string} questionTemplate
   * @param {RenderContext} renderContext
   */
  render(questionTemplate, renderContext) {
    const html = NunjucksRendererBase.buildHTML(questionTemplate, renderContext)
    this._questionElements.setPreviewHTML(html)
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
 * @implements {QuestionRenderer}
 */
export class NunjucksRenderer {
  /**
   * @type {NunjucksRendererBase}
   * @protected
   */
  _renderBase
  /**
   * @param {QuestionElements} questionElements
   */
  constructor(questionElements) {
    this._renderBase = new NunjucksRendererBase(questionElements)
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   */
  render(questionTemplate, questionBaseModel) {
    this._renderBase.render(questionTemplate, { model: questionBaseModel })
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionRenderContext} renderContext
   * @returns {string}
   */
  static buildHTML(questionTemplate, renderContext) {
    return NunjucksRendererBase.buildHTML(questionTemplate, renderContext)
  }
}

/**
 * @import { QuestionRenderer, QuestionElements, QuestionBaseModel, RenderContext, Renderer, PageRenderer, PagePreviewPanelMacro, DomElementsBase, QuestionRenderContext, RenderBase } from '@defra/forms-model'
 * @import { PagePreviewDomElements } from '~/src/javascripts/preview/page-controller/page-controller.js'
 */
