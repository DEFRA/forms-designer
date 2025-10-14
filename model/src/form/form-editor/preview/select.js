import { ComponentType } from '~/src/components/enums.js'
import { HIGHLIGHT_CLASS } from '~/src/form/form-editor/preview/constants.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'
import { buildCombinedId } from '~/src/form/form-editor/preview/utils.js'

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

    return {
      id: buildCombinedId(this._fieldName, this._id),
      name: this._fieldName,
      hint: this.hint,
      label: this.label,
      items: this.list,
      classes: this.list.length ? highlightedClass : 'govuk-visually-hidden',
      ...afterInput
    }
  }
}

/**
 * @import { ListItemReadonly } from '~/src/form/form-editor/types.js'
 * @import { FormGroupAfterInput }  from '~/src/form/form-editor/macros/types.js'
 */
