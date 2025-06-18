import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { Question } from '~/src/index.js'

export class SelectQuestion extends ListSortableQuestion {
  _questionTemplate = Question.PATH + 'selectfield.njk'

  get renderInput() {
    const afterInputs =
      /** @type {{ formGroup?: { afterInputs: { html: string } } }} */ (
        this.list.length
          ? {}
          : {
              formGroup: {
                afterInput: {
                  html: this._listElements.afterInputsHTML
                }
              }
            }
      )

    return {
      id: this._fieldName,
      name: this._fieldName,
      hint: this.hint,
      label: this.label,
      items: this.list,
      classes: this.list.length ? undefined : 'govuk-visually-hidden',
      ...afterInputs
    }
  }
}
