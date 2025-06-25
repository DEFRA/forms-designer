import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { ContentElements } from '~/src/form/form-editor/preview/content.js'
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

  get addHeading() {
    return this._page.title.length > 0
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
   * @type {string}
   * @private
   */
  _guidanceText = ''
  /**
   * @type {Markdown}
   * @private
   */
  _emptyGuidance = PreviewPageController.createGuidanceComponent()
  /**
   *
   * @type {Markdown}
   * @protected
   */
  _guidanceComponent
  /**
   * @type {boolean}
   * @private
   */
  _showTitle = true
  /**
   * @param {ComponentDef[]} components
   * @param {PageOverviewElements} elements
   * @param {FormDefinition} definition
   * @param {PageRenderer} renderer
   */
  constructor(components, elements, definition, renderer) {
    const questions = components.map(
      mapComponentToPreviewQuestion(
        questionRenderer,
        definition,
        elements.heading.length > 0
      )
    )
    const firstQuestion = /** @type { Markdown | undefined | Question }  */ (
      questions.shift()
    )

    this._guidanceComponent =
      PreviewPageController.getOrCreateGuidanceComponent(firstQuestion)
    this._guidanceText = elements.guidance
    this._components = this.#constructComponents(firstQuestion, questions)
    this._showTitle = elements.addHeading

    this.#pageRenderer = renderer
    this.#title = elements.heading
  }

  /**
   * @param { Question | Markdown | undefined} firstQuestion
   * @param {Question[]} questions
   * @returns {Question[]}
   */
  #constructComponents(firstQuestion, questions) {
    return firstQuestion instanceof Markdown || firstQuestion === undefined
      ? questions
      : [firstQuestion, ...questions]
  }

  /**
   * @returns {Markdown[]}
   * @private
   */
  get _guidanceComponents() {
    if (this._guidanceText.length) {
      return [this._guidanceComponent]
    }
    if (this._highlighted === 'guidance') {
      return [this._emptyGuidance]
    }
    return []
  }

  /**
   * @returns {PagePreviewComponent[]}
   */
  get components() {
    const componentsWithGuidance = /** @type {Question[]} */ ([
      ...this._guidanceComponents,
      ...this._components
    ])

    return componentsWithGuidance.map((component) => ({
      model: component.renderInput,
      questionType: component.componentType
    }))
  }

  set guidanceText(text) {
    this._guidanceText = text
    this._guidanceComponent.content = text
    this.render()
  }

  get guidanceText() {
    if (!this._showTitle) {
      return ''
    }
    return this._guidanceText
  }

  /**
   *
   * @param {boolean} showTitle
   */
  set showTitle(showTitle) {
    this._showTitle = showTitle
    this.render()
  }

  get showTitle() {
    return this._showTitle
  }

  get guidance() {
    return {
      text: this.guidanceText,
      classes: this._highlighted === 'guidance' ? 'highlight' : ''
    }
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
    if (!this._showTitle) {
      return ''
    }
    if (this.#title.length) {
      return this.#title
    }
    return 'Page heading'
  }

  /**
   * @param {string} value
   */
  set title(value) {
    this.#title = value
    this.render()
  }

  highlightTitle() {
    this.setHighLighted('title')
  }

  /**
   * Creates a dummy component for when guidance is highlighted
   * but no guidance text exists
   * @returns {Markdown}
   */
  static createGuidanceComponent() {
    const guidanceElement = new ContentElements({
      type: ComponentType.Markdown,
      title: 'Guidance component',
      name: 'guidanceComponent',
      content: 'Guidance text',
      options: {}
    })
    const guidanceComponent = new Markdown(guidanceElement, questionRenderer)

    // the dummy component should always be highlighted
    guidanceComponent.highlightContent()
    return guidanceComponent
  }

  /**
   * Helper method to return the guidance or a new one
   * @param { Markdown | Question | undefined } guidanceComponent
   * @returns {Markdown}
   * @private
   */
  static getOrCreateGuidanceComponent(guidanceComponent) {
    if (guidanceComponent instanceof Markdown) {
      return guidanceComponent
    }
    return PreviewPageController.createGuidanceComponent()
  }

  highlightGuidance() {
    this._guidanceComponent.highlightContent()
    this.setHighLighted('guidance')
  }

  /**
   * @param {'title'|'guidance'} highlightSection
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
}

/**
 * @import { PageRenderer, PageOverviewElements, QuestionRenderer, QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef, MarkdownComponent } from '~/src/components/types.js'
 * @import { PagePreviewComponent, PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 */
