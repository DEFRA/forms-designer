import {
  Question,
  QuestionDomElements
} from '~/src/javascripts/preview/question.js'

export class EmailAddress extends Question {
  _questionTemplate = 'emailaddressfield.njk'
  _fieldName = 'emailAddressField'

  /**
   * @returns {EmailAddress}
   */
  static setupPreview() {
    const questionElements = new QuestionDomElements()
    const email = new EmailAddress(questionElements)
    email.init(questionElements)

    return email
  }
}
