import { ComponentElements } from '~/src/form/form-editor/preview/component-elements.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

/**
 * @implements {QuestionElements}
 */
export class ContentElements extends ComponentElements {
  /**
   * @type {Exclude<ContentComponentsDef, ListComponent>}
   * @protected
   */
  _component
  /**
   * @param {Exclude<ContentComponentsDef, ListComponent>} component
   */
  constructor(component) {
    super(component)
    this._component = component
  }

  /**
   * @protected
   * @returns {BaseSettings}
   */
  _getValues() {
    return {
      ...super._getValues(),
      content: this._component.content
    }
  }
}

/**
 * @abstract
 * @class Content
 * @classdesc
 * Base of Content preview classes
 */
export class Content extends PreviewComponent {
  /**
   * @type {string}
   * @protected
   */
  _content

  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    const { content } = htmlElements.values

    this._content = content
  }

  /**
   * @returns {QuestionBaseModel}
   * @protected
   */
  _renderInput() {
    return {
      ...super._renderInput(),
      content: this.content
    }
  }

  /**
   * @param {string} value
   * @protected
   */
  _setContent(value) {
    this._content = value
  }

  /**
   * @returns {string}
   */
  get content() {
    return this._content
  }

  set content(value) {
    this._setContent(value)
    this.render()
  }
}

/**
 * @import { ListenerRow, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { FormComponentsDef, ListComponent, ContentComponentsDef, ComponentDef } from '~/src/components/types.js'
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
