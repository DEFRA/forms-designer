import { hasFormField } from '~/src/components/helpers.js'
import { PreviewPageControllerBase } from '~/src/form/form-editor/preview/controller/page-controller-base.js'
import { hasComponents } from '~/src/pages/helpers.js'

const EXAMPLE_TEXT = ''

export class SummaryPageController extends PreviewPageControllerBase {
  /**
   * @type {string}
   * @protected
   */
  _pageTemplate = PreviewPageControllerBase.PATH + 'summary-controller.njk'
  /**
   * @type {FormComponentsDef[]}
   * @private
   */
  _componentDefs = []
  /**
   * @param {PagePreviewBaseElements} elements
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
}

/**
 * @import { ComponentDef, ContentComponentsDef, ListComponent, FormComponentsDef } from '~/src/components/types.js'
 * @import { FormDefinition } from '~/src/form/form-definition/types.js'
 * @import { PageRenderer, PagePreviewBaseElements } from '~/src/form/form-editor/preview/types.js'
 * @import { SummaryRowActionItem, SummaryRow } from '~/src/form/form-editor/macros/types.js'
 */
