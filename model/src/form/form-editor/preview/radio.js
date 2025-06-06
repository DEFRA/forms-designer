import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { Question } from '~/src/index.js'

export class RadioQuestion extends ListQuestion {
  questionTemplate = Question.PATH + 'radios.njk'
}
