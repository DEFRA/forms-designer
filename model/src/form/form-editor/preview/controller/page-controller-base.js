import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { ContentElements } from '~/src/form/form-editor/preview/content.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { hasComponents, hasRepeater } from '~/src/pages/helpers.js'

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
 * Enum for Highlight classes
 * @readonly
 * @enum {string}
 */
const HighlightClass = {
  TITLE: 'title',
  GUIDANCE: 'guidance',
  REPEATER: 'repeater'
}

/**
 * @implements {PageOverviewElements}
 */
export class PagePreviewElements {
  /**
   * @type {Page | { title: string }}
   * @private
   */
  _page = {
    title: ''
  }

  /**
   * @param {Page|undefined} page
   */
  constructor(page) {
    if (page !== undefined) {
      this._page = page
    }
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

  get addHeading() {
    return this._page.title.length > 0
  }

  get repeatQuestion() {
    if (hasRepeater(this._page)) {
      return this._page.repeat.options.title
    }
    return undefined
  }

  get hasRepeater() {
    return hasRepeater(this._page)
  }
}

/**
 * @abstract
 * @implements {PagePreviewPanelMacro}
 */
export class PreviewPageControllerBase {
  static PATH = 'preview-controllers/'
  /**
   * @type {string}
   * @protected
   */
  _pageTemplate = PreviewPageControllerBase.PATH + 'page-controller.njk'
  /**
   * @protected
   * @type {Question[]}
   */
  _components = []
  /**
   * @type {boolean}
   * @protected
   */
  _showTitle = true
  /**
   * @protected
   * @type {string}
   */
  _title = ''
  /**
   *
   * @type {PageRenderer}
   */
  #pageRenderer
  /**
   * @type { undefined | HighlightClass }
   * @protected
   */
  _highlighted = undefined
  /**
   * @type {string}
   * @protected
   */
  _guidanceText = ''
  /**
   * @type { string }
   * @protected
   */
  _sectionTitle = ''
  /**
   * @type {Markdown}
   * @protected
   */
  _emptyGuidance = PreviewPageControllerBase.createGuidanceComponent()
  /**
   * @type {Markdown}
   * @protected
   */
  _guidanceComponent = PreviewPageControllerBase.createGuidanceComponent()
  /**
   * @protected
   * @type {boolean}
   */
  _isRepeater = false

  /**
   * @param {PagePreviewBaseElements} elements
   * @param {PageRenderer} renderer
   */
  constructor(elements, renderer) {
    this._guidanceText = elements.guidance
    this.#pageRenderer = renderer
    this._title = elements.heading
  }

  /**
   * @type {typeof HighlightClass}
   */
  static HighlightClass = HighlightClass

  /**
   * @returns {Markdown[]}
   * @protected
   */
  _getGuidanceComponents() {
    if (this._guidanceText.length) {
      return [this._guidanceComponent]
    }
    if (this._highlighted === 'guidance') {
      return [this._emptyGuidance]
    }
    return []
  }

  /**
   * @returns {Markdown[]}
   * @protected
   */
  get _guidanceComponents() {
    return this._getGuidanceComponents()
  }

  /**
   * @returns {PagePreviewComponent[]}
   */
  get components() {
    const componentsWithGuidance = /** @type {Question[]} */ ([
      ...this._guidanceComponents,
      ...this._components
    ])

    return componentsWithGuidance.map((component) => {
      return {
        model: component.renderInput,
        questionType: component.componentType
      }
    })
  }

  /**
   * @returns {string}
   * @protected
   */
  _getGuidanceText() {
    return this._guidanceText
  }

  set guidanceText(text) {
    this._guidanceText = text
    this._guidanceComponent.content = text
    this.render()
  }

  /**
   * @returns {string}
   */
  get guidanceText() {
    return this._getGuidanceText()
  }

  get guidance() {
    return {
      text: this.guidanceText,
      classes: this._isHighlighted(HighlightClass.GUIDANCE)
    }
  }

  /**
   * @param {boolean} showTitle
   */
  set showTitle(showTitle) {
    this._showTitle = showTitle
    this.render()
  }

  get showTitle() {
    return this._showTitle
  }

  /**
   * @returns {{ text: string, classes: string }}
   */
  get pageTitle() {
    return {
      text: this.title,
      classes: this._isHighlighted(HighlightClass.TITLE)
    }
  }

  setRepeater() {
    this._isRepeater = true
    this.render()
  }

  unsetRepeater() {
    this._isRepeater = false
    this.render()
  }

  get isRepeater() {
    return this._isRepeater
  }

  render() {
    this.#pageRenderer.render(this._pageTemplate, this)
  }

  /**
   * @returns {string}
   * @protected
   */
  _getTitle() {
    if (this._title.length) {
      return this._title
    }
    return 'Page heading'
  }

  /**
   * @returns {string}
   */
  get title() {
    return this._getTitle()
  }

  /**
   * @param {string} value
   */
  set title(value) {
    this._title = value
    this.render()
  }

  highlightTitle() {
    this.setHighLighted(HighlightClass.TITLE)
  }

  /**
   * @returns {{classes: string, text: string} | undefined}
   */
  get sectionTitle() {
    if (this.sectionTitleText === undefined) {
      return undefined
    }
    return {
      classes: this._isHighlighted(HighlightClass.REPEATER),
      text: this.sectionTitleText
    }
  }

  /**
   * @returns {string|undefined}
   * @protected
   */
  _getSectionTitleText() {
    return this._sectionTitle
  }

  /**
   * @param {string | undefined} val
   */
  set sectionTitleText(val) {
    this._sectionTitle = val ?? ''
    this.render()
  }

  get sectionTitleText() {
    return this._getSectionTitleText()
  }

  /**
   * Creates a dummy component for when guidance is highlighted
   * but no guidance text exists
   * @returns {Markdown}
   */
  static createGuidanceComponent(highlight = true) {
    const guidanceElement = new ContentElements({
      type: ComponentType.Markdown,
      title: 'Guidance component',
      name: 'guidanceComponent',
      content: 'Guidance text',
      options: {}
    })
    const guidanceComponent = new Markdown(guidanceElement, questionRenderer)

    if (highlight) {
      guidanceComponent.highlightContent()
    }
    return guidanceComponent
  }

  highlightGuidance() {
    this._guidanceComponent.highlightContent()
    this.setHighLighted(HighlightClass.GUIDANCE)
  }

  /**
   * @param {HighlightClass} highlightSection
   */
  setHighLighted(highlightSection) {
    this._highlighted = highlightSection
    this.render()
  }

  clearHighlight() {
    this._highlighted = undefined

    this._guidanceComponent.unHighlightContent()
    this.render()
  }

  /**
   * @param {string} field
   * @protected
   * @returns {string}
   */
  _isHighlighted(field) {
    return this._highlighted === field ? HIGHLIGHT_CLASS : ''
  }
}

/**
 * @import { PageRenderer, PageOverviewElements, PagePreviewBaseElements, QuestionRenderer, QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef, MarkdownComponent } from '~/src/components/types.js'
 * @import { PagePreviewComponent, PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 */
