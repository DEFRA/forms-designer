import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { Question } from '~/src/form/form-editor/preview/question.js'
import { buildCombinedId } from '~/src/form/form-editor/preview/utils.js'

/**
 * Simple extension of Question that uses fieldset instead of label - not exported
 * @abstract
 */
export class FieldsetQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.TextField

  /**
   * @protected
   * @returns {QuestionBaseModel}
   */
  _renderInput() {
    return {
      id: buildCombinedId(this._fieldName, this._id),
      name: this._fieldName,
      fieldset: this.fieldSet,
      hint: this.hint,
      classes: this._highlighted ? HIGHLIGHT_CLASS : '',
      ...this.customRenderFields
    }
  }
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/macros/types.js'
 */
