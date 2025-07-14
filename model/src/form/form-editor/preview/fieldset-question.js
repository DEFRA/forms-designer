import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

/**
 * Simple extension of Question that uses fieldset instead of label - not exported
 * @abstract
 */
export class FieldsetQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.TextField

  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      fieldset: this.fieldSet,
      hint: this.hint,
      classes: this._highlighted ? HIGHLIGHT_CLASS : '',
      ...this.customRenderFields
    }
  }
}
