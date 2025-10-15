import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { QuestionComponentElements } from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class UkAddressComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {FormComponentsDef & { options: { usePostcodeLookup: boolean } }} component
   */
  constructor(component) {
    super(component)
    this._usePostcodeLookup = component.options.usePostcodeLookup
  }

  /**
   * @protected
   * @returns {BaseSettings}
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

  get usePostcodeLookup() {
    return this._usePostcodeLookup
  }
}

/**
 * @import { BaseSettings, QuestionElements } from '~/src/form/form-editor/preview/types.js'
 * @import { FormComponentsDef } from '~/src/components/types.js'
 */
