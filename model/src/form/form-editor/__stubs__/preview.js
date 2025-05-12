/**
 * @implements {QuestionRenderer}
 */
export class QuestionRendererStub {
  /**
   * @type {jest.Mock<void, [string, QuestionBaseModel]>}
   */
  renderMock

  /**
   * @param {jest.Mock<void, [string, QuestionBaseModel]>} renderMock
   */
  constructor(renderMock) {
    this.renderMock = renderMock
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   */
  render(questionTemplate, questionBaseModel) {
    this.renderMock(questionTemplate, questionBaseModel)
  }

  /**
   * @returns {string}
   * @param {string} _questionTemplate
   * @param {RenderContext} _renderContext
   */
  static buildHTML(_questionTemplate, _renderContext) {
    return '**** BUILT HTML ****'
  }
}

/**
 * @implements {ListElements}
 */
export class QuestionPreviewElements {
  /**
   * @protected
   */
  _question = ''
  /** @protected */
  _hintText = ''
  /** @protected */
  _optional = false
  /**
   * @type {string}
   * @protected
   */
  _shortDesc = ''
  /**
   *
   * @type {ListElement[]}
   * @private
   */
  _items = []

  afterInputsHTML = '<div class="govuk-inset-text">No items added yet.</div>'

  /**
   * @param {BaseSettings} baseSettings
   */
  constructor({ question, hintText, optional, shortDesc, items }) {
    this._question = question
    this._hintText = hintText
    this._optional = optional
    this._shortDesc = shortDesc
    this._items = items
  }

  get values() {
    return {
      question: this._question,
      hintText: this._hintText,
      optional: this._optional,
      shortDesc: this._shortDesc,
      items: this._items
    }
  }

  /**
   * @param {string} _value
   */
  setPreviewHTML(_value) {
    // Not implemented for server side render
  }
}

export const baseElements = /** @type {BaseSettings} */ ({
  items: [],
  optional: false,
  question: 'Which quest would you like to pick?',
  hintText: 'Choose one adventure that best suits you.',
  shortDesc: ''
})

/**
 * @import { ListElement } from  '~/src/form/form-editor/types.js'
 * @import { BaseSettings, ListElements, RenderContext, QuestionBaseModel, QuestionElements, QuestionRenderer } from  '~/src/form/form-editor/preview/types.js'
 */
