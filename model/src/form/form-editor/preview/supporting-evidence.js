import { Question } from '~/src/form/form-editor/preview/question.js'

export class SupportingEvidenceQuestion extends Question {
  /**
   * @type {string}
   */
  questionTemplate = Question.PATH + 'fileuploadfield.njk'
  /**
   * @type {string}
   * @public
   */
  fieldName = 'supportingEvidence'
}
