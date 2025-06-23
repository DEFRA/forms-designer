/**
 * @implements {QuestionElements}
 */
export class ComponentElements {
  /**
   * @type {ComponentDef}
   * @protected
   */
  _component
  /**
   * @type {boolean}
   * @private
   */
  _largeTitle = true
  /**
   * @param {ComponentDef} component
   * @param {boolean} [largeTitle]
   */
  constructor(component, largeTitle = true) {
    this._component = component
    this._largeTitle = largeTitle
  }

  /**
   * @protected
   * @returns {BaseSettings}
   */
  _getValues() {
    const required = this._component.options?.required ?? true

    return {
      question: this._component.title,
      hintText: '',
      optional: !required,
      shortDesc: '',
      items: [],
      content: '',
      largeTitle: this._largeTitle
    }
  }

  /**
   * @returns {BaseSettings}
   */
  get values() {
    const values = this._getValues()
    return values
  }

  /**
   * @param {HTMLElement} _element
   */
  setPreviewDOM(_element) {
    throw new Error('Not implemented')
  }

  /**
   * @param {string} _value
   */
  setPreviewHTML(_value) {
    throw new Error('Not implemented')
  }
}

/**
 * @import { ListenerRow, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { FormComponentsDef, ContentComponentsDef, ComponentDef } from '~/src/components/types.js'
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
