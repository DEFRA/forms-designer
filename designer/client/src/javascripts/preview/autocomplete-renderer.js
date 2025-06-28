// @ts-expect-error no types set for accessible autocomplete
import accessibleAutocomplete from 'accessible-autocomplete'

import { NunjucksRendererBase } from '~/src/javascripts/preview/nunjucks-renderer.js'

export class AutocompleteRendererBase extends NunjucksRendererBase {
  /**
   * @param {string} questionTemplate
   * @param {RenderContext} renderContext
   */
  render(questionTemplate, renderContext) {
    const html = NunjucksRendererBase.buildHTML(questionTemplate, renderContext)
    const autoCompletePreviewContainer = /** @type {HTMLDivElement} */ (
      document.createElement('div')
    )
    autoCompletePreviewContainer.innerHTML = html.trim()

    const autoCompleteFields = autoCompletePreviewContainer.querySelectorAll(
      '[data-module="govuk-accessible-autocomplete"]'
    )
    Array.from(autoCompleteFields).forEach((autoCompleteField) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      accessibleAutocomplete.enhanceSelectElement({
        defaultValue: '',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        selectElement: autoCompleteField
      })
    })

    const innerEL = /** @type {HTMLElement} */ (
      autoCompletePreviewContainer.firstElementChild
    )
    this._questionElements.setPreviewDOM(innerEL)
  }
}

/**
 * @implements {QuestionRenderer}
 */
export class AutocompleteRenderer {
  /**
   * @type {AutocompleteRendererBase}
   * @protected
   */
  _renderBase
  /**
   * @param {QuestionElements} questionElements
   */
  constructor(questionElements) {
    this._renderBase = new AutocompleteRendererBase(questionElements)
  }

  /**
   * @param {string} questionTemplate
   * @param {QuestionBaseModel} questionBaseModel
   */
  render(questionTemplate, questionBaseModel) {
    /**
     * @type {RenderContext}
     */
    const renderContext = { model: questionBaseModel }

    this._renderBase.render(questionTemplate, renderContext)
  }
}

/**
 * @import { QuestionRenderer, QuestionBaseModel, RenderContext, QuestionElements } from '@defra/forms-model'
 */
