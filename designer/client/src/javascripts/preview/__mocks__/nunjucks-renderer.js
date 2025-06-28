/**
 * @implements {RenderBase}
 */
export class NunjucksRendererBase {
  /**
   * @type {jest.Mock<void, [string, RenderContext]>}
   */
  _renderMock = jest.fn()
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
    this._renderMock(questionTemplate, renderContext)
  }

  /**
   * @param {string} _questionTemplate
   * @param {RenderContext} _renderContext
   * @returns {string}
   */
  static buildHTML(_questionTemplate, _renderContext) {
    return '<div>**** BUILT HTML ****</div>'
  }
}

/**
 * @implements {QuestionRenderer}
 */
export class NunjucksRenderer {
  /**
   * @type {jest.Mock<void, [string, QuestionBaseModel]>}
   */
  _renderMock = jest.fn()

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   */
  render(questionTemplate, questionBaseModel) {
    this._renderMock(questionTemplate, questionBaseModel)
  }

  /**
   * @returns {string}
   * @param {string} questionTemplate
   * @param {RenderContext} renderContext
   */
  static buildHTML(questionTemplate, renderContext) {
    return NunjucksRendererBase.buildHTML(questionTemplate, renderContext)
  }
}

/**
 * @implements {PageRenderer}
 */
export class NunjucksPageRenderer {
  /**
   * @type {jest.Mock<void, [string, PagePreviewPanelMacro]>}
   */
  _renderMock = jest.fn()

  /**
   * @param {string} questionTemplate
   * @param {PagePreviewPanelMacro} pagePreviewPanelMacro
   */
  render(questionTemplate, pagePreviewPanelMacro) {
    this._renderMock(questionTemplate, pagePreviewPanelMacro)
  }
}
/**
 * @import { QuestionRenderer, QuestionElements, QuestionBaseModel, RenderContext, PageRenderer, PagePreviewPanelMacro, DomElementsBase, RenderBase } from '@defra/forms-model'
 */
