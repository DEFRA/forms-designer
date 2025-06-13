import { ComponentType } from '~/src/components/enums.js'
import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { Question } from '~/src/index.js'

export class SelectSortableQuestion extends ListSortableQuestion {
  _questionTemplate = Question.PATH + 'selectfield.njk'
  /**
   * @type {ComponentType}
   */
  componentType = ComponentType.SelectField
}
