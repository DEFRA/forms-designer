// @ts-expect-error no types set for accessible autocomplete
import accessibleAutocomplete from 'accessible-autocomplete'

import { NunjucksRendererBase } from '~/src/javascripts/preview/nunjucks-renderer.js'

/**
 * @implements {QuestionRenderer}
 */
export class AutocompleteRenderer {
  /**
   * @type {NunjucksRendererBase}
   * @protected
   */
  _renderBase
  /**
   * @param {QuestionElements} questionElements
   */
  constructor(questionElements) {
    this._renderBase = new NunjucksRendererBase(questionElements)
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
    const html = NunjucksRendererBase.buildHTML(questionTemplate, renderContext)
    const autoCompletePreviewContainer = /** @type {HTMLDivElement} */ (
      document.createElement('div')
    )
    autoCompletePreviewContainer.innerHTML = html.trim()
    const autoCompleteField =
      autoCompletePreviewContainer.querySelector('#autoCompleteField')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    accessibleAutocomplete.enhanceSelectElement({
      defaultValue: '',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      selectElement: autoCompleteField
    })

    const innerEL = /** @type {HTMLElement} */ (
      autoCompletePreviewContainer.firstElementChild
    )

    this._renderBase.questionElements.setPreviewDOM(innerEL)
  }
}

/**
 * @import { QuestionRenderer, QuestionBaseModel, RenderContext, QuestionElements } from '@defra/forms-model'
 */
