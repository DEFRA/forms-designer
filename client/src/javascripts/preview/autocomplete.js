import {
  EventListeners,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

/**
 * @implements {AutocompleteElements}
 */
export class AutocompleteDOMElements extends QuestionDomElements {
  static LIST_ELEMENT_ID = 'autoCompleteOptions'

  /**
   * @type {HTMLInputElement}
   */
  autocompleteOptionsEl

  constructor() {
    super()
    const autocompleteOptionsEl = /** @type {HTMLInputElement} */ (
      document.getElementById(AutocompleteDOMElements.LIST_ELEMENT_ID)
    )
    this.autocompleteOptionsEl = autocompleteOptionsEl
  }

  /**
   * @returns {string}
   */
  get autocompleteOptions() {
    return this.autocompleteOptionsEl.value
  }
}

export class AutocompleteListeners extends EventListeners {
  /**
   * @type {AutocompleteDOMElements}
   * @private
   */
  _autocompleteDOMElements
  /**
   * @type {AutocompleteQuestion}
   * @private
   */
  _autocompleteQuestion
  /**
   * @param {AutocompleteQuestion} question
   * @param {AutocompleteDOMElements} baseElements
   */
  constructor(question, baseElements) {
    super(question, baseElements)
    this._autocompleteQuestion = question
    this._autocompleteDOMElements = baseElements
  }

  /**
   * @protected
   * @returns {ListenerRow[]}
   */
  get _customListeners() {
    const autocompleteOptions = /** @type {ListenerRow} */ ([
      this._autocompleteDOMElements.autocompleteOptionsEl,
      /**
       * @param {HTMLInputElement} target
       */
      (target) => {
        this._autocompleteQuestion.setAutocompleteList(target.value)
      },
      'input'
    ])
    return [autocompleteOptions]
  }
}

/**
 * @import { AutocompleteElements, ListenerRow, ListQuestion, ListElement, ListItemReadonly, QuestionElements, QuestionRenderer, HTMLBuilder, BaseSettings, AutocompleteQuestion } from '@defra/forms-model'
 */
