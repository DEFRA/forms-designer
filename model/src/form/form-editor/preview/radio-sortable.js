import { ListSortableQuestion } from '~/src/form/form-editor/preview/list-sortable.js'
import { Question } from '~/src/index.js'

export class RadioSortableQuestion extends ListSortableQuestion {
  questionTemplate = Question.PATH + 'radios.njk'
}
