import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'

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
   */
  #guidanceText = ''

  /**
   * @param {Question[]} components
   * @param {PageOverviewElements} elements
   * @param {PageRenderer} renderer
   */
  constructor(components, elements, renderer) {
    this._components = components
    this.#title = elements.heading
    this.#guidanceText = elements.guidance
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
    this.#guidanceText = text
    this.render()
  }

  get guidanceText() {
    return this.#guidanceText
  }

  get guidance() {
    return {
      text: this.#guidanceText,
      classes: this._highlighted === 'guidance' ? HIGHLIGHT_CLASS : ''
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
    this.setHightlighted('guidance')
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
    this.render()
  }
}

/**
 * @import { PageRenderer, PageOverviewElements } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PagePreviewComponent, PagePreviewPanelMacro } from '~/src/form/form-editor/macros/types.js'
 */
