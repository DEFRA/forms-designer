/**
 * @class Question
 * @classdesc
 * A data object that has access to the underlying data via the QuestionElements object interface
 * and the templating mechanism to render the HTML for the data.
 *
 * It does not have access to the DOM, but has access to QuestionElements.setPreviewHTML to update
 * the HTML.  Question classes should only be responsible data and rendering as are reused in the
 * server side.
 */
export class Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'textfield.njk'
  /**
   * @type { string|null }
   * @protected
   */
  _highlight = null
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'inputField'
  /**
   * @type {QuestionRenderer}
   * @protected
   */
  _questionRenderer

  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    const { question, hintText, optional } = htmlElements.values

    /**
     * @type {QuestionElements}
     * @private
     */
    this._htmlElements = htmlElements
    /**
     * @type {string}
     * @private
     */
    this._question = question
    /**
     * @type {string}
     * @private
     */
    this._hintText = hintText
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
   * @type {DefaultComponent}
   * @protected
   */
  get hint() {
    const text =
      this._highlight === 'hintText' && !this._hintText.length
        ? 'Hint text'
        : this._hintText

    return {
      text,
      classes: this.getHighlight('hintText')
    }
  }

  /**
   * @type {QuestionBaseModel}
   */
  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      label: this.label,
      hint: this.hint
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

  /**
   * @type {string}
   */
  get hintText() {
    return this._hintText
  }

  /**
   * @param {string} value
   */
  set hintText(value) {
    this._hintText = value
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
}

/**
 * @import { ListenerRow, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
