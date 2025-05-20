import { Question } from '~/src/form/form-editor/preview/question.js'

export class SupportingEvidenceQuestion extends Question {
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = Question.PATH + 'fileuploadfield.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'supportingEvidence'
}
