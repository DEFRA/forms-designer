import { hasFormField } from '~/src/components/helpers.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { PreviewPageControllerBase } from '~/src/form/form-editor/preview/controller/page-controller-base.js'
import { hasComponents } from '~/src/pages/helpers.js'

const EXAMPLE_TEXT = 'Answer goes here'

export class SummaryPageController extends PreviewPageControllerBase {
  /**
   * @type {string}
   * @protected
   */
  _pageTemplate = PreviewPageControllerBase.PATH + 'summary-controller.njk'
  /**
   * @type {Markdown}
   * @protected
   */
  _guidanceComponent = PreviewPageControllerBase.createGuidanceComponent(false)
  /**
   * @type {FormComponentsDef[]}
   * @private
   */
  _componentDefs = []
  /**
   * @type {boolean}
   * @private
   */
  _makeDeclaration = false
  /**
   * @type {boolean}
   * @private
   */
  _showConfirmationEmail = false
  /**
   * @type {boolean}
   * @private
   */
  _isConfirmationEmailSettingsPanel = false
  /**
   * @type {SectionForPreview[]}
   * @private
   */
  _sections = []
  /**
   * @type {Array<{ title: string }>}
   * @private
   */
  _unassignedPages = []

  /**
   * @param {SummaryPageElements} elements
   * @param {FormDefinition} formDefinition
   * @param {PageRenderer} renderer
   */
  constructor(elements, formDefinition, renderer) {
    super(elements, renderer)
    this._componentDefs = formDefinition.pages.flatMap((page) => {
      if (hasComponents(page)) {
        return page.components.filter(hasFormField)
      }
      return []
    })
    this._makeDeclaration = elements.declaration
    this._showConfirmationEmail = elements.showConfirmationEmail
    this._guidanceComponent.content = elements.guidance
    this._isConfirmationEmailSettingsPanel =
      elements.isConfirmationEmailSettingsPanel
    this._sections = elements.sections ?? []
    this._unassignedPages = elements.unassignedPages ?? []
  }

  /**
   * @returns {{ rows: SummaryRow[] }}
   */
  get componentRows() {
    const rows = this._componentDefs.map((component) => {
      const summaryRowHeading = component.shortDescription ?? ''
      return {
        key: { text: summaryRowHeading },
        value: { text: EXAMPLE_TEXT },
        actions: {
          items: [
            { href: '#', text: 'Change', visuallyHiddenText: summaryRowHeading }
          ]
        }
      }
    })
    return {
      rows
    }
  }

  /**
   * @returns {{ text: string; classes: string }}
   */
  get pageTitle() {
    return {
      text: 'Check your answers before sending your form',
      classes: ''
    }
  }

  get guidance() {
    if (!this._makeDeclaration) {
      return {
        classes: '',
        text: ''
      }
    }
    const guidanceHighlighted = this._highlighted === 'guidance'
    const classes = guidanceHighlighted ? HIGHLIGHT_CLASS : ''
    let text = this._guidanceText.length ? this._guidanceText : ''

    if (!text.length && guidanceHighlighted) {
      text = 'Declaration text'
    }
    return {
      text,
      classes
    }
  }

  /**
   * @param {string} declarationText
   */
  set declarationText(declarationText) {
    this.guidanceText = declarationText
  }

  get declarationText() {
    return this.guidanceText
  }

  get declaration() {
    return this.guidance
  }

  get isConfirmationEmailSettingsPanel() {
    return this._isConfirmationEmailSettingsPanel
  }

  setMakeDeclaration() {
    this._makeDeclaration = true
    this.render()
  }

  unsetMakeDeclaration() {
    this._makeDeclaration = false
    this.render()
  }

  get makeDeclaration() {
    return this._makeDeclaration
  }

  highlightDeclaration() {
    this.highlightGuidance()
  }

  unhighlightDeclaration() {
    this.clearHighlight()
  }

  get showConfirmationEmail() {
    return this._showConfirmationEmail
  }

  /**
   * @returns {SectionForPreview[]}
   */
  get sections() {
    return this._sections
  }

  /**
   * @returns {Array<{ title: string }>}
   */
  get unassignedPages() {
    return this._unassignedPages
  }

  /**
   * @returns {Markdown[]}
   * @protected
   */
  _getGuidanceComponents() {
    if (!this._makeDeclaration) {
      return []
    }
    return super._getGuidanceComponents()
  }

  get buttonText() {
    return this.makeDeclaration ? 'Accept and send' : 'Send'
  }

  setShowConfirmationEmail() {
    this._showConfirmationEmail = true
    this.render()
  }

  unsetShowConfirmationEmail() {
    this._showConfirmationEmail = false
    this.render()
  }
}

/**
 * @import { ComponentDef, ContentComponentsDef, ListComponent, FormComponentsDef } from '~/src/components/types.js'
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { PageRenderer, PagePreviewBaseElements, SummaryPageElements, SectionForPreview } from '~/src/form/form-editor/preview/types.js'
 * @import { SummaryRowActionItem, SummaryRow } from '~/src/form/form-editor/macros/types.js'
 * @import { Markdown } from '~/src/form/form-editor/preview/markdown.js'
 */
