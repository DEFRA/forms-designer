import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

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

    const highlightedClass = this._highlighted ? HIGHLIGHT_CLASS : ''

    const idSuffix = this._id ? `-${this._id}` : ''

    return {
      id: `${this._fieldName}${idSuffix}`,
      name: this._fieldName,
      hint: this.hint,
      label: this.label,
      items: this.selectList,
      classes: this.list.length ? highlightedClass : 'govuk-visually-hidden',
      ...afterInput
    }
  }
}

/**
 * @import { FormGroupAfterInput }  from '~/src/form/form-editor/macros/types.js'
 */
