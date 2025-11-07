import { ComponentType } from '~/src/components/enums.js'
import {
  createFieldClasses,
  createLocationFieldModel
} from '~/src/form/form-editor/preview/location-helpers.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class LatLongComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {LatLongFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._instructionText = component.options.instructionText ?? ''
  }

  /**
   * @protected
   * @returns {LocationSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      instructionText: this._instructionText
    }
  }
}

export class LatLongQuestion extends Question {
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
  _instructionText = ''

  /**
   * @param {LocationElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._instructionText = htmlElements.values.instructionText
  }

  get instructionText() {
    return this._instructionText
  }

  /**
   * @param {string} val
   */
  set instructionText(val) {
    this._instructionText = val
    this.render()
  }

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
