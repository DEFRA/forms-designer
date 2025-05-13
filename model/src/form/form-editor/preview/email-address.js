import { Question } from '~/src/form/form-editor/preview/question.js'

export class EmailAddressQuestion extends Question {
  _questionTemplate = 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'
}
