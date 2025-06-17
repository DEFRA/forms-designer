import { ComponentType } from '~/src/components/enums.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class RadioSortableQuestion extends ListSortableQuestion {
  _questionTemplate = PreviewComponent.PATH + 'radios.njk'
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.RadiosField
}
