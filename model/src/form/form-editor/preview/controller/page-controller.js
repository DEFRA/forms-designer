/**
 * @implements {PagePreviewPanelMacro}
 */
export class PreviewPageController {
  /**
   * @protected
   * @type {Question[]}
   */
  _components = []
  /**
   * @protected
   * @type {string}
   */
  _title = ''
  /**
   * @protected
   * @type {string}
   */
  _titleClass = ''

  /**
   * @param {Question[]} components
   * @param {string} title
   * @param {string} titleClass
   */
  constructor(components, title = '', titleClass = '') {
    this._components = components
    this._title = title
    this._titleClass = titleClass
  }

  /**
   * @returns {PagePreviewComponent[]}
   */
  get components() {
    return this._components.map((component) => ({
      model: component.renderInput,
      questionType: component.componentType
    }))
  }

  /**
   * @private
   * @returns {string}
   */
  _fallBackTitle() {
    return this._components[0]?.question ?? ''
  }

  /**
   * @returns {{ text: string, classes: string }}
   */
  get pageTitle() {
    const text = this._title.length ? this._title : this._fallBackTitle()
    return {
      text,
      classes: this._titleClass
    }
  }
}

/**
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PagePreviewComponent, PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 */
