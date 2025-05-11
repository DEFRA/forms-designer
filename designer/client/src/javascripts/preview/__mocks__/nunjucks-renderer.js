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
   * @param {string} questionTemplate
   * @param {RenderContext} renderContext
   * @returns {string}
   */
  static buildHTML(_questionTemplate, _renderContext) {
    return '**** BUILT HTML ****'
  }
}

/**
 * @import { QuestionRenderer, QuestionElements, QuestionBaseModel, RenderContext } from '@defra/forms-model'
 */
