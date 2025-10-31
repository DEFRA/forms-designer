import { ComponentType } from '~/src/components/enums.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class NumberComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {NumberFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._prefix = component.options.prefix
    this._suffix = component.options.suffix
  }

  /**
   * @protected
   * @returns {NumberSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      prefix: this._prefix ?? '',
      suffix: this._suffix ?? ''
    }
  }
}

export class NumberOnlyQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.NumberField

  /**
   * @param {NumberElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._fieldName = 'numberField'
    this._prefix = htmlElements.values.prefix
    this._suffix = htmlElements.values.suffix
  }

  /**
   * @returns {Partial<QuestionBaseModel>}
   */
  get customRenderFields() {
    return {
      type: 'number'
    }
  }

  get prefix() {
    return this._prefix
  }

  /**
   * @param {string} val
   */
  set prefix(val) {
    this._prefix = val
    this.render()
  }

  get suffix() {
    return this._suffix
  }

  /**
   * @param {string} val
   */
  set suffix(val) {
    this._suffix = val
    this.render()
  }

  /**
   * @protected
   */
  _renderInput() {
    const prefixObj = this.prefix ? { prefix: { text: this.prefix } } : {}
    const suffixObj = this.suffix ? { suffix: { text: this.suffix } } : {}
    return {
      ...super._renderInput(),
      ...prefixObj,
      ...suffixObj
    }
  }
}

/**
 * @import { NumberSettings, NumberElements, QuestionBaseModel, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { NumberFieldComponent } from '~/src/components/types.js'
 */
