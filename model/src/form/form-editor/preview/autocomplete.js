import { autoCompleteOptionsSchema } from '~/src/form/form-editor/index.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class AutocompleteQuestion extends Question {
  _questionTemplate = Question.PATH + 'autocompletefield.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'autoCompleteField'
  /**
   * @type {ListElement[]}
   * @private
   */
  _autocompleteList = []

  /**
   * @param {AutocompleteElements} autocompleteElements
   * @param {QuestionRenderer} questionRenderer
   */
  constructor(autocompleteElements, questionRenderer) {
    super(autocompleteElements, questionRenderer)

    if (autocompleteElements.autocompleteOptions) {
      // handle interactive (client-side JS) autocomplete options
      this.setAutocompleteList(autocompleteElements.autocompleteOptions)
    } else {
      // handle non-interactive (server-side) autocomplete options
      const listItems = autocompleteElements.values.items
      this.setAutocompleteListFromParsed(listItems)
    }
  }

  get autoCompleteList() {
    return [{ id: '', value: '', text: '' }, ...this._autocompleteList]
  }

  /**
   * @param {string} listHTML
   */
  setAutocompleteList(listHTML) {
    const validationResult =
      /** @type {ValidationResult<{text: string, value: string}[]>} */ (
        autoCompleteOptionsSchema.validate(listHTML)
      )

    if (!validationResult.error) {
      this._autocompleteList = validationResult.value.map(
        ({ text, value }) => ({
          id: text,
          text,
          value
        })
      )
      this.render()
    }
  }

  /**
   * @param {AutocompleteElements['values']['items']} listItems
   */
  setAutocompleteListFromParsed(listItems) {
    this._autocompleteList = listItems
    this.render()
  }

  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      attributes: { 'data-module': 'govuk-accessible-autocomplete' },
      hint: this.hint,
      label: this.label,
      items: this.autoCompleteList
    }
  }
}

/**
 * @import { ValidationResult } from 'joi'
 * @import { ListElement } from '~/src/form/form-editor/types.js'
 * @import { AutocompleteElements, QuestionRenderer } from '~/src/form/form-editor/preview/types.js'
 */
