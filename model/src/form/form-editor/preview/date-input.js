import { ComponentType } from '~/src/components/enums.js'
import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class DateInputQuestion extends FieldsetQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.DatePartsField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = Question.PATH + 'date-input.njk'
  _fieldName = 'dateInput'
}
