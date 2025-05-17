import { QuestionDomElements } from '~/src/javascripts/preview/question.js'

/**
 * @implements {AutocompleteElements}
 */
export class AutocompleteDOMElements extends QuestionDomElements {
  static LIST_ELEMENT_ID = 'autoCompleteOptions'

  /**
   * @type {HTMLInputElement}
   * @protected
   */
  _autocompleteOptionsEl

  constructor() {
    super()
    const autocompleteOptionsEl = /** @type {HTMLInputElement} */ (
      document.getElementById(AutocompleteDOMElements.LIST_ELEMENT_ID)
    )
    this._autocompleteOptionsEl = autocompleteOptionsEl
  }

  /**
   * @returns {string}
   */
  get autocompleteOptions() {
    return this._autocompleteOptionsEl.value
  }
}

/**
 * @import { AutocompleteElements, ListenerRow, ListQuestion, ListElement, ListItemReadonly, QuestionElements, QuestionRenderer, HTMLBuilder, BaseSettings } from '@defra/forms-model'
 */
