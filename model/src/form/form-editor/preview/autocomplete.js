import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { Question } from '~/src/index.js'

export class AutocompleteQuestion extends ListQuestion {
  _questionTemplate = Question.PATH + 'autocompletefield.njk'
  /**
   * @type {string}
   * @protected
   */
  _fieldName = 'autoCompleteField'

  get autoCompleteList() {
    const iterator = /** @type {MapIterator<ListElement>} */ (
      this._list.values()
    )

    return Array.from(iterator).map(({ text, value }) => ({
      id: `${value}`,
      text,
      value
    }))
  }

  get label() {
    return {
      classes: '',
      text: 'Start typing to select an option'
    }
  }

  get renderInput() {
    return {
      id: this._fieldName,
      name: this._fieldName,
      attributes: { 'data-module': 'govuk-accessible-autocomplete' },
      hint: this.hint,
      fieldset: this.fieldSet,
      label: this.label,
      items: this.autoCompleteList
    }
  }
}

/**
 * @import { ListElement } from '~/src/form/form-editor/types.js'
 */
