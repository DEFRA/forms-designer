import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class SupportingEvidenceQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.FileUploadField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'fileuploadfield.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'supportingEvidence'
}
