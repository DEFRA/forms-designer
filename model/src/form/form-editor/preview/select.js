import { ComponentType } from '~/src/components/enums.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class SelectQuestion extends ListQuestion {
  _questionTemplate = PreviewComponent.PATH + 'selectfield.njk'
  _fieldName = 'selectInput'
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.SelectField

  /**
   * @returns {ListItemReadonly[]}
   */
  get list() {
    return this._getList()
  }

  get renderInput() {
    const afterInput = /** @type {{ formGroup?: FormGroupAfterInput }} */ (
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

/**
 * @import { ListItemReadonly } from '~/src/form/form-editor/types.js'
 * @import { FormGroupAfterInput }  from '~/src/form/form-editor/macros/types.js'
 */
