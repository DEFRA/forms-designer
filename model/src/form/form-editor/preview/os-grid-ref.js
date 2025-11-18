import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { createLocationFieldModel } from '~/src/form/form-editor/preview/location-helpers.js'
import {
  LocationQuestion,
  LocationQuestionComponentPreviewElements
} from '~/src/form/form-editor/preview/location-question-base.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

/**
 * @implements {QuestionElements}
 */
export class OsGridRefComponentPreviewElements extends LocationQuestionComponentPreviewElements {}

export class OsGridRefQuestion extends LocationQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.OsGridRefField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'osgridreffield.njk'
  _fieldName = 'OsGridRefField'

  /**
   * @protected
   * @returns {OsGridRefModel}
   */
  _renderInput() {
    const baseModel = super._renderInput()
    const locationModel = createLocationFieldModel(
      baseModel,
      /** @type {LocationElements} */ (this._htmlElements),
      this._highlight,
      this._instructionText,
      this.titleText
    )

    return {
      ...locationModel,
      label: {
        text: this.titleText,
        classes: this._highlight === 'question' ? HIGHLIGHT_CLASS : ''
      },
      inputClasses: this._highlight === 'input' ? HIGHLIGHT_CLASS : ''
    }
  }
}

/**
 * @import { LocationSettings, LocationElements, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { OsGridRefModel } from '~/src/form/form-editor/macros/types.js'
 * @import { OsGridRefFieldComponent } from '~/src/components/types.js'
 */
