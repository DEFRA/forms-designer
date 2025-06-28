import { ComponentType } from '~/src/components/enums.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class SelectQuestion extends ListQuestion {
  _questionTemplate = PreviewComponent.PATH + 'selectfield.njk'
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
}

/**
 * @import { ListItemReadonly } from '~/src/form/form-editor/types.js'
 */
