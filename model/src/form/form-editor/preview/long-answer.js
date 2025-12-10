import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * @constant
 * @type {number}
 * The default number of rows for a multiline text field.
 */
export const MULTILINE_TEXT_QUESTION_DEFAULT_ROWS = 5

/**
 * @implements {QuestionElements}
 */
export class MultilineTextFieldComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {MultilineTextFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._maxLength = component.schema.max
    this._rows = component.options.rows
  }

  /**
   * @protected
   * @returns {MultilineTextFieldSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      maxLength: this._maxLength ?? 0,
      rows: this._rows ?? MULTILINE_TEXT_QUESTION_DEFAULT_ROWS
    }
  }
}

export class LongAnswerQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.MultilineTextField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'textarea.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'longAnswerField'

  /**
   * @param {MultilineTextFieldElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._maxLength = htmlElements.values.maxLength
    this._rows = htmlElements.values.rows
  }

  get maxLength() {
    return this._maxLength
  }

  /**
   * @param {number} val
   */
  set maxLength(val) {
    this._maxLength = val
    this.render()
  }

  get rows() {
    return this._rows
  }

  /**
   * @param {number} val
   */
  set rows(val) {
    this._rows = val
    this.render()
  }

  /**
   * @protected
   */
  _renderInput() {
    const maxLengthObj =
      this.maxLength && this.maxLength > 0 ? { maxlength: this.maxLength } : {}
    const rowsObj = this.rows ? { rows: this.rows } : {}
    return {
      ...super._renderInput(),
      ...maxLengthObj,
      ...rowsObj
    }
  }
}

/**
 * @import { MultilineTextFieldSettings, MultilineTextFieldElements, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { MultilineTextFieldComponent } from '~/src/components/types.js'
 */
