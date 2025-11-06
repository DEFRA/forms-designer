import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { QuestionComponentElements } from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class UkAddressComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {UkAddressFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._usePostcodeLookup = component.options.usePostcodeLookup
  }

  /**
   * @protected
   * @returns {UkAddressSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      usePostcodeLookup: this._usePostcodeLookup
    }
  }
}

export class UkAddressQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.UkAddressField
  _questionTemplate = PreviewComponent.PATH + 'ukaddressfield.njk'
  _fieldName = 'addressField'
  _usePostcodeLookup = false

  /**
   * @param {UkAddressElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._usePostcodeLookup = htmlElements.values.usePostcodeLookup ?? false
  }

  get usePostcodeLookup() {
    return this._usePostcodeLookup
  }

  /**
   * @param {boolean} val
   */
  set usePostcodeLookup(val) {
    this._usePostcodeLookup = val
    this.render()
  }

  /**
   * @protected
   */
  _renderInput() {
    return {
      ...super._renderInput(),
      usePostcodeLookup: this.usePostcodeLookup
    }
  }
}

/**
 * @import { QuestionElements, QuestionRenderer, UkAddressElements, UkAddressSettings } from '~/src/form/form-editor/preview/types.js'
 * @import { UkAddressFieldComponent } from '~/src/components/types.js'
 */
