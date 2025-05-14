import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { Question } from '~/src/index.js'

export class RadioSortableQuestion extends ListSortableQuestion {
  _questionTemplate = Question.PATH + 'radios.njk'
}
