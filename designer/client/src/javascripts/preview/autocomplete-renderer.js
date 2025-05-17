// @ts-expect-error no types set for accessible autocomplete
import accessibleAutocomplete from 'accessible-autocomplete'

import { NunjucksRenderer } from '~/src/javascripts/preview/nunjucks-renderer.js'

/**
 * @implements {QuestionRenderer}
 */
export class AutocompleteRenderer extends NunjucksRenderer {
  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   * @protected
   */
  _render(questionTemplate, questionBaseModel) {
    /**
     * @type {RenderContext}
     */
    const renderContext = { model: questionBaseModel }
    const html = NunjucksRenderer.buildHTML(questionTemplate, renderContext)
    const autoCompletePreviewContainer = /** @type {HTMLDivElement} */ (
      document.createElement('div')
    )
    autoCompletePreviewContainer.innerHTML = html.trim()
    const autoCompleteField =
      autoCompletePreviewContainer.querySelector('#autoCompleteField')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    accessibleAutocomplete.enhanceSelectElement({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      selectElement: autoCompleteField
    })

    const innerEL = /** @type {HTMLElement} */ (
      autoCompletePreviewContainer.firstElementChild
    )

    this._questionElements.setPreviewDOM(innerEL)
  }
}

/**
 * @import { QuestionRenderer, QuestionBaseModel, RenderContext } from '@defra/forms-model'
 */
