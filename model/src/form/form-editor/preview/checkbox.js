import { ComponentType } from '~/src/components/enums.js'
import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { PreviewComponent } from '~/src/form/form-editor/preview/preview.js'

export class CheckboxQuestion extends ListQuestion {
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
