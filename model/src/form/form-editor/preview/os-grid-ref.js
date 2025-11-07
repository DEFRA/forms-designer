import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { createLocationFieldModel } from '~/src/form/form-editor/preview/location-helpers.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class OsGridRefComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {OsGridRefFieldComponent} component
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

export class OsGridRefQuestion extends Question {
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
   * @returns {OsGridRefModel}
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
 * @import { OsGridRefModel } from '~/src/form/form-editor/macros/types.js'
 * @import { OsGridRefFieldComponent } from '~/src/components/types.js'
 */
