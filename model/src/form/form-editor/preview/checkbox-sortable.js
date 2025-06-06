import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { Question } from '~/src/form/form-editor/preview/question.js'

export class CheckboxSortableQuestion extends ListSortableQuestion {
  /**
   * @type {string}
   */
  questionTemplate = Question.PATH + 'checkboxesfield.njk'
  listRenderId = 'checkboxField'
  listRenderName = 'checkboxField'
}
