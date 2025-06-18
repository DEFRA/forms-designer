import { ComponentType } from '~/src/components/enums.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class SelectSortableQuestion extends ListSortableQuestion {
  _questionTemplate = PreviewComponent.PATH + 'selectfield.njk'
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.SelectField

  get renderInput() {
    const afterInput =
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
      classes: this.list.length ? '' : 'govuk-visually-hidden',
      ...afterInput
    }
  }
}
