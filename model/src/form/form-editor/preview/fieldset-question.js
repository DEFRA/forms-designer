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
    const idSuffix = this._id ? `-${this._id}` : ''

    return {
      id: `${this._fieldName}${idSuffix}`,
      name: this._fieldName,
      fieldset: this.fieldSet,
      hint: this.hint,
      classes: this._highlighted ? HIGHLIGHT_CLASS : '',
      ...this.customRenderFields
    }
  }
}
