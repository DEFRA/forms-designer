import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * Base class for location question component preview elements with instruction text support
 * @implements {QuestionElements}
 */
export class LocationQuestionComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {any} component - Component with options.instructionText
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

/**
 * Base class for location questions with instruction text support
 */
export class LocationQuestion extends Question {
  /**
   * @type {string}
   * @protected
   */
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
}

/**
 * @import { LocationSettings, LocationElements, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 */
