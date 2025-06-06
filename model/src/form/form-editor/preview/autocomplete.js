import { autoCompleteOptionsSchema } from '~/src/form/form-editor/index.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class AutocompleteQuestion extends Question {
  questionTemplate = Question.PATH + 'autocompletefield.njk'
  /**
   * @type {string}
   * @public
   */
  fieldName = 'autoCompleteField'
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
    this.setAutocompleteList(autocompleteElements.autocompleteOptions)
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

  get renderInput() {
    return {
      id: this.fieldName,
      name: this.fieldName,
      attributes: { 'data-module': 'govuk-accessible-autocomplete' },
      hint: this.hint,
      label: this.label,
      items: this.autoCompleteList
    }
  }
}

/**
 * @import { QuestionRenderer } from '~/src/form/form-editor/preview/questionRenderer.js'
 * @import { ValidationResult } from 'joi'
 * @import { ListElement } from '~/src/form/form-editor/types.js'
 * @import { AutocompleteElements } from '~/src/form/form-editor/preview/types.js'
 */
