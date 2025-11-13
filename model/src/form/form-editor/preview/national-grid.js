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
export class NationalGridComponentPreviewElements extends LocationQuestionComponentPreviewElements {}

export class NationalGridQuestion extends LocationQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.NationalGridFieldNumberField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'nationalgridfieldnumberfield.njk'
  _fieldName = 'NationalGridFieldNumberField'

  /**
   * @protected
   * @returns {NationalGridModel}
   */
  _renderInput() {
    const baseModel = super._renderInput()
    const locationModel = createLocationFieldModel(
      baseModel,
      /** @type {LocationElements} */ (this._htmlElements),
      this._highlight,
      this._instructionText
    )
    const question = this._htmlElements.values.question || 'Question'

    return {
      ...locationModel,
      label: {
        text: question,
        classes: this._highlight === 'question' ? HIGHLIGHT_CLASS : ''
      },
      inputClasses: this._highlight === 'input' ? HIGHLIGHT_CLASS : ''
    }
  }
}

/**
 * @import { LocationSettings, LocationElements, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { NationalGridModel } from '~/src/form/form-editor/macros/types.js'
 * @import { NationalGridFieldNumberFieldComponent } from '~/src/components/types.js'
 */
