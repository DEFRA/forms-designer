import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class GeospatialFieldComponentPreviewElements extends QuestionComponentElements {}

export class GeospatialQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.GeospatialField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'geospatialfield.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'geospatialField'
}

/**
 * @import { QuestionElements } from '~/src/form/form-editor/preview/types.js'
 */
