import { ComponentType } from '~/src/components/enums.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class CheckboxSortableQuestion extends ListSortableQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.CheckboxesField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = PreviewComponent.PATH + 'checkboxesfield.njk'
  listRenderId = 'checkboxField'
  listRenderName = 'checkboxField'
}
