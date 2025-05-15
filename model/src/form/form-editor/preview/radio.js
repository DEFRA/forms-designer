import { ListQuestion } from '~/src/form/form-editor/preview/list.js'
import { Question } from '~/src/index.js'

export class RadioQuestion extends ListQuestion {
  _questionTemplate = Question.PATH + 'radios.njk'
}
