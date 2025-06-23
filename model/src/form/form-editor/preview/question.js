import { ComponentType } from '~/src/components/enums.js'
import { ComponentElements } from '~/src/form/form-editor/preview/component-elements.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

/**
 * @implements {QuestionElements}
 */
export class QuestionComponentElements extends ComponentElements {
  /**
   * @type {FormComponentsDef}
   * @protected
   */
  _component
  /**
   * @param {FormComponentsDef} component
   */
  constructor(component, largeTitle = true) {
    super(component, largeTitle)
    this._component = component
  }

  /**
   * @protected
   * @returns {BaseSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      hintText: this._component.hint ?? '',
      shortDesc: this._component.shortDescription ?? ''
    }
  }
}

/**
 * @class Question
 * @classdesc
 * A data object that has access to the underlying data via the QuestionElements object interface
 * and the templating mechanism to render the HTML for the data.
 *
 * It does not have access to the DOM, but has access to QuestionElements.setPreviewHTML to update
 * the HTML.  Question classes should only be responsible for data and rendering as are reused in the
 * server side.
 */
export class Question extends PreviewComponent {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.TextField

  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'textfield.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'inputField'

  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    const { hintText } = htmlElements.values
    /**
     * @type {string}
     * @private
     */
    this._hintText = hintText
  }

  /**
   * @type {DefaultComponent}
   * @protected
   */
  get hint() {
    const text =
      this._highlight === 'hintText' && !this._hintText.length
        ? 'Hint text'
        : this._hintText

    return {
      text,
      classes: this.getHighlight('hintText')
    }
  }

  /**
   * @returns {QuestionBaseModel}
   * @protected
   */
  _renderInput() {
    return { ...super._renderInput(), label: this.label, hint: this.hint }
  }

  /**
   * @type {string}
   */
  get hintText() {
    return this._hintText
  }

  /**
   * @param {string} value
   */
  set hintText(value) {
    this._hintText = value
    this.render()
  }
}

/**
 * @import { ListenerRow, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { FormComponentsDef, ContentComponentsDef, ComponentDef } from '~/src/components/types.js'
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
