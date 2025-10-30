import { PreviewPageControllerBase } from '~/src/form/form-editor/preview/controller/page-controller-base.js'
import { mapComponentToPreviewQuestion } from '~/src/form/form-editor/preview/helpers.js'
import { Markdown } from '~/src/form/form-editor/preview/markdown.js'

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

export class PreviewPageController extends PreviewPageControllerBase {
  static PATH = PreviewPageControllerBase.PATH
  /**
   * @protected
   * @type {Question[]}
   */
  _components = []

  /**
   * @param {ComponentDef[]} components
   * @param {PageOverviewElements} elements
   * @param {FormDefinition} definition
   * @param {PageRenderer} renderer
   */
  constructor(components, elements, definition, renderer) {
    super(elements, renderer)
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
    this._sectionTitle = elements.repeatQuestion ?? ''
    this._isRepeater = elements.hasRepeater
  }

  /**
   * @type {typeof PreviewPageControllerBase.HighlightClass}
   */
  static HighlightClass = PreviewPageControllerBase.HighlightClass

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
    if (this._title.trim() === this._components[0]?.question?.trim()) {
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

  /**
   * @returns {boolean}
   */
  get titleAndFirstTitleSame() {
    return (
      this._components.length > 0 &&
      this._title.trim() === this._components[0]?.question?.trim() &&
      this.components.length === 1 &&
      this._highlighted !== 'title'
    )
  }

  /**
   * @returns {string}
   * @protected
   */
  _getTitle() {
    if (!this._showTitle || this.titleAndFirstTitleSame) {
      return ''
    }
    return super._getTitle()
  }

  /**
   * @returns {string}
   * @protected
   */
  _getGuidanceText() {
    if (!this._showTitle) {
      return ''
    }
    return super._getGuidanceText()
  }

  get repeaterText() {
    if (!this._isRepeater) {
      return undefined
    }
    if (!this._sectionTitle.length) {
      return 'Question set name'
    }
    return this._sectionTitle + ' 1'
  }

  /**
   * @returns {string|undefined}
   * @protected
   */
  _getSectionTitleText() {
    if (this._isRepeater) {
      return this.repeaterText
    }
    return undefined
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
    return PreviewPageControllerBase.createGuidanceComponent()
  }
}

/**
 * @import { PageRenderer, PageOverviewElements, QuestionRenderer, QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 * @import { Question } from '~/src/form/form-editor/preview/question.js'
 * @import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 * @import { PagePreviewComponent } from '~/src/form/form-editor/macros/types.js'
 */
