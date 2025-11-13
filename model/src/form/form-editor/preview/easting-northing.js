import { ComponentType } from '~/src/components/enums.js'
import {
  createFieldClasses,
  createLocationFieldModel
} from '~/src/form/form-editor/preview/location-helpers.js'
import {
  LocationQuestion,
  LocationQuestionComponentPreviewElements
} from '~/src/form/form-editor/preview/location-question-base.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

/**
 * @implements {QuestionElements}
 */
export class EastingNorthingComponentPreviewElements extends LocationQuestionComponentPreviewElements {}

export class EastingNorthingQuestion extends LocationQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.EastingNorthingField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'eastingnorthingfield.njk'
  _fieldName = 'EastingNorthingField'

  /**
   * @protected
   * @returns {EastingNorthingModel}
   */
  _renderInput() {
    const baseModel = super._renderInput()
    const locationModel = createLocationFieldModel(
      baseModel,
      /** @type {LocationElements} */ (this._htmlElements),
      this._highlight,
      this._instructionText
    )

    return {
      ...locationModel,
      easting: createFieldClasses('easting', this._highlight),
      northing: createFieldClasses('northing', this._highlight)
    }
  }
}

/**
 * @import { LocationSettings, LocationElements, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { EastingNorthingModel } from '~/src/form/form-editor/macros/types.js'
 * @import { EastingNorthingFieldComponent } from '~/src/components/types.js'
 */
