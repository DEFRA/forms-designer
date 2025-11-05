import { ComponentType } from '~/src/components/enums.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import {
  Question,
  QuestionComponentElements
} from '~/src/form/form-editor/preview/question.js'

/**
 * @implements {QuestionElements}
 */
export class DeclarationComponentPreviewElements extends QuestionComponentElements {
  /**
   * @param {DeclarationFieldComponent} component
   */
  constructor(component) {
    super(component)
    this._declarationText = component.content
  }

  /**
   * @protected
   * @returns {DeclarationSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      declarationText: this._declarationText
    }
  }
}

export class DeclarationQuestion extends Question {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.DeclarationField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'declarationfield.njk'
  _fieldName = 'DeclarationField'
  _declarationText = ''

  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    this._declarationText = htmlElements.values.declarationText ?? ''
  }

  get declarationText() {
    return this._declarationText
  }

  /**
   * @param {string} val
   */
  set declarationText(val) {
    this._declarationText = val
    this.render()
  }
}

/**
 * @import { DeclarationSettings, QuestionElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { DeclarationFieldComponent } from '~/src/components/types.js'
 */
