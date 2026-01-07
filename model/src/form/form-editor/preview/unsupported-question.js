import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class UnsupportedQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  // @ts-expect-error - invalid component type
  componentType = 'UnsupportedQuestion'
  _questionTemplate = PreviewComponent.PATH + 'unsupportedquestion.njk'
}

/**
 * @import { ComponentType } from '~/src/components/enums.js'
 */
