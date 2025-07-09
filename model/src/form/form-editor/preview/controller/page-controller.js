import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { ContentElements } from '~/src/form/form-editor/preview/content.js'
import { mapComponentToPreviewQuestion } from '~/src/form/form-editor/preview/helpers.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
import { hasRepeater } from '~/src/index.js'
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
 * Enum for tri-state values.
 * @readonly
 * @enum {string}
 */
const HighlightClass = {
  /** The true value */
  TITLE: 'title',
  GUIDANCE: 'guidance',
  REPEATER: 'repeater'
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
   * @type { undefined | HighlightClass }
   * @protected
   */
  _highlighted = undefined
  /**
   * @type {string}
   * @private
   */
  _guidanceText = ''
  /**
   * @type { string }
   * @protected
   */
  _sectionTitle = ''
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
   * @type {boolean}
   */
  #isRepeater = false

  /**
   * @param {ComponentDef[]} components
   * @param {PageOverviewElements} elements
   * @param {FormDefinition} definition
   * @param {PageRenderer} renderer
   */
  constructor(components, elements, definition, renderer) {
    const questions = components.map(
      mapComponentToPreviewQuestion(questionRenderer, definition)
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
    this._sectionTitle = elements.repeatQuestion ?? ''
    this.#isRepeater = elements.hasRepeater
  }

  /**
   * @type {typeof HighlightClass}
   */
  static HighlightClass = HighlightClass

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

    return componentsWithGuidance.map((component) => {
      return {
        model: this._overrideComponentHeading(component),
        questionType: component.componentType
      }
    })
  }

  /**
   * @returns {boolean}
   */
  get showLargeTitle() {
    const componentsLength =
      this._components.length + this._guidanceComponents.length

    if (componentsLength > 1 || this._highlighted === 'title') {
      return false
    }
    // |_ one component and title not highlighted
    if (this.#title.trim() === this._components[0].question.trim()) {
      return true
    }
    // titles not the same

    return !this._showTitle // add page heading deselected?
  }

  /**
   * @param {PreviewComponent} component
   * @returns {QuestionBaseModel}
   */
  _overrideComponentHeading(component) {
    const largeTitle = this.showLargeTitle

    const fieldset = component.renderInput.fieldset
      ? {
          fieldset: {
            legend: {
              ...component.renderInput.fieldset.legend,
              classes: largeTitle
                ? 'govuk-fieldset__legend--l'
                : 'govuk-fieldset__legend--m'
            }
          }
        }
      : {}

    const label = component.renderInput.label
      ? {
          label: {
            ...component.renderInput.label,
            classes: largeTitle ? 'govuk-label--l' : 'govuk-label--m'
          }
        }
      : {}

    return {
      ...component.renderInput,
      ...fieldset,
      ...label
    }
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
      classes: this.#isHighlighted(HighlightClass.GUIDANCE)
    }
  }

  /**
   * @returns {{ text: string, classes: string }}
   */
  get pageTitle() {
    return {
      text: this.title,
      classes: this.#isHighlighted(HighlightClass.TITLE)
    }
  }

  render() {
    this.#pageRenderer.render(this._pageTemplate, this)
  }

  /**
   * @returns {boolean}
   */
  get titleAndFirstTitleSame() {
    return (
      this._components.length > 0 &&
      this.#title.trim() === this._components[0].question.trim() &&
      this.components.length === 1 &&
      this._highlighted !== 'title'
    )
  }

  /**
   * @returns {string}
   */
  get title() {
    if (!this._showTitle || this.titleAndFirstTitleSame) {
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
    this.setHighLighted(HighlightClass.TITLE)
  }

  setRepeater() {
    this.#isRepeater = true
    this.render()
  }

  unsetRepeater() {
    this.#isRepeater = false
    this.render()
  }

  get isRepeater() {
    return this.#isRepeater
  }

  /**
   * @returns {{classes: string, text: string} | undefined}
   */
  get sectionTitle() {
    if (this.sectionTitleText === undefined) {
      return undefined
    }
    return {
      classes: this.#isHighlighted(HighlightClass.REPEATER),
      text: this.sectionTitleText
    }
  }

  get repeaterText() {
    if (!this.#isRepeater) {
      return undefined
    }
    if (!this._sectionTitle.length) {
      return 'Question set name'
    }
    return this._sectionTitle + ' 1'
  }

  /**
   * @param {string | undefined} val
   */
  set sectionTitleText(val) {
    this._sectionTitle = val ?? ''
    this.render()
  }

  get sectionTitleText() {
    if (this.#isRepeater) {
      return this.repeaterText
    }
    return undefined
  }

  get repeaterButton() {
    if (this.repeaterButtonText === undefined) {
      return undefined
    }
    return {
      classes: this.#isHighlighted(HighlightClass.REPEATER),
      text: this.repeaterButtonText
    }
  }

  get repeaterButtonText() {
    if (!this.#isRepeater) {
      return undefined
    }

    if (this._sectionTitle === '') {
      return '[question set name]'
    }

    const [firstToken, ...rest] = this._sectionTitle
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const restOfStr = rest ? rest.join('') : ''
    return firstToken.toLowerCase() + restOfStr
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
   * @returns {string}
   */
  #isHighlighted(field) {
    return this._highlighted === field ? HIGHLIGHT_CLASS : ''
  }
}

/**
 * @import { PageRenderer, PageOverviewElements, QuestionRenderer, QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef, MarkdownComponent } from '~/src/components/types.js'
 * @import { PagePreviewComponent, PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 */
