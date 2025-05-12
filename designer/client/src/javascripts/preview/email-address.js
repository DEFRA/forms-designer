import { Question } from '@defra/forms-designer/client/src/javascripts/preview/question.js'

export class EmailAddress extends Question {
  _questionTemplate = 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'
}
