import { ComponentType } from '~/src/components/enums.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class RadioQuestion extends ListQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.RadiosField
  _questionTemplate = PreviewComponent.PATH + 'radios.njk'
}
