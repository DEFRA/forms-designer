import { Question } from '~/src/form/form-editor/preview/question.js'

/**
 * Simple extension of Question that uses fieldset instead of label - not exported
 * @abstract
 */
export class FieldsetQuestion extends Question {
  get renderInput() {
    return {
      id: this.fieldName,
      name: this.fieldName,
      fieldset: this.fieldSet,
      hint: this.hint,
      ...this.customRenderFields
    }
  }
}
