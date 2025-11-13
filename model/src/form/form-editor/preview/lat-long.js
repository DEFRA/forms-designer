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
export class LatLongComponentPreviewElements extends LocationQuestionComponentPreviewElements {}

export class LatLongQuestion extends LocationQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.LatLongField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'latlongfield.njk'
  _fieldName = 'LatLongField'

  /**
   * @protected
   * @returns {LatLongModel}
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
      latitude: createFieldClasses('latitude', this._highlight),
      longitude: createFieldClasses('longitude', this._highlight)
    }
  }
}

/**
 * @import { LocationSettings, LocationElements, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { LatLongModel } from '~/src/form/form-editor/macros/types.js'
 * @import { LatLongFieldComponent } from '~/src/components/types.js'
 */
