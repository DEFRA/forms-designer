import { ComponentType } from '~/src/components/enums.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class CheckboxSortableQuestion extends ListSortableQuestion {
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.CheckboxesField
  /**
   * @type {string}
   * @protected
   */
  _questionTemplate = Question.PATH + 'checkboxesfield.njk'
  listRenderId = 'checkboxField'
  listRenderName = 'checkboxField'
}
