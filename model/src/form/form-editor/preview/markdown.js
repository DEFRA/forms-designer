import { ComponentType } from '~/src/components/enums.js'
import { Content } from '~/src/form/form-editor/preview/content.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { markdownToHtml } from '~/src/utils/markdown.js'

/**
 * @class Markdown
 * @classdesc
 * Base of Content preview classes
 */
export class Markdown extends Content {
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'markdown'
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.Markdown

  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'markdown.njk'
  /**
   * @param {QuestionElements} htmlElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(htmlElements, questionRenderer) {
    super(htmlElements, questionRenderer)
    const { content } = htmlElements.values
    this._content = markdownToHtml(content, { startingHeaderLevel: 2 })
  }

  /**
   * @param {string} value
   * @protected
   */
  _setContent(value) {
    super._setContent(markdownToHtml(value, { startingHeaderLevel: 2 }))
  }
}

/**
 * @import { ListenerRow, BaseSettings, QuestionElements, QuestionBaseModel, GovukFieldset, DefaultComponent, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 * @import { FormComponentsDef, ContentComponentsDef, ComponentDef } from '~/src/components/types.js'
 * @import { ListElement, ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
