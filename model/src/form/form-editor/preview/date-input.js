import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { Question } from '~/src/form/form-editor/preview/question.js'
export class DateInputQuestion extends FieldsetQuestion {
  /**
   * @type {string}
   */
  questionTemplate = Question.PATH + 'date-input.njk'
  fieldName = 'dateInput'
}
