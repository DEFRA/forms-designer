import { FieldsetQuestion } from '~/src/form/form-editor/preview/fieldset-question.js'
import { Question } from '~/src/index.js'

export class UkAddressQuestion extends FieldsetQuestion {
  questionTemplate = Question.PATH + 'ukaddressfield.njk'
  fieldName = 'addressField'
}

/**
 * @import { QuestionBaseModel } from '~/src/form/form-editor/preview/types.js'
 */
