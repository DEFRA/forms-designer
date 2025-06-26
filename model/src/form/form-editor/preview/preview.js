import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'

/**
 * @abstract
 */
export class PreviewComponent {
  static PATH = 'preview-components/'
  /**
   * @abstract
   * @type {ComponentType}
   */
  componentType = ComponentType.Details
  /**
   * @abstract
   * @type {string}
   * @protected
   */
  _questionTemplate = ''
  /**
   * @type { string|null }
   * @protected
   */
  _highlight = null
  /**
   * @abstract
   * @type {string}
   * @protected
   */
  _fieldName = ''
  /**
   * @type {QuestionRenderer}
   * @protected
   */
  _questionRenderer

  /**
   * @type {QuestionElements}
   * @protected
   */
  _htmlElements
  /**
   * @type {boolean}
   * @protected
   */
  _highlighted = false
  /**
   * @type {boolean}
   * @protected
   */

  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    const { question, optional } = htmlElements.values

    /**
     * @type {QuestionElements}
     * @protected
     */
    this._htmlElements = htmlElements
    /**
     * @type {string}
     * @private
     */
    this._question = question
    /**
     * @type {boolean}
     * @private
     */
    this._optional = optional
    /**
     *
     * @type {QuestionRenderer}
     * @protected
     */
    this._questionRenderer = questionRenderer
  }

  /**
   * @param {string} element
   * @returns {string}
   * @protected
   */
  getHighlight(element) {
    return this._highlight === element ? ' highlight' : ''
  }

  get titleText() {
    const optionalText = this._optional ? ' (optional)' : ''
    return (!this._question ? 'Question' : this._question) + optionalText
  }

  /**
   * @protected
   * @type {DefaultComponent}
   */
  get label() {
    return {
      text: this.titleText,
      classes: 'govuk-label--l' + this.getHighlight('question')
    }
  }

  /**
   * @protected
   * @type {GovukFieldset}
   */
  get fieldSet() {
    return {
      legend: {
        text: this.titleText,
        classes: 'govuk-fieldset__legend--l' + this.getHighlight('question')
      }
    }
  }

  /**
   * @returns {Partial<QuestionBaseModel>}
   */
  get customRenderFields() {
    return {}
  }

  /**
   *
   * @returns {QuestionBaseModel}
   * @protected
   */
  _renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      classes: this._highlighted ? HIGHLIGHT_CLASS : ''
    }
  }

  /**
   * @type {QuestionBaseModel}
   */
  get renderInput() {
    return {
      ...this._renderInput(),
      ...this.customRenderFields
    }
  }

  render() {
    this._questionRenderer.render(this._questionTemplate, this.renderInput)
  }

  /**
   * @type {string}
   */
  get question() {
    return this._question
  }

  /**
   * @param {string} value
   */
  set question(value) {
    this._question = value
    this.render()
  }

  get optional() {
    return this._optional
  }

  /**
   * @param {boolean} value
   */
  set optional(value) {
    this._optional = value
    this.render()
  }

  /**
   * @type {string | null}
   */
  get highlight() {
    return this._highlight
  }

  /**
   * @param {string | null} value
   */
  set highlight(value) {
    this._highlight = value
    this.render()
  }

  /**
   * no render
   */
  highlightContent() {
    this._highlighted = true
  }

  /**
   * no render
   */
  unHighlightContent() {
    this._highlighted = false
  }
}

/**
 * @import { ListenerRow, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { FormComponentsDef, ContentComponentsDef, ComponentDef } from '~/src/components/types.js'
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
