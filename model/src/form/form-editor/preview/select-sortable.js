import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { ComponentType } from '~/src/index.js'

export class SelectSortableQuestion extends ListSortableQuestion {
  _questionTemplate = PreviewComponent.PATH + 'selectfield.njk'

  get selectList() {
    return this.list.length
      ? [{ id: '', value: '', text: ' ' }, ...this.list]
      : this.list
  }

  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.SelectField

  get renderInput() {
    const afterInput =
      /** @type {{ formGroup?: { afterInput: { html: string }} }} */ (
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
      items: this.selectList,
      classes: this.list.length ? '' : 'govuk-visually-hidden',
      ...afterInput
    }
  }
}

/**
 * @import { FormGroupAfterInput }  from '~/src/form/form-editor/macros/types.js'
 */
