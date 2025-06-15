import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { mapComponentToPreviewQuestion } from '~/src/form/form-editor/preview/helpers.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { hasComponents } from '~/src/pages/helpers.js'
/**
 * @type {QuestionRenderer}
 */
const questionRenderer = {
  /**
   * @param {string} _questionTemplate
   * @param {QuestionBaseModel} _questionBaseModel
   */
  render(_questionTemplate, _questionBaseModel) {
    //
  }
}

/**
 * @implements {PageOverviewElements}
 */
export class PagePreviewElements {
  /**
   * @type {Page}
   * @private
   */
  _page
  /**
   * @param {Page} page
   */
  constructor(page) {
    this._page = page
  }

  get heading() {
    return this._page.title
  }

  get guidance() {
    if (!hasComponents(this._page) || !this._page.components.length) {
      return ''
    }

    const [possibleGuidanceComponent] = this._page.components

    return possibleGuidanceComponent.type === ComponentType.Markdown
      ? possibleGuidanceComponent.content
      : ''
  }
}

/**
 * @implements {PagePreviewPanelMacro}
 */
export class PreviewPageController {
  static PATH = 'preview-controllers/'
  /**
   * @type {string}
   * @protected
   */
  _pageTemplate = PreviewPageController.PATH + 'page-controller.njk'
  /**
   * @protected
   * @type {Question[]}
   */
  _components = []
  /**
   * @type {string}
   */
  #title = ''
  /**
   *
   * @type {PageRenderer}
   */
  #pageRenderer
  /**
   * @type { undefined | 'title' | 'guidance'}
   * @protected
   */
  _highlighted = undefined

  /**
   * @param {ComponentDef[]} components
   * @param {PageOverviewElements} elements
   * @param {FormDefinition} definition
   * @param {PageRenderer} renderer
   */
  constructor(components, elements, definition, renderer) {
    this._components = components.map(
      mapComponentToPreviewQuestion(questionRenderer, definition)
    )

    this.#title = elements.heading
    this.#pageRenderer = renderer
  }

  /**
   * @returns {PagePreviewComponent[]}
   */
  get components() {
    return this._components.map((component) => ({
      model: component.renderInput,
      questionType: component.componentType
    }))
  }

  set guidanceText(text) {
    this._guidanceComponent.content = text
    this.render()
  }

  get guidanceText() {
    return this._guidanceComponent ? this._guidanceComponent.content : ''
  }

  get guidanceClasses() {
    return this._guidanceComponent
      ? this._guidanceComponent.renderInput.classes
      : ''
  }

  /**
   * @returns {undefined|Markdown}
   * @private
   */
  get _guidanceComponent() {
    const [firstComponent] = this._components
    return firstComponent instanceof Markdown ? firstComponent : undefined
  }

  get guidance() {
    return {
      text: this.guidanceText,
      classes: this.guidanceClasses
    }
  }

  /**
   * @private
   * @returns {string}
   */
  _fallBackTitle() {
    return this._components[0]?.question ?? ''
  }

  /**
   * @returns {{ text: string, classes: string }}
   */
  get pageTitle() {
    return {
      text: this.title,
      classes: this._highlighted === 'title' ? HIGHLIGHT_CLASS : ''
    }
  }

  render() {
    this.#pageRenderer.render(this._pageTemplate, this)
  }

  /**
   * @returns {string}
   */
  get title() {
    return this.#title.length ? this.#title : this._fallBackTitle()
  }

  /**
   * @param {string} value
   */
  set title(value) {
    this.#title = value
    this.render()
  }

  highlightTitle() {
    this.setHightlighted('title')
  }

  highlightGuidance() {
    this._guidanceComponent?.highlightContent()
    this.render()
  }

  /**
   * @param {'title'|'guidance'} highlightSection
   */
  setHightlighted(highlightSection) {
    this._highlighted = highlightSection
    this.render()
  }

  clearHighlight() {
    this._highlighted = undefined
    this._guidanceComponent?.unHighlightContent()
    this.render()
  }
}

/**
 * @import { PageRenderer, PageOverviewElements, QuestionRenderer, QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 * @import { PagePreviewComponent, PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 */
