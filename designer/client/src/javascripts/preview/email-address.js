import { Question } from '~/src/javascripts/preview/question.js'

export class EmailAddress extends Question {
  _questionTemplate = 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'
}
