import { Question } from '~/src/form/form-editor/preview/question.js'

export class EmailAddressQuestion extends Question {
  questionTemplate = Question.PATH + 'emailaddressfield.njk'
  fieldName = 'emailAddressField'
}
