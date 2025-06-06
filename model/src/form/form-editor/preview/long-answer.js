import { Question } from '~/src/form/form-editor/preview/question.js'

export class LongAnswerQuestion extends Question {
  /**
   * @type {string}
   */
  questionTemplate = Question.PATH + 'textarea.njk'
  /**
   * @type {string}
   * @public
   */
  fieldName = 'longAnswerField'
}
