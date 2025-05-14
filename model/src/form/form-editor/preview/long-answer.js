import { Question } from '~/src/form/form-editor/preview/question.js'

export class LongAnswerQuestion extends Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = 'textarea.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'longAnswerField'
}
